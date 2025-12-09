import v4 from 'uuid';

import { mergeMeshes, degToRad } from 'utils/threejs';
import BufferSubdivisionModifier from 'utils/threejs/BufferSubdivisionModifier';
import { RGBAToHex, shadeColor, getMeasurementsFromDimensions } from 'utils';
import { base } from 'utils/constants';


const knobSize = 7;


export default class Brick extends THREE.Mesh {
  constructor(intersect, color, dimensions, rotation, translation) {
    console.log('[Brick constructor]', { dimensions, color, rotation, translation });
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: RGBAToHex(color),
      metalness: 0.4,
      roughness: 0.5,
      transparent: true,
      opacity: color.a,
    });
    const { height, width, depth } = getMeasurementsFromDimensions(dimensions);
    console.log('[Brick constructor] measurements:', { height, width, depth });
    const props = createMesh(cubeMaterial, width, height, depth, dimensions);
    super(...props);

    const evenWidth = dimensions.x % 2 === 0;
    const evenDepth = dimensions.z % 2 === 0;

    this.height = height;
    this.width = width;
    this.depth = depth;

    // Calculate position based on intersect
    this.position.copy( intersect.point ).add( intersect.face.normal );

    // Check if this is a scripted brick (no intersect.object means createBrick() API call)
    const isScriptedBrick = !intersect.object;

    // Check if we're placing on top of another brick (face normal pointing up)
    const isPlacingOnTop = intersect.face &&
                           intersect.face.normal.y > 0.9 &&
                           intersect.object &&
                           intersect.object.type === 'Mesh';

    if (isScriptedBrick) {
      // Scripted bricks: use exact positions without grid snapping
      // Scripts specify the exact center position for brick placement
      // Just add height/2 to get brick bottom at specified Y
      this.position.x = intersect.point.x;
      this.position.y = intersect.point.y + height / 2;
      this.position.z = intersect.point.z;
    } else if (isPlacingOnTop) {
      // Placing on brick: snap to exact top surface of the brick below
      // Get the intersect object's bounding box to find its exact top
      const bbox = new THREE.Box3().setFromObject(intersect.object);
      const topY = bbox.max.y;

      // Calculate knob protrusion above brick body
      // Knobs are positioned at base/1.5 with height knobSize (7)
      // Top of knob = base/1.5 + knobSize/2 = 16.67 + 3.5 = 20.17
      // Top of standard brick body = (base*2/1.5)/2 = 16.5
      // Knob protrusion = 20.17 - 16.5 = 3.67
      const knobProtrusion = (base / 1.5) + (knobSize / 2) - ((base * 2) / 1.5 / 2);

      // Snap X and Z to grid, and snap Y to top of brick body (not top of knobs)
      // This makes the brick snap DOWN onto the knobs like real LEGO
      this.position.x = Math.floor(this.position.x / base) * base + (evenWidth ? base : base / 2);
      this.position.y = topY - knobProtrusion + height / 2;
      this.position.z = Math.floor(this.position.z / base) * base + (evenDepth ? base : base / 2);
    } else {
      // Placing on ground: use grid snapping for all axes
      console.log('[Brick] Before ground snap:', { y: this.position.y, height, evenWidth });
      this.position.divide( new THREE.Vector3(base, base, base) ).floor()
        .multiply( new THREE.Vector3(base, base, base) )
        .add( new THREE.Vector3( evenWidth ? base : base / 2, height / 2, evenDepth ? base : base / 2 ) );
      console.log('[Brick] After ground snap:', { y: this.position.y, heightOver2: height / 2 });
    }
    this.rotation.y = rotation;
    this.geometry.translate(translation, 0, translation);
    this.castShadow = true;
    this.receiveShadow = true;
    this.customId = v4();
    this.defaultColor = cubeMaterial.color;

    this._intersect = intersect;
    this._color = color;
    this._dimensions = dimensions;
    this._rotation = rotation;
    this._translation = translation;
  }

  updateColor(color) {
    this.material.setValues({
      color: RGBAToHex(color),
      opacity: color.a
    });
    this.defaultColor = this.material.color;
    this._color = color;
  }

  // rotate(rotation) {
  //   this.rotateY(degToRad(rotation));
  // }
}


function createMesh(material, width, height, depth, dimensions) {
  const type = dimensions.type || 'rectangle';

  // Handle different shape types
  switch (type) {
    case 'rectangle':
      return createRectangleMesh(material, width, height, depth, dimensions);

    case 'slope45':
    case 'slope33':
    case 'slopeInverted':
      return createSlopeMesh(material, width, height, depth, dimensions, type);

    case 'cornerInside':
    case 'cornerOutside':
    case 'cornerRound':
      return createCornerMesh(material, width, height, depth, dimensions, type);

    case 'cylinder':
      return createCylinderShapeMesh(material, width, height, depth, dimensions);

    case 'cone':
      return createConeMesh(material, width, height, depth, dimensions);

    case 'wedge':
      return createWedgeMesh(material, width, height, depth, dimensions);

    case 'arch':
      return createArchMesh(material, width, height, depth, dimensions);

    case 'curve':
      return createCurveMesh(material, width, height, depth, dimensions);

    case 'plate':
      return createPlateMesh(material, width, height, depth, dimensions);

    case 'tile':
      return createTileMesh(material, width, height, depth, dimensions);

    default:
      // For other shapes, use rectangle as placeholder for now
      return createRectangleMesh(material, width, height, depth, dimensions);
  }
}


function createRectangleMesh(material, width, height, depth, dimensions) {
  let meshes = [];
  const cubeGeo = new THREE.BoxGeometry( width - 0.1, height - 0.1, depth - 0.1 );
  const cylinderGeo = new THREE.CylinderGeometry( knobSize, knobSize, knobSize, 20);

  const mesh = new THREE.Mesh(cubeGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  // Add knobs on top
  // Position knobs at the top of the brick body (height/2) regardless of brick type
  const knobY = height / 2;

  for ( var i = 0; i < dimensions.x; i++ ) {
    for ( var j = 0; j < dimensions.z; j++ ) {
      const cylinder = new THREE.Mesh(cylinderGeo, material);
      cylinder.position.x = base * i - ((dimensions.x - 1) * base / 2),
      cylinder.position.y = knobY,
      cylinder.position.z = base * j - ((dimensions.z - 1) * base / 2),

      cylinder.castShadow = true;
      cylinder.receiveShadow = true;
      meshes.push( cylinder );
    }
  }

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createSlopeMesh(material, width, height, depth, dimensions, type) {
  let meshes = [];

  // Create wedge geometry for slope
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(width - 0.1, 0);
  shape.lineTo(width - 0.1, height - 0.1);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: depth - 0.1,
    bevelEnabled: false
  };

  const slopeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  slopeGeo.center();

  if (type === 'slopeInverted') {
    slopeGeo.rotateX(Math.PI);
  }

  const mesh = new THREE.Mesh(slopeGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createCornerMesh(material, width, height, depth, dimensions, type) {
  let meshes = [];

  // Create L-shaped corner piece using CSG-like approach with two boxes
  const box1Geo = new THREE.BoxGeometry(width - 0.1, height - 0.1, depth / 2 - 0.1);
  const box2Geo = new THREE.BoxGeometry(width / 2 - 0.1, height - 0.1, depth / 2 - 0.1);

  const mesh1 = new THREE.Mesh(box1Geo, material);
  mesh1.position.z = -depth / 4;
  meshes.push(mesh1);
  mesh1.castShadow = true;
  mesh1.receiveShadow = true;

  const mesh2 = new THREE.Mesh(box2Geo, material);
  mesh2.position.x = -width / 4;
  mesh2.position.z = depth / 4;
  meshes.push(mesh2);
  mesh2.castShadow = true;
  mesh2.receiveShadow = true;

  if (type === 'cornerRound') {
    // Add a rounded corner using a cylinder
    const cornerRadius = Math.min(width, depth) / 4;
    const cylinderGeo = new THREE.CylinderGeometry(cornerRadius, cornerRadius, height - 0.1, 16);
    const cornerMesh = new THREE.Mesh(cylinderGeo, material);
    cornerMesh.position.x = width / 4;
    cornerMesh.position.z = -depth / 4;
    meshes.push(cornerMesh);
    cornerMesh.castShadow = true;
    cornerMesh.receiveShadow = true;
  }

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createCylinderShapeMesh(material, width, height, depth, dimensions) {
  let meshes = [];
  const radius = Math.min(width, depth) / 2 - 0.1;
  const cylinderGeo = new THREE.CylinderGeometry(radius, radius, height - 0.1, 32);

  const mesh = new THREE.Mesh(cylinderGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createConeMesh(material, width, height, depth, dimensions) {
  let meshes = [];
  const radius = Math.min(width, depth) / 2 - 0.1;
  const coneGeo = new THREE.ConeGeometry(radius, height - 0.1, 32);

  const mesh = new THREE.Mesh(coneGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createPlateMesh(material, width, height, depth, dimensions) {
  // Plates are thinner than regular bricks (1/3 height)
  // Height is already adjusted by getMeasurementsFromDimensions
  return createRectangleMesh(material, width, height, depth, dimensions);
}


function createTileMesh(material, width, height, depth, dimensions) {
  // Tiles are flat with no knobs (1/3 height)
  // Height is already adjusted by getMeasurementsFromDimensions
  let meshes = [];
  const cubeGeo = new THREE.BoxGeometry( width - 0.1, height - 0.1, depth - 0.1 );

  const mesh = new THREE.Mesh(cubeGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createWedgeMesh(material, width, height, depth, dimensions) {
  let meshes = [];

  // Create wedge geometry (pyramid-like shape)
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(width - 0.1, 0);
  shape.lineTo(width / 2 - 0.05, height - 0.1);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: depth - 0.1,
    bevelEnabled: false
  };

  const wedgeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  wedgeGeo.center();

  const mesh = new THREE.Mesh(wedgeGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createArchMesh(material, width, height, depth, dimensions) {
  let meshes = [];

  // Create arch using an extruded 2D shape with arch cutout
  const shape = new THREE.Shape();

  // Outer rectangle
  const w = width - 0.1;
  const h = height - 0.1;

  shape.moveTo(-w/2, -h/2);
  shape.lineTo(w/2, -h/2);
  shape.lineTo(w/2, h/2);
  shape.lineTo(-w/2, h/2);
  shape.lineTo(-w/2, -h/2);

  // Create arch hole (semicircular cutout)
  const archWidth = w * 0.5; // Opening is 50% of width
  const archHeight = h * 0.6; // Arch goes up 60% of height
  const archRadius = archWidth / 2;
  const archBaseY = -h/2 + archHeight - archRadius;

  // Create a path for the arch hole
  const hole = new THREE.Path();

  // Start at bottom left of arch opening
  hole.moveTo(-archWidth/2, -h/2);
  // Line up to where arch curve starts
  hole.lineTo(-archWidth/2, archBaseY);
  // Create semicircular arc
  hole.absarc(0, archBaseY, archRadius, Math.PI, 0, false);
  // Line down right side
  hole.lineTo(archWidth/2, -h/2);
  // Close the hole
  hole.lineTo(-archWidth/2, -h/2);

  shape.holes.push(hole);

  const extrudeSettings = {
    steps: 1,
    depth: depth - 0.1,
    bevelEnabled: false
  };

  const archGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  archGeo.center();

  const mesh = new THREE.Mesh(archGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}


function createCurveMesh(material, width, height, depth, dimensions) {
  let meshes = [];

  // Create curved brick using bent cylinder
  const curveRadius = width / Math.PI;
  const curveGeo = new THREE.CylinderGeometry(
    curveRadius - 0.1,
    curveRadius - 0.1,
    depth - 0.1,
    32,
    1,
    false,
    0,
    Math.PI
  );
  curveGeo.rotateZ(Math.PI / 2);

  const mesh = new THREE.Mesh(curveGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}
