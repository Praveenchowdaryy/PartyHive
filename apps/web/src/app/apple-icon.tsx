import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#090D16',
          borderRadius: '38px',
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox="0 0 44 44"
          width="180"
          height="180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="apple-border-grad" x1="5" y1="3" x2="39" y2="41" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" />
              <stop offset="0.5" stopColor="#FF5E62" />
              <stop offset="1" stopColor="#8B5CF6" />
            </linearGradient>
            <linearGradient id="apple-crown-grad" x1="13" y1="19" x2="31" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#06B6D4" />
              <stop offset="0.5" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#FF5E62" />
            </linearGradient>
          </defs>

          {/* Outer Honeycomb Shield */}
          <polygon
            points="22,4 38,13 38,31 22,40 6,31 6,13"
            fill="#0E1424"
            stroke="url(#apple-border-grad)"
            strokeWidth="2"
          />

          {/* Inner Hexagon Core */}
          <polygon
            points="22,8 34,15 34,29 22,36 10,29 10,15"
            fill="#181428"
          />

          {/* Party Crown */}
          <path
            d="M13 27L17 19L22 24L27 19L31 27"
            stroke="url(#apple-crown-grad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Crown Jewels */}
          <circle cx="17" cy="18" r="2.8" fill="#06B6D4" />
          <circle cx="27" cy="18" r="2.8" fill="#FF5E62" />
          <circle cx="22" cy="13" r="3.2" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="0.8" />

          {/* Base Connection */}
          <path
            d="M15 31C18 30 24 30 27 31"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
