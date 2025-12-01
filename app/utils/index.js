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
  return { width: base * x, height: base * y || (base * 2) / 1.5, depth: base * z };
}


export function displayNameFromDimensions(dimensions) {
  return `${dimensions.x}x${dimensions.z}`;
}


export function getBrickIconFromDimensions(dimensions) {
  const Icon = Icons[`B${dimensions.x}x${dimensions.z}`];
  return <Icon />;
}
