
const encode = require('./encode.js'),
	ENUM = require('./enum.js'),
	calculateEC = require('./ec.js'),
	matrix = require('./matrix.js'),
	clone = require('clone.util');

class QR {

	getTemplate(message, ecLevel) {
		let i = 1;
		let len = undefined;

		if (message.data1) {
			len = Math.ceil(message.data1.length / 8);
		} else {
			i = 10;
		}
		for (/* i */; i < 10; i++) {
			let version = ENUM.VERSIONS[i][ecLevel];
			if (version.dataLen >= len) {
				return clone(version);
			}
		}

		if (message.data10) {
			len = Math.ceil(message.data10.length / 8);
		} else {
			i = 27;
		}
		for (/* i */; i < 27; i++) {
			let version = ENUM.VERSIONS[i][ecLevel];
			if (version.dataLen >= len) {
				return clone(version);
			}
		}

		len = Math.ceil(message.data27.length / 8);
		for (/* i */; i < 41; i++) {
			let version = ENUM.VERSIONS[i][ecLevel];
			if (version.dataLen >= len) {
				return clone(version);
			}
		}
		throw new Error('Too much data');
	}

	fillTemplate(message, template) {
		let blocks = Buffer.alloc(template.dataLen);
		blocks.fill(0);

		if (template.version < 10) {
			message = message.data1;
		} else if (template.version < 27) {
			message = message.data10;
		} else {
			message = message.data27;
		}

		let len = message.length;

		for (let i = 0; i < len; i += 8) {
			let b = 0;
			for (let j = 0; j < 8; j++) {
				b = (b << 1) | (message[i + j] ? 1 : 0);
			}
			blocks[i / 8] = b;
		}

		let pad = 236;
		for (let i = Math.ceil((len + 4) / 8); i < blocks.length; i++) {
			blocks[i] = pad;
			pad = (pad === 236) ? 17 : 236;
		}

		let offset = 0;
		template.blocks = template.blocks.map((n) => {
			let b = blocks.slice(offset, offset + n);
			offset += n;
			template.ec.push(calculateEC(b, template.ecLen));
			return b;
		});

		return template;
	}

}
const qr = new QR();

module.exports = (text, eclevel, url) => {
	let ec = ENUM.EC_LEVELS.indexOf(eclevel) > -1 ? eclevel : 'M';
	let message = encode(text, url);
	let data = qr.fillTemplate(message, qr.getTemplate(message, ec));
	return matrix.getMatrix(data);
};
