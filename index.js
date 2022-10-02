const {getPairs} = require("./scripts/getPairs");
const {getTeamLiqudity} = require("./scripts/getTeamLiquidity");
const {getPersonalLiquidityInPair} = require("./scripts/getPersonalLiquidityInPair");


const getContestantsInfo = async () => {
	//await getTeamLiqudity([527, 36, 6])
	//await getPairs()
	await getPersonalLiquidityInPair(['TRpfGv87u8tmdNW9rst5bpw6N7aEAE94Uh', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'], [527, 36, 6])
}


 getContestantsInfo()
