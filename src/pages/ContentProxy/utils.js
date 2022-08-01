export const WRAPPER_CLASS_NAME = 'cointool-chrome-app'

export function convertHex2a(hexx) {
  var hex = hexx.toString(); //force conversion
  var str = '';
  for (var i = 0; (i < hex.length && hex.substr(i, 2) !== '00'); i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export const getMiniAddress = (address = '') => {
  return `${address.substr(0, 4)}...${address.substr(-4)}`
}

export const resolveLinkOnEtherscan = (chainId) => {
  try {
    switch (chainId) {
      case 1:
        return 'https://etherscan.io'
      case 3:
        return 'https://ropsten.etherscan.io'
      case 4:
        return 'https://rinkeby.etherscan.io'
      case 10:
        return 'https://optimistic.etherscan.io'
      case 42161:
        return 'https://arbiscan.io'
      case 42:
        return 'https://kovan.etherscan.io'
      case 5:
        return 'https://goerli.etherscan.io'
      case 97:
        return 'https://testnet.bscscan.com'
      case 56:
        return 'https://bscscan.com'
      case 65:
        return 'https://www.oklink.com/okexchain-test'
      case 66:
        return 'https://www.oklink.com/okexchain'
      case 250:
        return 'https://ftmscan.com'
      case 43114:
        return 'https://snowtrace.io'
      case 42220:
        return 'https://explorer.celo.org'
      case 128:
        return 'https://hecoinfo.com'
      case 137:
        return 'https://polygonscan.com'
      case 256:
        return 'https://scan-testnet.hecochain.com'
      case 321:
        return 'https://explorer.kcc.io/en'
      case 100:
        return 'https://blockscout.com/xdai/mainnet'
      case 1285:
        return 'https://moonriver.moonscan.io'
      case 25:
        return 'https://cronoscan.com'
      case 106:
        return 'https://evmexplorer.velas.com'
      case 4689:
        return 'https://iotexscan.io'
      case 10000:
        return 'https://www.smartscan.cash'
      case 1284:
        return 'https://www.moonscan.io'
      case 50:
        return 'https://explorer.xinfin.network'
      case 336:
        return 'https://blockscout.com/shiden'
      case 122:
        return 'https://explorer.fuse.io'
      case 512:
        return 'https://scan.acuteangle.com '
      case 8217:
        return 'https://scope.klaytn.com'
      case 1666600000:
        return 'https://explorer.harmony.one'
      case 9001:
        return 'https://evm.evmos.org'
      case 32520:
        return 'https://brisescan.com'
      default:
        return 'https://etherscan.io'
    }
  } catch (e) {
    return 'https://etherscan.io'
  }
}



export const resolveChainSymbol = (chainId = 1) => {
  try {
    switch (chainId) {
      case 1:
        return 'ETH'
      case 10:
        return 'ETH'
      case 42161:
        return 'ETH'
      case 3:
        return 'rETH'
      case 4:
        return 'rETH'
      case 42:
        return 'kETH'
      case 5:
        return 'gETH'
      case 97:
        return 'tBNB'
      case 56:
        return 'BNB'
      case 65:
        return 'tOKT'
      case 66:
        return 'OKT'
      case 250:
        return 'FTM'
      case 43114:
        return 'AVAX'
      case 42220:
        return 'CELO'
      case 137:
        return 'MATIC'
      case 80001:
        return 'tMATIC'
      case 128:
        return 'HT'
      case 256:
        return 'tHT'
      case 321:
        return 'KCS'
      case 100:
        return 'xDai'
      case 1285:
        return 'MOVR'
      case 25:
        return 'CRO'
      case 106:
        return 'VLX'
      case 4689:
        return 'IOTX'
      case 10000:
        return 'BCH'
      case 1284:
        return 'GLMR'
      case 50:
        return 'XDC'
      case 336:
        return 'SDN'
      case 122:
        return 'FUSE'
      case 512:
        return 'AAC'
      case 8217:
        return 'KLAY'
      case 1666600000:
        return 'ONE'
      case 9001:
        return 'EVMOS'
      case 32520:
        return 'BRISE'
      default:
        return 'unknown'
    }
  } catch (e) {
    return 'unknown'
  }
}
