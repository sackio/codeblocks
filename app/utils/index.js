import React from 'react';
import { base } from './constants';
import * as Icons from 'components/Icons';


// Convert RGBA color object to THREE.js hex color (0xRRGGBB)
export function RGBAToHex(rgbaColor) {
  const { r, g, b } = rgbaColor;
  return (r << 16) | (g << 8) | b;
}

// Convert RGBA object to CSS rgba string
export function RGBAToCSS(rgbaColor) {
  const { r, g, b, a } = rgbaColor;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Convert RGBA object to hex string
export function RGBAToHexString(rgbaColor) {
  const { r, g, b } = rgbaColor;
  const toHex = (n) => {
    const hex = n.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Shade an RGBA color by a percentage
export function shadeColor(rgbaColor, percent) {
  let { r, g, b, a } = rgbaColor;

  r = parseInt(r * (100 + percent) / 100);
  g = parseInt(g * (100 + percent) / 100);
  b = parseInt(b * (100 + percent) / 100);

  r = r < 255 ? r : 255;
  g = g < 255 ? g : 255;
  b = b < 255 ? b : 255;

  return { r, g, b, a };
};


export function getMeasurementsFromDimensions({ x, y, z }) {
  // Use integer height to avoid floating point precision issues in brick positioning
  // (base * 2) / 1.5 = 33.333... which causes stacking/overlap artifacts
  const defaultHeight = Math.round((base * 2) / 1.5); // = 33 for base=25
  // Properly handle undefined/null y to avoid NaN (base * undefined = NaN, which is truthy!)
  const height = (y !== undefined && y !== null) ? base * y : defaultHeight;
  console.log('[getMeasurementsFromDimensions]', { x, y, z, defaultHeight, calculatedHeight: height });
  return { width: base * x, height, depth: base * z };
}


export function displayNameFromDimensions(dimensions) {
  // Include height if specified
  const baseName = dimensions.y
    ? `${dimensions.x}×${dimensions.y}×${dimensions.z}`
    : `${dimensions.x}×${dimensions.z}`;

  // For non-rectangle shapes, add shape type to display name
  if (dimensions.type && dimensions.type !== 'rectangle') {
    const typeLabel = dimensions.type.replace(/([A-Z])/g, ' $1').trim();
    return `${baseName} ${typeLabel}`;
  }

  return baseName;
}


export function getBrickIconFromDimensions(dimensions) {
  const type = dimensions.type || 'rectangle';

  // Shape type specific icons
  const shapeIconMap = {
    'slope45': 'Slope45Icon',
    'slope33': 'Slope33Icon',
    'slopeInverted': 'SlopeInvertedIcon',
    'cornerInside': 'CornerInsideIcon',
    'cornerOutside': 'CornerOutsideIcon',
    'cornerRound': 'CornerRoundIcon',
    'curve': 'CurveIcon',
    'arch': 'ArchIcon',
    'cylinder': 'CylinderIcon',
    'cone': 'ConeIcon',
    'wedge': 'WedgeIcon',
    'plate': 'PlateIcon',
    'tile': 'TileIcon',
  };

  // If it's a special shape, return the shape icon
  if (shapeIconMap[type]) {
    const ShapeIcon = Icons[shapeIconMap[type]];
    return ShapeIcon ? <ShapeIcon /> : <Icons.SimpleBrick />;
  }

  // For rectangles, use dimension-based icons
  if (type === 'rectangle') {
    const Icon = Icons[`B${dimensions.x}x${dimensions.z}`];
    return Icon ? <Icon /> : <Icons.SimpleBrick />;
  }

  // Default fallback
  return <Icons.SimpleBrick />;
}
