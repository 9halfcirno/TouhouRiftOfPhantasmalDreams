/* thid -> namespace:type=id
*/

const ID = {
	idRegexp: /([a-zA-Z0-9_$]+)\:([a-zA-Z0-9_$]+)\=(.+)/,
	parse(str) {
		let match = str.match(this.idRegexp);
		if (!match) throw new Error(`无法解析的thid: "${str}"`);
		return {
			namespace: match[1],
			type: match[2],
			id: match[3]
		}
	}
}

export {ID}