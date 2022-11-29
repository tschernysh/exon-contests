const Tronweb = require('tronweb');
const {config} = require('../config/config');

const tronweb = () => {
	const fullHost = config().TRON_GRID;
	const fullNode = config().TRON_GRID;
	const solidityNode = config().TRON_GRID;
	const eventServer = config().TRON_GRID;
	const privateKey = config().PRIVATE_KEY;
	return new Tronweb(fullNode, fullHost, solidityNode, eventServer, privateKey);
}

module.exports.tronweb = tronweb
