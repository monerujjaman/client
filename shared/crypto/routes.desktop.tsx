import CryptoSubNav from './crypto-sub-nav'
export const newRoutes = {
  //. Crypto tab is driven by the sub nav on desktop
  cryptoRoot: {
    // MUST use screen and not getScreen for subnavs!
    screen: CryptoSubNav,
  },
}

export const newModalRoutes = {}
