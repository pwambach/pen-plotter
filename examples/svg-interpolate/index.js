const fs = require('fs');
const SVGPathInterpolator = require('svg-path-interpolator');
const chunk = require('lodash.chunk');
const {linesToSvg} = require('../../src/lib/lines-to-svg');
const {getBounds2d} = require('../../src/lib/get-bounds-2d');

// const svgString = `
// <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
// width="792px" height="612px" viewBox="0 0 792 612" enable-background="new 0 0 792 612" xml:space="preserve">
//     <g>
//         <path id="path3789" d="M287.168,442.411
//         c-8.65,0-15.652,7.003-15.652,15.653
//         c0,8.65,7.003,15.69,15.652,15.69
//         s15.653-7.04,15.653-15.69
//         "/>
//     </g>
// </svg>
// `;
const svgString = fs.readFileSync('../../assets/example5.svg');

const config = {
    joinPathData: false,
    minDistance: 2,
    roundToNearest: 0.01,
    sampleFrequency: 0.01
};

const interpolator = new SVGPathInterpolator(config);
const pathData = interpolator.processSvg(svgString);

let points = Object.values(pathData);

// add first point at the end to close path
// points.forEach(p => {
//     const firstPoint = p.slice(0, 2);
//     p.push(...firstPoint);
// });

// console.log(points);

const lines = points.map(line => chunk(line, 2));

console.log(getBounds2d(lines));

//console.log(lines.map(x => x.length));
//console.log(points.length);


fs.writeFileSync('preview.svg', linesToSvg(lines, {viewboxX: 300, viewboxY: 300}));
