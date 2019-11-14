export const newRoutes = {
  //. Crypto tab is driven by the sub nav on desktop
  cryptoRoot: {
    // MUST use screen and not getScreen for subnavs!
    get screen() {
      const subnav = require('./crypto-sub-nav').default
      return subnav
    },
  },
}

export const newModalRoutes = {}
