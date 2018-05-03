function linesToSvg(lines, options = {}) {
  const {
    width='0.2',
    viewBoxXmin = 0,
    viewBoxYmin = 0,
    viewboxX = 100,
    viewboxY = 100,
    color = 'black'
  } = options;

  return [
    `<svg viewBox="${viewBoxXmin} ${viewBoxYmin} ${viewboxX} ${viewboxY}" xmlns="http://www.w3.org/2000/svg">`,
    `  <g fill="none" stroke="${color}" stroke-width="${width}">`,
    lines
      .map(line => linePath(line))
      .join('\n'),
    '  </g>',
    '</svg>'
  ].join('\n');
}

function linePath(line) {
  const firstPoint = line[0];
  const restPoints = line
    .slice(1, line.length)
    .map(([x,y]) => `L${x} ${y}`)
    .join(' ');
  const [x,y] = firstPoint;
  return `    <path d="M${x} ${y} ${restPoints}" />`;
}

module.exports = {linesToSvg};
