const axios = require('axios')
const { config } = require('../config/config')

api =	axios.create({
	baseUrl: config().TRONLIST,
	responseType: 'json'
}) 

 const getTokenByAddress = (tokenAddress) => 
	api.get(`${config().TRONLIST + tokenAddress}&showAll=1`, {
		crossDomain: true,
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		}
	})

module.exports.getTokenByAddress = getTokenByAddress
