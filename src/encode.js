
const ALPHANUM = (function(s) {
	let res = {};
	for (let i = 0; i < s.length; i++) {
		res[s[i]] = i;
	}
	return res;
}('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'));

class Encode {

	pushBits(arr, n, value) {
		let bit = 1 << (n - 1);
		while (bit) {
			arr.push(bit & value ? 1 : 0);
			bit = bit >>> 1;
		}
		return arr;
	}

	bit(data) {
		let len = data.length, bits = [], out = {};

		for (let i = 0; i < len; i++) {
			this.pushBits(bits, 8, data[i]);
		}

		out.data10 = out.data27 = this.pushBits([0, 1, 0, 0], 16, len).concat(bits);
		if (len < 256) {
			out.data1 = this.pushBits([0, 1, 0, 0], 8, len).concat(bits);
		}

		return out;
	}

	alphanum(str) {
		let len = str.length, bits = [], out = {};

		for (let i = 0; i < len; i += 2) {
			let b = 6;
			let n = ALPHANUM[str[i]];
			if (str[i + 1]) {
				b = 11;
				n = n * 45 + ALPHANUM[str[i + 1]];
			}
			this.pushBits(bits, b, n);
		}

		out.data27 = this.pushBits([0, 0, 1, 0], 13, len).concat(bits);

		if (len < 2048) {
			out.data10 = this.pushBits([0, 0, 1, 0], 11, len).concat(bits);
		}

		if (len < 512) {
			out.data1 = this.pushBits([0, 0, 1, 0], 9, len).concat(bits);
		}

		return out;
	}

	numeric(str) {
		let len = str.length, bits = [], out = {};

		for (let i = 0; i < len; i += 3) {
			let s = str.substr(i, 3);
			let b = Math.ceil(s.length * 10 / 3);
			this.pushBits(bits, b, parseInt(s, 10));
		}

		out.data27 = this.pushBits([0, 0, 0, 1], 14, len).concat(bits);

		if (len < 4096) {
			out.data10 = this.pushBits([0, 0, 0, 1], 12, len).concat(bits);
		}

		if (len < 1024) {
			out.data1 = this.pushBits([0, 0, 0, 1], 10, len).concat(bits);
		}

		return out;
	}

	encode(data, url) {
		let str = null, t = typeof data;

		if (t === 'string' || t === 'number') {
			str = String(data);
			data = Buffer.from(str);
		} else if (Buffer.isBuffer(data)) {
			str = data.toString();
		} else if (Array.isArray(data)) {
			data = Buffer.from(data);
			str = data.toString();
		} else {
			throw new Error('Bad data');
		}

		if ((/^[0-9]+$/).test(str)) {
			if (data.length > 7089) {
				throw new Error('Too much data');
			}
			return this.numeric(str);
		}

		if ((/^[0-9A-Z \$%\*\+\.\/\:\-]+$/).test(str)) {
			if (data.length > 4296) {
				throw new Error('Too much data');
			}
			return this.alphanum(str);
		}

		if (url && (/^https?:/i).test(str)) {
			return this.url(str);
		}

		if (data.length > 2953) {
			throw new Error('Too much data');
		}
		return this.bit(data);
	}

	url(str) {
		let slash = str.indexOf('/', 8) + 1 || str.length;
		let res = this.encode(str.slice(0, slash).toUpperCase(), false);

		if (slash >= str.length) {
			return res;
		}

		let pathRes = this.encode(str.slice(slash), false);

		res.data27 = res.data27.concat(pathRes.data27);

		if (res.data10 && pathRes.data10) {
			res.data10 = res.data10.concat(pathRes.data10);
		}

		if (res.data1 && pathRes.data1) {
			res.data1 = res.data1.concat(pathRes.data1);
		}

		return res;
	}

}
const encode = new Encode();

module.exports = (...arg) => {
	return encode.encode(...arg);
};
