const {tronweb} = require("../utils/tronwebInit")
const priceAbi = require('../contracts/Price.json').abi
const {config} = require('../config/config')

const getTeamLiqudity = async (contestants) => {
	const Tronweb = await tronweb()
	console.log(!!Tronweb);
	if(!Tronweb) return

	const PriceContract = Tronweb.contract(
		priceAbi,
		config().PRICE_CONTRACT	
	)

	const AccountContract = await Tronweb.contract().at(config().ACCOUNT_CONTRACT)
	
	let contestantsInfo = {}
	for (let i = 0; i < contestants.length; i++) {
		let currentContestantTeamLiquidity = 0

		let firstLine = await AccountContract.getFirstLine(contestants[i]).call()
		firstLine = firstLine.map(el => el.toNumber())
		for(let j = 0; j < firstLine.length; j++){
			let currentRefLiquidity = await PriceContract.getPersonalLiquidity(firstLine[j]).call()
			currentRefLiquidity = +Tronweb.fromSun(currentRefLiquidity.toNumber()) / 1000000
			currentContestantTeamLiquidity += currentRefLiquidity
		}

		contestantsInfo = {...contestantsInfo, [contestants[i]]: firstLine.length}

	}
	console.log(contestantsInfo);
}

module.exports.getTeamLiqudity = getTeamLiqudity
