import React from 'react';
import { RGBAToCSS } from 'utils';


export const SimpleBrick = ({color}) => {
  const fillColor = color ? (typeof color === 'object' ? RGBAToCSS(color) : color) : '#000000';
  return (
    <svg width="100%" height="100%" viewBox="0 0 36 26">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-16.000000, -245.000000)" fill={fillColor}>
          <path d="M16,248 L52,248 L52,271 L16,271 L16,248 Z M19,245 L30,245 L30,248 L19,248 L19,245 Z M37,245 L48,245 L48,248 L37,248 L37,245 Z" id="Brick"></path>
        </g>
      </g>
    </svg>
  );
}


export const B1x1 = () => {
  return (
    <svg height="100%" viewBox="0 0 55 75">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-723.000000, -266.000000)">
          <g id="Group-Copy-4" transform="translate(723.000000, 266.000000)">
            <polygon id="Rectangle-4" fill="#EB9507" points="0.5 20 28 39 28 75 0.5 56"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="27.5 0.5 55 20 28 39 0.5 20"></polygon>
            <polygon id="Rectangle" fill="#D58400" points="28 39 55 20 55 56 28 75"></polygon>
            <g id="Group-2-Copy" transform="translate(16.000000, 6.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


export const B2x1 = () => {
  return (
    <svg height="100%" viewBox="0 0 81 93">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-431.000000, -308.000000)">
          <g id="Group-Copy-5" transform="translate(471.500000, 354.500000) scale(-1, 1) translate(-471.500000, -354.500000) translate(431.000000, 308.000000)">
            <polygon id="Rectangle-4" fill="#EA9100" points="0 20 54 57 54 93 0 56"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="27 0.5 81 38 54 57 0 20"></polygon>
            <polygon id="Rectangle" fill="#F5A623" points="54 57 81 38 81 74 54 93"></polygon>
            <g id="Group-2" transform="translate(16.000000, 5.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy" transform="translate(42.000000, 24.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


export const B2x2 = () => {
  return (
    <svg height="100%" viewBox="0 0 110 114" version="1.1">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-830.000000, -172.000000)">
          <g id="Group-Copy-3" transform="translate(830.000000, 172.000000)">
            <polygon id="Rectangle-4" fill="#EB9507" points="0 41 54 78 54 114 0 77"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="55.5 0 109.5 39 54 78 0 41"></polygon>
            <polygon id="Rectangle" fill="#D58400" points="54 78 109.5 39 109.5 75 54 114"></polygon>
            <g id="Group-2" transform="translate(16.000000, 26.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-2" transform="translate(43.000000, 6.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy" transform="translate(42.000000, 45.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-3" transform="translate(69.000000, 25.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


export const B3x1 = () => {
  return (
    <svg height="100%" viewBox = "0 0 108 116">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-561.000000, -387.000000)">
          <g id="Group-Copy-6" transform="translate(561.000000, 387.000000)">
            <polygon id="Rectangle-4" fill="#F5A623" points="0 60 28 79.5 28 116 0 96"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="80.5 0.5 108 20 28 79.5 0 60"></polygon>
            <polygon id="Rectangle" fill="#EA9100" points="28 79.5 108 20 108 56 28 116"></polygon>
            <g id="Group-2" transform="translate(16.000000, 45.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-2" transform="translate(43.000000, 25.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-4" transform="translate(69.000000, 6.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


export const B3x2 = () => {
  return (
    <svg height="100%" viewBox="0 0 136 133">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-642.000000, -57.000000)">
          <g id="Group-Copy-2" transform="translate(642.000000, 57.000000)">
            <polygon id="Rectangle-4" fill="#EB9507" points="0 60 54 97 54 133 0 96"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="82 0.5 136 39.5 54 97 0 60"></polygon>
            <polygon id="Rectangle" fill="#D58400" points="54 97 136 39.5 136 75.5 54 133"></polygon>
            <g id="Group-2" transform="translate(16.000000, 45.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-2" transform="translate(43.000000, 25.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-4" transform="translate(69.000000, 6.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy" transform="translate(42.000000, 64.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-3" transform="translate(69.000000, 44.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-5" transform="translate(95.000000, 25.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


export const B4x1 = () => {
  return (
    <svg height="100%" viewBox="0 0 135 131">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-524.000000, -324.000000)">
          <g id="Group-Copy-4" transform="translate(524.000000, 324.000000)">
            <polygon id="Rectangle-4" fill="#EC9B16" points="0 77 27 96 27 131 0 113"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="108 0 135 20 27 96 0 77"></polygon>
            <polygon id="Rectangle" fill="#D58400" points="27 96 135 20 135 56 27 131"></polygon>
            <g id="Group-2" transform="translate(16.000000, 62.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-2" transform="translate(43.000000, 42.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-4" transform="translate(69.000000, 23.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-6" transform="translate(97.000000, 5.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


export const B4x2 = () => {
  return (
    <svg height="100%" viewBox="0 0 162 150">
      <defs>
        <linearGradient x1="8.42483761%" y1="50%" x2="100%" y2="62.9645067%" id="linearGradient-1">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="Desktop" transform="translate(-422.000000, -79.000000)">
          <g id="Group" transform="translate(422.000000, 79.000000)">
            <polygon id="Rectangle-4" fill="#EB9507" points="0 77 54 114 54 150 0 113"></polygon>
            <polygon id="Rectangle-4-Copy" fill="#FFC058" points="108 0 162 39 54 114 0 77"></polygon>
            <polygon id="Rectangle" fill="#D58400" points="54 114 162 39 162 75 54 150"></polygon>
            <g id="Group-2" transform="translate(16.000000, 62.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-2" transform="translate(43.000000, 42.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-4" transform="translate(69.000000, 23.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-6" transform="translate(97.000000, 5.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy" transform="translate(42.000000, 81.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-3" transform="translate(69.000000, 61.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-5" transform="translate(95.000000, 42.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
            <g id="Group-2-Copy-7" transform="translate(123.000000, 24.000000)">
              <path d="M12,23 C18.627417,23 24,19.418278 24,15 C24,12.1878766 24,9.68787658 24,7.5 L0,7.5 C1.10578213e-13,9.7172403 1.6586732e-13,12.2172403 1.6586732e-13,15 C1.6586732e-13,19.418278 5.372583,23 12,23 Z" id="Oval-Copy" fill="#EB9507"></path>
              <ellipse id="Oval" fill="url(#linearGradient-1)" cx="12" cy="8" rx="12" ry="8"></ellipse>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}


// Shape Type Icons
export const Slope45Icon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="slopeGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <polygon fill="#EB9507" points="10,50 30,30 30,50"></polygon>
        <polygon fill="url(#slopeGrad)" points="10,10 50,50 10,50"></polygon>
        <polygon fill="#D58400" points="30,30 50,50 30,50"></polygon>
      </g>
    </svg>
  );
}

export const Slope33Icon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="slope33Grad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <polygon fill="#EB9507" points="10,50 25,35 25,50"></polygon>
        <polygon fill="url(#slope33Grad)" points="10,15 50,50 10,50"></polygon>
        <polygon fill="#D58400" points="25,35 50,50 25,50"></polygon>
      </g>
    </svg>
  );
}

export const SlopeInvertedIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="100%" x2="100%" y2="0%" id="slopeInvGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <polygon fill="#EB9507" points="10,10 30,30 30,10"></polygon>
        <polygon fill="url(#slopeInvGrad)" points="10,10 50,10 10,50"></polygon>
        <polygon fill="#D58400" points="30,30 50,10 30,10"></polygon>
      </g>
    </svg>
  );
}

export const CornerInsideIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="cornerGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <rect fill="#EB9507" x="10" y="30" width="20" height="20"></rect>
        <rect fill="url(#cornerGrad)" x="10" y="10" width="40" height="20"></rect>
        <rect fill="#D58400" x="30" y="30" width="20" height="20"></rect>
      </g>
    </svg>
  );
}

export const CornerOutsideIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="cornerOutGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <polygon fill="#EB9507" points="10,30 30,50 10,50"></polygon>
        <polygon fill="url(#cornerOutGrad)" points="10,10 50,10 30,30 10,30"></polygon>
        <polygon fill="#D58400" points="30,30 50,10 50,50 30,50"></polygon>
      </g>
    </svg>
  );
}

export const CornerRoundIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="cornerRoundGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <path fill="#EB9507" d="M10,30 L10,50 L30,50 Q10,50 10,30"></path>
        <path fill="url(#cornerRoundGrad)" d="M10,10 L50,10 L50,30 Q50,50 30,50 L10,50 L10,30 Q10,10 30,10 L10,10"></path>
        <path fill="#D58400" d="M30,30 Q50,30 50,50 L50,10 L30,10 Q30,30 30,30"></path>
      </g>
    </svg>
  );
}

export const CurveIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="curveGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <path fill="#EB9507" d="M10,20 Q10,50 30,50 L10,50 Z"></path>
        <path fill="url(#curveGrad)" d="M10,10 L50,10 Q50,50 30,50 Q10,50 10,20 Z"></path>
        <path fill="#D58400" d="M30,30 Q50,30 50,50 L50,10 L30,10 Z"></path>
      </g>
    </svg>
  );
}

export const ArchIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="archGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <rect fill="#EB9507" x="10" y="40" width="10" height="10"></rect>
        <path fill="url(#archGrad)" d="M10,10 L50,10 L50,50 L40,50 L40,25 Q30,15 20,25 L20,50 L10,50 Z"></path>
        <rect fill="#D58400" x="40" y="40" width="10" height="10"></rect>
      </g>
    </svg>
  );
}

export const CylinderIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="cylGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <ellipse fill="#EB9507" cx="20" cy="40" rx="10" ry="5"></ellipse>
        <ellipse fill="url(#cylGrad)" cx="30" cy="20" rx="20" ry="10"></ellipse>
        <rect fill="#D58400" x="10" y="20" width="40" height="20"></rect>
        <ellipse fill="#EB9507" cx="30" cy="40" rx="20" ry="10"></ellipse>
      </g>
    </svg>
  );
}

export const ConeIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="coneGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <polygon fill="#EB9507" points="15,50 30,30 30,50"></polygon>
        <polygon fill="url(#coneGrad)" points="30,10 50,50 10,50"></polygon>
        <polygon fill="#D58400" points="30,30 45,50 30,50"></polygon>
        <ellipse fill="#EB9507" cx="30" cy="50" rx="20" ry="5"></ellipse>
      </g>
    </svg>
  );
}

export const WedgeIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="wedgeGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <polygon fill="#EB9507" points="10,50 25,35 10,35"></polygon>
        <polygon fill="url(#wedgeGrad)" points="10,10 50,35 10,35"></polygon>
        <polygon fill="#D58400" points="25,35 50,50 50,35 25,35"></polygon>
        <polygon fill="#EB9507" points="10,35 10,50 50,50 50,35"></polygon>
      </g>
    </svg>
  );
}

export const PlateIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="plateGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <rect fill="#EB9507" x="10" y="40" width="20" height="5"></rect>
        <rect fill="url(#plateGrad)" x="10" y="35" width="40" height="5"></rect>
        <rect fill="#D58400" x="30" y="40" width="20" height="5"></rect>
        <ellipse fill="url(#plateGrad)" cx="20" cy="33" rx="4" ry="3"></ellipse>
        <ellipse fill="url(#plateGrad)" cx="40" cy="33" rx="4" ry="3"></ellipse>
      </g>
    </svg>
  );
}

export const TileIcon = () => {
  return (
    <svg height="100%" viewBox="0 0 60 60">
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="0%" id="tileGrad">
          <stop stopColor="#FFC058" offset="0%"></stop>
          <stop stopColor="#FDB43B" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g>
        <rect fill="#EB9507" x="10" y="38" width="20" height="4"></rect>
        <rect fill="url(#tileGrad)" x="10" y="34" width="40" height="4"></rect>
        <rect fill="#D58400" x="30" y="38" width="20" height="4"></rect>
      </g>
    </svg>
  );
}
