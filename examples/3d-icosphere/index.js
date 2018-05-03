const fs = require('fs');
const perspectiveCamera = require('perspective-camera');
const icosphere = require('icosphere');
const {linesToSvg} = require('../../src/lib/lines-to-svg');
const {getBounds2d} = require('../../src/lib/get-bounds-2d');
const {linesToGcode} = require('../../src/lib/lines-to-gcode');
const {plot} = require('../../src/lib/plot');

const width = 100;
const height = 100;

const camera = perspectiveCamera({
  fov: Math.PI/4,
  near: 0.1,
  far: 100,
  viewport: [0, 0, width, height]
});
 
//set up our camera 
camera.translate([-2, -2, -2]);
camera.lookAt([0, 0, 0]);
camera.update();

const sphere = icosphere(2);

const lines = sphere.cells.map((indizes) => {
  return indizes
    .map(i => sphere.positions[i])
    .map(p => camera.project(p));
})

console.log(getBounds2d(lines));

fs.writeFileSync('preview.svg', linesToSvg(lines, {viewboxX: width, viewboxY: height}));

const commands = linesToGcode(lines);
plot('/dev/tty.wchusbserial1450', commands);
