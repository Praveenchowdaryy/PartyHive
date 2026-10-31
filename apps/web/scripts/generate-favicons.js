const { ImageResponse } = require('next/og');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Raw Vector SVG for public/icon.svg
const rawSvg = `<svg viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
      <stop stop-color="#12182B" />
      <stop offset="1" stop-color="#080C16" />
    </linearGradient>
    <linearGradient id="border-grad" x1="5" y1="3" x2="39" y2="41" gradientUnits="userSpaceOnUse">
      <stop stop-color="#F59E0B" />
      <stop offset="0.5" stop-color="#FF5E62" />
      <stop offset="1" stop-color="#8B5CF6" />
    </linearGradient>
    <linearGradient id="crown-grad" x1="13" y1="19" x2="31" y2="28" gradientUnits="userSpaceOnUse">
      <stop stop-color="#06B6D4" />
      <stop offset="0.5" stop-color="#F59E0B" />
      <stop offset="1" stop-color="#FF5E62" />
    </linearGradient>
  </defs>

  <!-- Background rounded pill -->
  <rect width="44" height="44" rx="10" fill="url(#bg-grad)" />

  <!-- Outer Honeycomb Shield -->
  <polygon
    points="22,4 38,13 38,31 22,40 6,31 6,13"
    fill="#0E1424"
    stroke="url(#border-grad)"
    stroke-width="1.8"
  />

  <!-- Inner Hexagon -->
  <polygon
    points="22,8 34,15 34,29 22,36 10,29 10,15"
    fill="#181428"
  />

  <!-- Crown Trident Lines -->
  <path
    d="M13 27L17 19L22 24L27 19L31 27"
    stroke="url(#crown-grad)"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  />

  <!-- Crown Jewel Nodes -->
  <circle cx="17" cy="18" r="2.8" fill="#06B6D4" />
  <circle cx="27" cy="18" r="2.8" fill="#FF5E62" />
  <circle cx="22" cy="13" r="3.2" fill="#F59E0B" stroke="#FFFFFF" stroke-width="0.8" />

  <!-- Bottom Smile Bar -->
  <path
    d="M15 31C18 30 24 30 27 31"
    stroke="#FDE047"
    stroke-width="2"
    stroke-linecap="round"
  />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), rawSvg, 'utf8');
console.log('✓ Created public/icon.svg');

// Helper to create the ImageResponse JSX tree
function createIconVNode(size) {
  const scale = size / 44;
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#090D16',
        borderRadius: `${Math.round(size * 0.22)}px`,
        overflow: 'hidden',
      },
      children: {
        type: 'svg',
        props: {
          viewBox: '0 0 44 44',
          width: `${size}`,
          height: `${size}`,
          children: [
            {
              type: 'defs',
              props: {
                children: [
                  {
                    type: 'linearGradient',
                    props: {
                      id: `border-grad-${size}`,
                      x1: '5',
                      y1: '3',
                      x2: '39',
                      y2: '41',
                      children: [
                        { type: 'stop', props: { stopColor: '#F59E0B' } },
                        { type: 'stop', props: { offset: '0.5', stopColor: '#FF5E62' } },
                        { type: 'stop', props: { offset: '1', stopColor: '#8B5CF6' } },
                      ],
                    },
                  },
                  {
                    type: 'linearGradient',
                    props: {
                      id: `crown-grad-${size}`,
                      x1: '13',
                      y1: '19',
                      x2: '31',
                      y2: '28',
                      children: [
                        { type: 'stop', props: { stopColor: '#06B6D4' } },
                        { type: 'stop', props: { offset: '0.5', stopColor: '#F59E0B' } },
                        { type: 'stop', props: { offset: '1', stopColor: '#FF5E62' } },
                      ],
                    },
                  },
                ],
              },
            },
            {
              type: 'polygon',
              props: {
                points: '22,4 38,13 38,31 22,40 6,31 6,13',
                fill: '#0E1424',
                stroke: `url(#border-grad-${size})`,
                strokeWidth: '2',
              },
            },
            {
              type: 'polygon',
              props: {
                points: '22,8 34,15 34,29 22,36 10,29 10,15',
                fill: '#181428',
              },
            },
            {
              type: 'path',
              props: {
                d: 'M13 27L17 19L22 24L27 19L31 27',
                stroke: `url(#crown-grad-${size})`,
                strokeWidth: '2.5',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
              },
            },
            {
              type: 'circle',
              props: { cx: '17', cy: '18', r: '2.8', fill: '#06B6D4' },
            },
            {
              type: 'circle',
              props: { cx: '27', cy: '18', r: '2.8', fill: '#FF5E62' },
            },
            {
              type: 'circle',
              props: {
                cx: '22',
                cy: '13',
                r: '3.2',
                fill: '#F59E0B',
                stroke: '#FFFFFF',
                strokeWidth: '0.8',
              },
            },
            {
              type: 'path',
              props: {
                d: 'M15 31C18 30 24 30 27 31',
                stroke: '#FDE047',
                strokeWidth: '2',
                strokeLinecap: 'round',
              },
            },
          ],
        },
      },
    },
  };
}

async function generatePng(size) {
  const vnode = createIconVNode(size);
  const img = new ImageResponse(vnode, { width: size, height: size });
  return Buffer.from(await img.arrayBuffer());
}

function createIcoFromPng(pngBuffer, size = 48) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(1, 4); // 1 image

  const dirEntry = Buffer.alloc(16);
  dirEntry.writeUInt8(size >= 256 ? 0 : size, 0); // width
  dirEntry.writeUInt8(size >= 256 ? 0 : size, 1); // height
  dirEntry.writeUInt8(0, 2); // color palette count
  dirEntry.writeUInt8(0, 3); // reserved
  dirEntry.writeUInt16LE(1, 4); // color planes
  dirEntry.writeUInt16LE(32, 6); // bits per pixel
  dirEntry.writeUInt32LE(pngBuffer.length, 8); // image size in bytes
  dirEntry.writeUInt32LE(22, 12); // offset (6 + 16 = 22)

  return Buffer.concat([header, dirEntry, pngBuffer]);
}

async function main() {
  // 192x192 (Official Google Search favicon size multiple of 48)
  const png192 = await generatePng(192);
  fs.writeFileSync(path.join(publicDir, 'icon.png'), png192);
  console.log('✓ Created public/icon.png (192x192)');

  // 512x512 (PWA & Android splash)
  const png512 = await generatePng(512);
  fs.writeFileSync(path.join(publicDir, 'icon-512.png'), png512);
  console.log('✓ Created public/icon-512.png (512x512)');

  // 180x180 (Apple Touch Icon)
  const png180 = await generatePng(180);
  fs.writeFileSync(path.join(publicDir, 'apple-icon.png'), png180);
  console.log('✓ Created public/apple-icon.png (180x180)');

  // 48x48 (Root favicon.ico for Googlebot & standard browsers)
  const png48 = await generatePng(48);
  const ico48 = createIcoFromPng(png48, 48);
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico48);
  console.log('✓ Created public/favicon.ico (48x48 ICO with embedded PNG)');

  // Web App Manifest
  const manifest = {
    name: 'PartyHive — Real-Time Multiplayer Party Games',
    short_name: 'PartyHive',
    description: 'The all-in-one real-time multiplayer party games platform.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090D16',
    theme_color: '#8B5CF6',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };

  fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ Created public/manifest.json');
}

main().catch(console.error);
