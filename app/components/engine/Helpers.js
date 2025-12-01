import { getMeasurementsFromDimensions } from 'utils';
import { base } from 'utils/constants';


function createRollOverGeometry(width, height, depth, dimensions) {
  const type = dimensions.type || 'rectangle';

  switch (type) {
    case 'cylinder':
      const radius = Math.min(width, depth) / 2;
      return new THREE.CylinderGeometry(radius, radius, height, 32);

    case 'cone':
      const coneRadius = Math.min(width, depth) / 2;
      return new THREE.ConeGeometry(coneRadius, height, 32);

    case 'slope45':
    case 'slope33':
    case 'slopeInverted':
      // Create wedge geometry for slope preview
      const shape = new THREE.Shape();
      shape.moveTo(0, 0);
      shape.lineTo(width, 0);
      shape.lineTo(width, height);
      shape.lineTo(0, 0);

      const extrudeSettings = {
        steps: 1,
        depth: depth,
        bevelEnabled: false
      };

      const slopeGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      slopeGeo.center();

      if (type === 'slopeInverted') {
        slopeGeo.rotateX(Math.PI);
      }

      return slopeGeo;

    case 'plate':
      // Plates are thinner (1/3 height)
      return new THREE.BoxGeometry(width, height / 3, depth);

    case 'tile':
      // Tiles are flat with no knobs (1/3 height)
      return new THREE.BoxGeometry(width, height / 3, depth);

    case 'rectangle':
    default:
      // Default rectangular brick
      return new THREE.BoxGeometry(width, height, depth);
  }
}


export class RollOverBrick extends THREE.Mesh {
  constructor(color, dimensions) {
    const { width, height, depth } = getMeasurementsFromDimensions(dimensions);
    const rollOverGeo = createRollOverGeometry(width, height, depth, dimensions);
    const mat = new THREE.MeshBasicMaterial( { color: 0x08173D, opacity: 0.5, transparent: true } );
    super(rollOverGeo, mat);
    this.dimensions = dimensions;
    this.rotated = null;
    this.translation = 0;
  }

  setShape(dimensions) {
    const { width, height, depth } = getMeasurementsFromDimensions(dimensions);
    this.geometry = createRollOverGeometry(width, height, depth, dimensions);
    this.dimensions = dimensions;
    this.translation = 0;
    if (!!this.rotated) {
      this.rotateY( -this.rotated );
    }
    this.rotated = null;
    console.log('set shape, reset');
  }

  rotate(angle) {
    if (!!this.rotated) {
      if ((this.dimensions.z % 2 !== 0 && this.dimensions.x % 2 === 0) ||
          (this.dimensions.x % 2 !== 0 && this.dimensions.z % 2 === 0)) {
        this.geometry.translate( base / 2, 0, base / 2 );
        this.translation = 0;
      }
      this.rotateY( -angle );
      this.rotated = null;
    }
    else {
      if ((this.dimensions.z % 2 !== 0 && this.dimensions.x % 2 === 0) ||
          (this.dimensions.x % 2 !== 0 && this.dimensions.z % 2 === 0)) {
        this.geometry.translate( -base / 2, 0, -base / 2 );
        this.translation = - base / 2;
      }
      this.rotateY( angle );
      this.rotated = angle;
    }
  }
}
