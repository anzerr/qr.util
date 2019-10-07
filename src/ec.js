
const ENUM = require('./enum.js');

class EC {

	exp(k) {
		while (k < 0) {
			k += 255;
		}
		while (k > 255) {
			k -= 255;
		}
		return ENUM.EXP_TABLE[k];
	}

	log(k) {
		if (k < 1 || k > 255) {
			throw Error('Bad log(' + k + ')');
		}
		return ENUM.LOG_TABLE[k];
	}

	generatorPolynomial(num) {
		if (ENUM.POLYNOMIALS[num]) {
			return ENUM.POLYNOMIALS[num];
		}
		let prev = this.generatorPolynomial(num - 1);
		let res = [];

		res[0] = prev[0];
		for (let i = 1; i <= num; i++) {
			res[i] = this.log(this.exp(prev[i]) ^ this.exp(prev[i - 1] + num - 1));
		}
		ENUM.POLYNOMIALS[num] = res;
		return res;
	}

}
let ec = new EC();

module.exports = (msg, ecLen) => {
	msg = [].slice.call(msg);

	let poly = ec.generatorPolynomial(ecLen);

	for (let i = 0; i < ecLen; i++) {
		msg.push(0);
	}
	while (msg.length > ecLen) {
		if (!msg[0]) {
			msg.shift();
			continue;
		}
		let logK = ec.log(msg[0]);
		for (let i = 0; i <= ecLen; i++) {
			msg[i] = msg[i] ^ ec.exp(poly[i] + logK);
		}
		msg.shift();
	}
	return Buffer.from(msg);
};
