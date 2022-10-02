const factoryAbi = require('../contracts/ExonswapV2Factory.json').abi
const {getTokenByAddress} = require('../api/api')
const {config} = require('../config/config')
const {tronweb} = require("../utils/tronwebInit")
const { parseResult } = require('../utils/parseResult')

const getPairs = async () => {
	const Tronweb = await tronweb()

	if(!Tronweb) return
	const FactoryContract = await Tronweb.contract(
		factoryAbi,
		config().FACTORY_CONTRACT
	)

	let allPairsInfo = []

	let pairsLength = await FactoryContract.allPairsLength().call()
	pairsLength = pairsLength.toNumber() 

	for (let i = 0; i < pairsLength; i++) {
		let currentAddress = await FactoryContract.allPairs(i).call()
		let token0Trx
		let token0
		let token1Trx
		let token1

		token0Trx = await Tronweb.transactionBuilder.triggerConstantContract(
			currentAddress,
			'token0()',
			{},
			[]
		)

		token0 = await parseResult(
			['address'],
			'0x' + token0Trx.constant_result[0]
		)

		token1Trx = await Tronweb.transactionBuilder.triggerConstantContract(
			currentAddress,
			'token1()',
			{},
			[]
		)

		token1 = await parseResult(
			['address'],
			'0x' + token1Trx.constant_result[0]
		)

		let result0
		try {
			result0 = await getTokenByAddress(Tronweb.address.fromHex(token0[0]))	
		} catch (error) {
			console.log(error);
		}

		let result1
		try {
			result1 = await getTokenByAddress(Tronweb.address.fromHex(token1[0]))	
		} catch (error) {
			console.log(error);
		}

		allPairsInfo.push(`${result0.data.trc20_tokens[0].symbol}-${result1.data.trc20_tokens[0].symbol} ${Tronweb.address.fromHex(currentAddress)}`)

	}
	console.log(allPairsInfo);
}

module.exports.getPairs =	getPairs
