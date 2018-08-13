const fs = require('fs');
const path = require('path');
const {linesToSvg} = require('../../src/lib/lines-to-svg');
const {getBounds2d} = require('../../src/lib/get-bounds-2d');
const {linesToGcode} = require('../../src/lib/lines-to-gcode');
const {plot} = require('../../src/lib/plot');

const width = 250;
const height = 170;
const scale = 80;
const xOffset = scale / 2 - 5;
const yOffset = scale / 2 + 80;

const NUM = 300;

const lines = Array.from({length: NUM}).map((line, i) => {
  const a = i / NUM;
  const PI = Math.PI;

  return (
    [
      [Math.cos((a * a * PI) / 2), Math.sin(a * PI)],
      [Math.sin(a), Math.cos(a * PI)]
    ]
      // scale + translate
      .map(p => [p[0] * scale + xOffset, p[1] * scale + yOffset])
      // flip
      .map(([x, y]) => [y, x])
  );
});

const commands = linesToGcode(lines);
console.log(commands);
console.log(getBounds2d(lines));

fs.writeFileSync(
  path.resolve(__dirname, 'preview.svg'),
  linesToSvg(lines, {width: 0.1, viewboxX: width, viewboxY: height})
);

plot('/dev/tty.wchusbserial1460', commands);
