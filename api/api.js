const axios = require('axios')
const { config } = require('../config/config')

api =	axios.create({
	baseUrl: config().TRONLIST,
	responseType: 'json'
}) 

	const getAccountTransactions = (currentAddress, lpAddress) =>
		api.get(`${config().TRON_GRID} + v1/accounts/${currentAddress}/transactions/trc20?limit=200&contract_address=${lpAddress}`, {
			crossDomain: true,
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			}
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
module.exports.getAccountTransactions = getAccountTransactions
