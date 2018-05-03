function linesToGcode(lines) {
  const absolutePositioning = 'G90';
  const resetToZero = ['G92 X0', 'G92 Y0'];
  const park = 'M03 S0';
  const up = 'M03 S10';
  const down = 'M03 S30';
  const goTo = ([x, y]) => [
      'G1',
      typeof x === 'number' && `X${x}`,
      typeof y === 'number' && `Y${y}`,
      'F5000'
    ].filter(Boolean).join(' ');

  const commands = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const firstPoint = line[0];
    const lastPoint = line[line.length - 1];
    const nextLine = lines[i + 1];

    commands.push(goTo(firstPoint));
    commands.push(down);
    const points = line.map(p => goTo(p));
    commands.push(...points);

    if (nextLine) {
      const [p1next] = nextLine;

      // next line starts where current line ends -> don't lift pen
      if (lastPoint[0] === p1next[0] && lastPoint[1] === p1next[1]) {
        commands.pop();
        continue;
      }
    }

    commands.push(up);
  }

  return [
    absolutePositioning,
    ...resetToZero,
    up,
    ...commands,
    park,
    goTo([0, 0])
  ].map(command => `${command}\r`);
}

module.exports = {linesToGcode};
