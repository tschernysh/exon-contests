const ethers = require('ethers')
const ParamType = require('@ethersproject/abi')

const AbiCoder = ethers.utils.AbiCoder;
const ADDRESS_PREFIX = '41';

const parseResult = async (types, output) => {
  const abiCoder = new AbiCoder();

  // if (output.replace(/^0x/, '').length % 64)
  //     throw new Error('The encoded string is not valid. Its length must be a multiple of 64.');
  return abiCoder.decode(types, output).reduce((obj, arg, index) => {
    if (types[index] === 'address')
      arg = ADDRESS_PREFIX + arg.substr(2).toLowerCase();
    obj.push(arg);
    return obj;
  }, []);
}

module.exports.parseResult = parseResult
