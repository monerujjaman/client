import * as Kb from '../common-adapters'
import * as React from 'react'
import {NavigationViewProps, createNavigator, StackRouter, SceneView} from '@react-navigation/core'
import {cryptoSubRoutes} from './routes'

const noScreenProps = {}

class CryptoSubNav extends React.PureComponent<NavigationViewProps<any>> {
  render() {
    const navigation = this.props.navigation
    const index = navigation.state.index
    const activeKey = navigation.state.routes[index].key
    const descriptor = this.props.descriptors[activeKey]
    const childNav = descriptor.navigation
    const ListAndActiveOperation = require('./operations-list').default

    return (
      <Kb.Box2 direction="horizontal" fullHeight={true} fullWidth={true}>
        <ListAndActiveOperation>
          <SceneView
            navigation={childNav}
            component={descriptor.getComponent()}
            screenProps={this.props.screenProps || noScreenProps}
          />
        </ListAndActiveOperation>
      </Kb.Box2>
    )
  }
}

const initialRouteName = 'encrypt'
const CryptoSubNavigator = createNavigator(
  CryptoSubNav,
  StackRouter(Shim.shim(cryptoSubRoutes), {initialRouteName}),
  {}
)

// TODO: @jacob Wrap and export CryptoSubNavigator like _OnboardingOrWallets
