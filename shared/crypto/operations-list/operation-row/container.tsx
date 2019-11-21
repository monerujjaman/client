import * as Container from '../../../util/container'
import * as RouteTreeGen from '../../../actions/route-tree-gen'
import * as Types from '../../../constants/types/crypto'
import OperationRow from '.'

type OwnProps = {
  title: string
  isSelected: boolean
  tab: Types.CryptoSubTab
}

const mapStateToProps = (/*state: Container.TypedState*/) => ({})

const mapDispatchToProps = (dispatch: Container.TypedDispatch) => ({
  _switchOperationTab: (cryptoSubTab: Types.CryptoSubTab) => {
    dispatch(RouteTreeGen.createNavigateAppend({path: [cryptoSubTab]}))
  },
})

const mergeProps = (stateProps, dispatchProps, ownProps: OwnProps) => ({
  ...stateProps,
  onSelect: dispatchProps._switchOperationTab,
  title: ownProps.title,
  tab: ownProps.tab,
})

export default Container.namedConnect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  'OperationRow'
)(OperationRow)
