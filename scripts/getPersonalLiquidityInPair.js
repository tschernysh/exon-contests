const factoryAbi = require('../contracts/ExonswapV2Factory.json').abi
const PriceAbi = require('../contracts/Price.json').abi
const {getTokenByAddress} = require('../api/api')
const {config} = require('../config/config')
const {tronweb} = require("../utils/tronwebInit")
const { parseResult } = require('../utils/parseResult')

const getPersonalLiquidityInPair = async (tokenPairAddresses, accountsId) => {
	const Tronweb = await tronweb()

	if(!Tronweb) return
	const FactoryContract = await Tronweb.contract(
		factoryAbi,
		config().FACTORY_CONTRACT
	)

	const PriceContract = await Tronweb.contract(
		PriceAbi,
		config().PRICE_CONTRACT
	)

	let allPairsInfo = []
	let accountsLiquidity = []
	let pairsLength = await FactoryContract.allPairsLength().call()
	pairsLength = pairsLength.toNumber() 

	for (let i = 0; i < pairsLength; i++) {
		let currentAddress = await FactoryContract.allPairs(i).call()
		let token0Trx
		let token0
		let token1Trx
		let token1
		trxTotalSupply =
			await Tronweb.transactionBuilder.triggerConstantContract( currentAddress,
				"totalSupply()",
				{},
				[]
			);
		totalSupply = await parseResult(
			["uint256"],
			"0x" + trxTotalSupply.constant_result[0]
		);
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
		token0 = await Tronweb.address.fromHex(token0[0])
		token1 = await Tronweb.address.fromHex(token1[0])
		if((token0 === tokenPairAddresses[0] && token1 === tokenPairAddresses[1])
			|| (token0 === tokenPairAddresses[1] && token1 === tokenPairAddresses[0] )){
					console.log('hello');
          reservesTrx =
            await Tronweb.transactionBuilder.triggerConstantContract(
              currentAddress,
              "getReserves()",
              {},
              []
            );
          reserves = await parseResult(
            ["uint256", "uint256"],
            "0x" + reservesTrx.constant_result[0]
          );
          let token0Price;
          try {
            token0Price = await PriceContract.getTokenPriceInUSD(
              token0
            ).call();
            token0Price = Tronweb.fromSun(token0Price.toNumber())
          } catch (error) {
            console.log(error);
          }

          let token1Price;
          try {
            token1Price = await PriceContract.getTokenPriceInUSD(
              token1
            ).call();
            token1Price = Tronweb.fromSun(token1Price.toNumber())

          } catch (error) {
            console.log(error);
          }
					let firstTokenReserveFromSun = await Tronweb.fromSun(reserves[0])
					let secondTokenReserveFromSun = await Tronweb.fromSun(reserves[1])
				let usdPerLp = (firstTokenReserveFromSun * token0Price + secondTokenReserveFromSun * token1Price) / Tronweb.fromSun(totalSupply[0].toNumber())
			for (let j = 0; j < accountsId.length; j++) {
				trxPairLiquidity =
					await Tronweb.transactionBuilder.triggerConstantContract(
						currentAddress,
						"nftBalanceOf(uint256)",
						{},
						[{ type: "uint256", value: accountsId[j] }]
					);
				balanceLP = await parseResult(
					["uint256"],
					"0x" + trxPairLiquidity.constant_result[0]
				);
				balanceLP = balanceLP[0].toNumber()
				balanceLP = Tronweb.fromSun(balanceLP)
				liqInUsd = balanceLP * usdPerLp
				liqInUsd = liqInUsd.toFixed(2)
				if(balanceLP > 0) accountsLiquidity.push(`${accountsId[j]} - $${liqInUsd}`)
			}
		}

	}
	console.log(accountsLiquidity);
}

module.exports.getPersonalLiquidityInPair =	getPersonalLiquidityInPair
