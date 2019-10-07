

declare class Qr {

	constructor(text: any, eclevel: any, url: any)
	toConsole(print?: boolean): string;
	toSvg(option?: {scale?: number, html?: boolean}): string;
	toArray(): number[][];
	toString(): string;

}

export default Qr;