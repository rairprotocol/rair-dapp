const walletTypeMap = {
  "metamask": "isMetaMask",
  "coinbase": "isCoinbaseWallet"
}

export enum WalletType {
  Metamask = 'metamask',
  Coinbase = 'coinbase'
}

export function getWalletProvider(type: WalletType = WalletType.Metamask) {
  if (window.ethereum.providers && window.ethereum.providers.length > 0) {
    const provider = window.ethereum.providers.find((provider) => {
      return provider[walletTypeMap[type]]
    })
    if (provider) {
      return provider
    }
  } else {
    if (window.ethereum[walletTypeMap[type]]) {
      return window.ethereum
    }
  }
  return null
}

export async function getProviderInUse() {
  if (window.ethereum.providers && window.ethereum.providers.length > 0) {
    const providers = await Promise.all(window.ethereum.providers.map(async (provider) => { 
      return {
        provider,
        result: (await provider.request({ method: 'eth_accounts' })).length > 0
      } 
    }))

    const  provider = (providers.find((provider) => provider.result))?.provider
    if (provider) {
      return provider
    }
  } else {
    if ((await window.ethereum.request({ method: 'eth_accounts' })).length > 0) {
      return window.ethereum
    }
  }
  return null
}
