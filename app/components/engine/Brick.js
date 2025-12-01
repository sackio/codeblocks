import v4 from 'uuid';

import { mergeMeshes, degToRad } from 'utils/threejs';
import BufferSubdivisionModifier from 'utils/threejs/BufferSubdivisionModifier';
import { RGBAToHex, shadeColor, getMeasurementsFromDimensions } from 'utils';
import { base } from 'utils/constants';


const knobSize = 7;


export default class Brick extends THREE.Mesh {
  constructor(intersect, color, dimensions, rotation, translation) {
    const cubeMaterial = new THREE.MeshStandardMaterial({
      color: RGBAToHex(color),
      metalness: 0.4,
      roughness: 0.5,
      transparent: true,
      opacity: color.a,
    });
    const { height, width, depth } = getMeasurementsFromDimensions(dimensions);
    const props = createMesh(cubeMaterial, width, height, depth, dimensions);
    super(...props);

    const evenWidth = dimensions.x % 2 === 0;
    const evenDepth = dimensions.z % 2 === 0;

    this.height = height;
    this.width = width;
    this.depth = depth;
    this.position.copy( intersect.point ).add( intersect.face.normal );
    this.position.divide( new THREE.Vector3(base, height, base) ).floor()
      .multiply( new THREE.Vector3(base, height, base) )
      .add( new THREE.Vector3( evenWidth ? base : base / 2, height / 2, evenDepth ? base : base / 2 ) );
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
  for ( var i = 0; i < dimensions.x; i++ ) {
    for ( var j = 0; j < dimensions.z; j++ ) {
      const cylinder = new THREE.Mesh(cylinderGeo, material);
      cylinder.position.x = base * i - ((dimensions.x - 1) * base / 2),
      cylinder.position.y = base / 1.5,
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
  // For now, use a simple box with corner modifications
  // TODO: Implement proper corner geometries
  return createRectangleMesh(material, width, height, depth, dimensions);
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
  const plateHeight = height / 3;
  return createRectangleMesh(material, width, plateHeight, depth, dimensions);
}


function createTileMesh(material, width, height, depth, dimensions) {
  // Tiles are flat with no knobs
  let meshes = [];
  const cubeGeo = new THREE.BoxGeometry( width - 0.1, height / 3 - 0.1, depth - 0.1 );

  const mesh = new THREE.Mesh(cubeGeo, material);
  meshes.push(mesh);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  const brickGeometry = mergeMeshes(meshes);
  return [brickGeometry, material];
}
