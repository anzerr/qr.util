
const VERSIONS = [
	[],
	[26, 7, 1, 10, 1, 13, 1, 17, 1],
	[44, 10, 1, 16, 1, 22, 1, 28, 1],
	[70, 15, 1, 26, 1, 36, 2, 44, 2],
	[100, 20, 1, 36, 2, 52, 2, 64, 4],
	[134, 26, 1, 48, 2, 72, 4, 88, 4], // 5
	[172, 36, 2, 64, 4, 96, 4, 112, 4],
	[196, 40, 2, 72, 4, 108, 6, 130, 5],
	[242, 48, 2, 88, 4, 132, 6, 156, 6],
	[292, 60, 2, 110, 5, 160, 8, 192, 8],
	[346, 72, 4, 130, 5, 192, 8, 224, 8], // 10
	[404, 80, 4, 150, 5, 224, 8, 264, 11],
	[466, 96, 4, 176, 8, 260, 10, 308, 11],
	[532, 104, 4, 198, 9, 288, 12, 352, 16],
	[581, 120, 4, 216, 9, 320, 16, 384, 16],
	[655, 132, 6, 240, 10, 360, 12, 432, 18], // 15
	[733, 144, 6, 280, 10, 408, 17, 480, 16],
	[815, 168, 6, 308, 11, 448, 16, 532, 19],
	[901, 180, 6, 338, 13, 504, 18, 588, 21],
	[991, 196, 7, 364, 14, 546, 21, 650, 25],
	[1085, 224, 8, 416, 16, 600, 20, 700, 25], // 20
	[1156, 224, 8, 442, 17, 644, 23, 750, 25],
	[1258, 252, 9, 476, 17, 690, 23, 816, 34],
	[1364, 270, 9, 504, 18, 750, 25, 900, 30],
	[1474, 300, 10, 560, 20, 810, 27, 960, 32],
	[1588, 312, 12, 588, 21, 870, 29, 1050, 35], // 25
	[1706, 336, 12, 644, 23, 952, 34, 1110, 37],
	[1828, 360, 12, 700, 25, 1020, 34, 1200, 40],
	[1921, 390, 13, 728, 26, 1050, 35, 1260, 42],
	[2051, 420, 14, 784, 28, 1140, 38, 1350, 45],
	[2185, 450, 15, 812, 29, 1200, 40, 1440, 48], // 30
	[2323, 480, 16, 868, 31, 1290, 43, 1530, 51],
	[2465, 510, 17, 924, 33, 1350, 45, 1620, 54],
	[2611, 540, 18, 980, 35, 1440, 48, 1710, 57],
	[2761, 570, 19, 1036, 37, 1530, 51, 1800, 60],
	[2876, 570, 19, 1064, 38, 1590, 53, 1890, 63], // 35
	[3034, 600, 20, 1120, 40, 1680, 56, 1980, 66],
	[3196, 630, 21, 1204, 43, 1770, 59, 2100, 70],
	[3362, 660, 22, 1260, 45, 1860, 62, 2220, 74],
	[3532, 720, 24, 1316, 47, 1950, 65, 2310, 77],
	[3706, 750, 25, 1372, 49, 2040, 68, 2430, 81] // 40
];

const EC_LEVELS = ['L', 'M', 'Q', 'H'];

let GF256_BASE = 285;

let EXP_TABLE = [1];
let LOG_TABLE = [];

for (let i = 1; i < 256; i++) {
	let n = EXP_TABLE[i - 1] << 1;
	if (n > 255) {
		n = n ^ GF256_BASE;
	}
	EXP_TABLE[i] = n;
}

for (let i = 0; i < 255; i++) {
	LOG_TABLE[EXP_TABLE[i]] = i;
}

module.exports = {

	EC_LEVELS: EC_LEVELS,

	GF256_BASE: GF256_BASE,

	EXP_TABLE: EXP_TABLE,

	LOG_TABLE: LOG_TABLE,

	POLYNOMIALS: [
		[0], // a^0 x^0
		[0, 0], // a^0 x^1 + a^0 x^0
		[0, 25, 1], // a^0 x^2 + a^25 x^1 + a^1 x^0
		// and so on...
	],

	VERSIONS: VERSIONS.map((v, index) => {
		if (!index) {
			return {};
		}

		let res = {};
		for (let i = 1; i < 8; i += 2) {
			let length = v[0] - v[i];
			let numTemplate = v[i + 1];
			let ecLevel = EC_LEVELS[(i / 2)|0];
			let level = {
				version: index,
				ecLevel: ecLevel,
				dataLen: length,
				ecLen: v[i] / numTemplate,
				blocks: [],
				ec: []
			};

			for (let k = numTemplate, n = length; k > 0; k--) {
				let block = (n / k)|0;
				level.blocks.push(block);
				n -= block;
			}
			res[ecLevel] = level;
		}
		return res;
	}),

	ALPHANUM: ((s) => {
		let res = {};
		for (let i = 0; i < s.length; i++) {
			res[s[i]] = i;
		}
		return res;
	})('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:')
};