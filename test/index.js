
const Qr = require('../index.js'),
	assert = require('assert'),
	fs = require('fs');

let qr = new Qr('cat');
JSON.parse(qr.toString());
const array = qr.toArray();
assert.equal(Array.isArray(array), true);
assert.equal(Array.isArray(array[0]), true);
assert.equal(qr.toConsole().match('█') !== null, true);
assert.equal(qr.toSvg().match('svg') !== null, true);
// fs.writeFileSync('./test/qr.svg', qr.toSvg());
// fs.writeFileSync('./test/qr.html', `<div style="width:256px;height:256px">${qr.toSvg({html: true})}</div>`);
