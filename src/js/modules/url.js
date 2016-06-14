class Url {
	constructor() {
		this.hash = location.hash;
	}

	getHashReg(param) {
		return new RegExp('([#&]' + param + '=)([^&]*)(.*)$');
	}

	getHash(param) {
		let reg = this.getHashReg(param);
		let m = this.hash.match(reg);

		if (m == null) {
			return null;
		}

		return m[2];
	}

	setHash(param, value) {
		let reg = this.getHashReg(param);
		let test = this.getHash(param);
		let initHash = '#' + param + '=' + value;
		let str = test == null ? initHash : this.hash.replace(reg, '$1' + value + '$3');

		location.hash = str.substring(1);
	}
}

export default Url;
