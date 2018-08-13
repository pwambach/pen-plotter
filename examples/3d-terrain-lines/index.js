const fs = require('fs');
const {PNG} = require('pngjs');
const perspectiveCamera = require('perspective-camera');
const {linesToSvg} = require('../../src/lib/lines-to-svg');
const {getBounds2d} = require('../../src/lib/get-bounds-2d');
const {linesToGcode} = require('../../src/lib/lines-to-gcode');
const {plot} = require('../../src/lib/plot');

const data = fs.readFileSync('terrain.png');
const png = PNG.sync.read(data);
const pixels = new Uint8Array(png.data);
const heights = new Float32Array(pixels.length / 4);

for (let i = 0; i < pixels.length; i=i+4) {
  const r = pixels[i];
  const g = pixels[i + 1];
  const b = pixels[i + 2];
  const a = pixels[i + 3];
  heights[i / 4] = -10000 + ((r * 256 * 256 + g * 256 + b) * 0.1);
}

const width = 250;
const height = 170;

const camera = perspectiveCamera({
  fov: Math.PI/4,
  near: 0.1,
  far: 1000,
  viewport: [0, 0, width, height]
});
 
//set up our camera 
camera.translate([100, -100, -100]);
camera.lookAt([0, -10, 0]);
camera.update();

const n = 100;
const lines = Array.from({length: n})
  .map((_, ix) => Array.from({length: n})
    .map((_, iz) => {
      const x = ix - n / 2;
      const z = iz - n / 2;

      const ihx = Math.floor(ix / n * 256);
      const ihz = Math.floor(iz / n * 256);
      const index = ihx * 256 + ihz;
      
      const y = heights[index] / -60;
      return camera.project([x, y, z]);
    })
  );

console.log(getBounds2d(lines));

// fs.writeFileSync('preview.svg', linesToSvg(lines, {
//   viewBoxXmin: -20,
//   viewBoxYmin: -20,
//   viewboxX: width + 20,
//   viewboxY: height + 100
// }));

const commands = linesToGcode(lines);
plot('/dev/tty.wchusbserial1440', commands);
