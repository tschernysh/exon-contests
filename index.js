const {getPairs} = require("./scripts/getPairs");
const {getTeamLiqudity} = require("./scripts/getTeamLiquidity");
const {getPersonalLiquidityInPair} = require("./scripts/getPersonalLiquidityInPair");
const {getPersonalTradeInPair} = require("./scripts/getPersonalTradeInPair");
const {getUsersTradeInPairs} = require("./scripts/getUsersTradeInPairs");


const getContestantsInfo = async () => {
	//await getTeamLiqudity([527, 36, 6])
	//await getPairs()
	//await getPersonalLiquidityInPair(['TRpfGv87u8tmdNW9rst5bpw6N7aEAE94Uh', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'], [527, 36, 6, 400, 1077])
	await getPersonalTradeInPair(
		[540, 1150, 43, 1184, 844, 1048, 1213, 1168, 221, 1001, 275, 1225, 516, 204],
		['TZ4dgh7RYa5fD3sYvnUByihmQpasKD7WqA', 'TG8CsVLdTj4ozdGS5HwgXnF4RLnPtXNjNK'],
		1669024850000,
		1669388450000
	)
}


 getContestantsInfo()
