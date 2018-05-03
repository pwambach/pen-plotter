const fs = require('fs');
const perspectiveCamera = require('perspective-camera');
const {linesToSvg} = require('../../src/lib/lines-to-svg');
const {getBounds2d} = require('../../src/lib/get-bounds-2d');
const {linesToGcode} = require('../../src/lib/lines-to-gcode');
const {plot} = require('../../src/lib/plot');

const width = 150;
const height = 150;

const camera = perspectiveCamera({
  fov: Math.PI/4,
  near: 0.1,
  far: 100,
  viewport: [0, 0, width, height]
});
 
//set up our camera 
camera.translate([-80, -100, -80]);
camera.lookAt([0, 20, 0]);
camera.update();

const n = 100;
const lines = Array.from({length: n})
  .map((_, ix) => Array.from({length: n})
    .map((_, iz) => {
      const x = ix - n/2;
      const z = iz - n/2;
      const y = Math.random() * x * z * 0.005;
      return camera.project([x, y, z]).map(c => c + 10);
    })
  );

console.log(getBounds2d(lines));

fs.writeFileSync('preview.svg', linesToSvg(lines, {viewboxX: width, viewboxY: height}));

const commands = linesToGcode(lines);
plot('/dev/tty.wchusbserial1450', commands);
