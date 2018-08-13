

const fs = require('fs');
const perspectiveCamera = require('perspective-camera');
const {linesToSvg} = require('../../src/lib/lines-to-svg');

const vec3 = require('gl-vec3');
const mat4 = require('gl-mat4');
const {linesToGcode} = require('../../src/lib/lines-to-gcode');
const {plot} = require('../../src/lib/plot');
const {getBounds2d} = require('../../src/lib/get-bounds-2d');

function getCube() {
  return [
    [[0.5,0.5,0.5], [-0.5,0.5,0.5], [-0.5,0.5,-0.5], [0.5,0.5,-0.5], [0.5,0.5,0.5]],
    [[0.5,-0.5,0.5], [-0.5,-0.5,0.5], [-0.5,-0.5,-0.5], [0.5,-0.5,-0.5], [0.5,-0.5,0.5]],
    [[-0.5,-0.5,-0.5], [-0.5,0.5,-0.5]],
    [[0.5,-0.5,-0.5], [0.5,0.5,-0.5]],
    [[0.5,-0.5,0.5], [0.5,0.5,0.5]],
    [[-0.5,-0.5,0.5], [-0.5,0.5,0.5]]
  ]
}

const width = 100;
const height = 100;

const camera = perspectiveCamera({
  fov: Math.PI/4,
  near: 0.1,
  far: 100,
  viewport: [0, 0, width, height]
});

//set up our camera
camera.translate([-10, -2, -2]);
camera.lookAt([0, 0, 0]);
camera.update();


const cubes = Array
  .from({length: 100}).map(() => getCube())
  .map(((cube, index) => {
    const matrix = mat4.create();
    // mat4.rotateX(matrix, matrix, Math.random());
    // mat4.rotateY(matrix, matrix, Math.random());
    // mat4.rotateZ(matrix, matrix, Math.random());
    mat4.scale(matrix, matrix, vec3.fromValues(15,15,15))
    mat4.translate(matrix, matrix, vec3.fromValues(
      index % 10,
      Math.floor(index / 10),
      0
    ));
    mat4.scale(matrix, matrix, vec3.fromValues(0.5,0.5,0.5));
    mat4.rotateY(matrix, matrix, index / 100 * Math.PI / 2);
    mat4.rotateX(matrix, matrix, index / 100 * Math.PI / 2);
    mat4.rotateZ(matrix, matrix, index / 100 * Math.PI / 2);
    return transform(cube, matrix);
  }))
  .reduce((total, cube) => total.concat(cube), [])

  console.log(cubes);
  

// const flatLines = cubes;

// log(flatLines);

// const lines = cubes.map(points => points.map(p => camera.project(p)));

fs.writeFileSync('preview.svg', linesToSvg(cubes, {viewboxX: width, viewboxY: height}));

const commands = linesToGcode(cubes);
console.log(getBounds2d(cubes));
// console.log(commands);

plot('/dev/tty.wchusbserial1460', commands);


function transform(lines, matrix) {
  return lines.map(line => line.map(point => {
    const vec = vec3.fromValues(...point);
    vec3.transformMat4(vec, vec, matrix);
    return [...vec];
  }));
}
