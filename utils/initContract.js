const initContract = async (address, tronWeb) => {
  try {
    const contract = await tronWeb.contract().at(address);
    return contract;
  } catch (error) {
    console.log(error);
    // alert('You are not logged in!');
    return {
      contract: null,
    };
  }
};

module.exports.initContract = initContract
