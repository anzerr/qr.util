
const qrcode = require('./src/qrcode.js'),
	color = require('console.color');

class Qr {

	constructor(...arg) {
		this.arg = arg;
	}

	toConsole(print = false) {
		const a = this.toArray();
		let out = color.white('██'.repeat(a[0].length + 2)) + '\n';
		for (let x in a) {
			out += color.white('██');
			for (let y in a[x]) {
				out += (a[x][y]) ? '  ' : color.white('██');
			}
			out += color.white('██\n');
		}
		out += color.white('██'.repeat(a[0].length + 2));
		if (print) {
			process.stdout.write(out);
		}
		return out;
	}

	toSvg(option = {}) {
		const a = this.toArray(), {scale, html} = {scale: 1, ...option};
		let svg = `<svg viewBox="0 0 ${a.length * scale} ${a[0].length * scale}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"><g>`;
		for (let x in a) {
			for (let y in a[x]) {
				if (a[x][y]) {
					svg += `<rect x="${x * scale}" y="${y * scale}" width="${scale}" height="${scale}" style="fill:black;"/>`;
				}
			}
		}
		svg = `${svg}</g></svg>`;
		if (html) {
			return `<img src="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"/>`;
		}
		return svg;
	}

	toArray() {
		return qrcode(...this.arg);
	}

	toString() {
		return JSON.stringify(this.toArray());
	}

}

module.exports = Qr;
module.exports.default = Qr;
