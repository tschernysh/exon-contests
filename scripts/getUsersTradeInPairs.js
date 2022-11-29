const {ethers} = require("ethers")
const {tronweb} = require("../utils/tronwebInit")
const TronGrid = require('trongrid')

const getUsersTradeInPairs = async () => {
	const currentAddress = 'TZ4dgh7RYa5fD3sYvnUByihmQpasKD7WqA'
	const tronGrid = new TronGrid(tronweb)
	let swapEvent = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Swap(address,uint256,uint256,uint256,uint256)"))
	let fingerprint = ''
	let minTime = 1669024850000
	let result
	console.log(tronGrid);
	try {
		let continueToken = '';
		while (true) {
				let res = await tronGrid.contract.getEvents(currentAddress, {
						only_confirmed: true,
						event_name: swapEvent,
						limit: 200,
						fingerprint,
						order_by: "timestamp,asc",
						min_timestamp: minTime,
				});

				if (!res.success) {
						console.warn("Can't get events for the contract");
						break;
				}

				result = result.concat(res.data);

				if (typeof res.meta.fingerprint !== 'undefined') {
						fingerprint = res.meta.fingerprint;
				} else {
						break;
				}
		}
	} catch (error) {
			console.error(error);
	} finally {
			console.log(result);
	}
}

module.exports.getUsersTradeInPairs = getUsersTradeInPairs
