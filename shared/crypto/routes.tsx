import CryptoSubNav from './crypto-sub-nav'
import Encrypt from './operations/encrypt'
import Decrypt from './operations/decrypt'
import Sign from './operations/sign'
import Verify from './operations/verify'

// Used by CryptoSubNavigator
export const cryptoSubRoutes = {
  descrypt: {getScreen: (): typeof Decrypt => require('./operations/decrypt').default},
  encrypt: {getScreen: (): typeof Encrypt => require('./operations/encrypt').default},
  sign: {getScreen: (): typeof Sign => require('./operations/sign').default},
  verify: {getScreen: (): typeof Verify => require('./operations/verify').default},
}

export const newRoutes = {
  cryptoRoot: {
    get screen() {
      return require('./crypto-sub-nav').default
    },
  },
}

export const modalRoutes = {}
