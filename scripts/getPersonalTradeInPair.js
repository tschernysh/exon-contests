const {config} = require('../config/config')
const ethers = require('ethers')
const ExonswapV2Factory = require('../contracts/ExonswapV2Factory.json')
const Price = require('../contracts/Price.json')
const { parseResult } = require('../utils/parseResult')
const { tronweb } = require('../utils/tronwebInit')
const {getAccountTransactions} = require('../api/api')
const { initContract } = require('../utils/initContract')



const getPersonalTradeInPair = async (tokenIdList, pairAddressList, start, end) => {
	const TronWeb = await tronweb()
	if(!TronWeb) return
	var swapEvent = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Swap(address,uint256,uint256,uint256,uint256)"))
	let events
	let swapArray = []
	let transactions = []
	let currentAddress = 'TZ4dgh7RYa5fD3sYvnUByihmQpasKD7WqA'
	const factoryContract = TronWeb.contract(
		ExonswapV2Factory.abi,
        config().FACTORY_CONTRACT,
    );
	const PriceContract = TronWeb.contract(
		Price.abi,
		config().PRICE_CONTRACT
	)
	const NftContract = await initContract(config().ACCOUNT_CONTRACT, TronWeb)
	for (let i = 0; i < tokenIdList.length; i++) {
		swapArray.push({tokenId: tokenIdList[i], swapAmount: 0})
	}
        const pairLength = await factoryContract.allPairsLength().call();
	for (let x = pairLength.toNumber() - 1; x >= 0; x--) {
		currentAddress = await factoryContract.allPairs(x).call();
		let fromHexAddress = await TronWeb.address.fromHex(currentAddress)
		if(pairAddressList.indexOf(fromHexAddress) !== -1 ){

			  token0Trx =
			    await TronWeb.transactionBuilder.triggerConstantContract(
			      fromHexAddress,
			      "token0()",
			      {},
			      []
			    );
			  token0 = await parseResult(
			    ["address"],
			    "0x" + token0Trx.constant_result[0]
			  );


			  token1Trx =
			    await TronWeb.transactionBuilder.triggerConstantContract(
			      fromHexAddress,
			      "token1()",
			      {},
			      []
			    );
			  token1 = await parseResult(
			    ["address"],
			    "0x" + token1Trx.constant_result[0]
			  );
			let token0Usdt
			let token1Usdt
			try {
				token0Usdt = await PriceContract.getTokenPriceInUSD(TronWeb.address.fromHex(token0[0])).call()
				token0Usdt = token0Usdt.toNumber()
				token0Usdt = TronWeb.fromSun(token0Usdt)
			} catch (error) {
				console.log(error);
			}
			try {
				token1Usdt = await PriceContract.getTokenPriceInUSD(TronWeb.address.fromHex(token1[0])).call()
				token1Usdt = token1Usdt.toNumber()
				token1Usdt = TronWeb.fromSun(token1Usdt)
			} catch (error) {
				console.log(error);
			}

			for (let k = 0; k < tokenIdList.length; k++){
				let nftAddress
				try {
					nftAddress = await NftContract.ownerOf(tokenIdList[k]).call()
					nftAddress = await TronWeb.address.fromHex(nftAddress)
				} catch (error) {
					console.log(error);
				}
				try {
					transactions = await getAccountTransactions(nftAddress, fromHexAddress)
					// console.log('EVENTS: ', events)
				  } catch (error) {
					  console.log(error.message);
					return
				  }
				  for(let i = 0; i < transactions.data.data.length; i++){
					var transactionInfo;
					try {
					  transactionInfo = await TronWeb.trx.getTransactionInfo(transactions.data.data[i].transaction_id)
				   } catch(error) {
					 console.log(error)
				   }
					  if(transactionInfo.log){
						for (let j = 0; j < transactionInfo.log.length; j++){
							if(tokenIdList[k] === 4){
								console.log('TRANSACTION TOPIC', 
								transactionInfo.log[j].topics[0], 
								swapEvent, transactions.data.data[i].transaction_id);
							}
							if ('0x'+transactionInfo.log[j].topics[0] == swapEvent) {
								console.log(9);
								swapResult
								try {
									swapResult = await parseResult(
									['address','uint256','uint256','uint256','uint256'],
									'0x' + transactionInfo.log[j].data
								);
								} catch (error) {
									console.log(error);
								}
								console.log(tokenIdList[k], swapResult);
								if(swapResult[1].toNumber() === tokenIdList[k] && ( +swapResult[3].toNumber() || +swapResult[4].toNumber() )){
									console.log(transactionInfo.blockTimeStamp);
									if((transactionInfo.blockTimeStamp > start) && (transactionInfo.blockTimeStamp < end ) ){
										console.log(new Date(transactionInfo.blockTimeStamp).toUTCString())
										swapResult0Usdt = swapResult[3].toNumber() * token0Usdt / 1000000
										swapResult1Usdt = swapResult[4].toNumber() * token1Usdt / 1000000
										swapArray = swapArray.map(el => el.tokenId === tokenIdList[k]
										? {...el,
											swapAmount: el.swapAmount + swapResult0Usdt + swapResult1Usdt}
										: el)
									}
								}
							}
						}
					  }
				  }
			}
		}
	}
	swapArray = swapArray.map(el => ({...el, swapAmount: el.swapAmount.toFixed(6)}))
	console.log('hell', swapArray)
}

module.exports.getPersonalTradeInPair = getPersonalTradeInPair
