const Tronweb = require('tronweb')

const tronweb = () => {
	const fullNode = 'https://api.trongrid.io';                                                                                                                              
	const solidityNode = 'https://api.trongrid.io';                                  
	const eventServer = 'https://api.trongrid.io';																																												
	const privateKey = '4c9e3cc79e2ca287f6694e1892083d7c0697724edf4e443a6fb5c89c25a8a1e5';
	
	return new Tronweb(fullNode,solidityNode,eventServer,privateKey);         
}

module.exports.tronweb = tronweb
