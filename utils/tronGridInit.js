const {tronweb} = require("./tronwebInit")
const TronGrid = require('trongrid')

const tronGrid = () => {
	const tronGrid = new TronGrid(tronweb)
	return tronGrid
}

module.exports.tronGrid = tronGrid
