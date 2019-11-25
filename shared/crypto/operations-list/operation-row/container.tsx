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
  _switchOperationTab: (tab: Types.CryptoSubTab) => {
    dispatch(RouteTreeGen.createNavigateAppend({path: [tab]}))
  },
})

const mergeProps = (stateProps, dispatchProps, ownProps: OwnProps) => ({
  ...stateProps,
  onSelect: (tab: Types.CryptoSubTab) => dispatchProps._switchOperationTab(tab),
  tab: ownProps.tab,
  title: ownProps.title,
})

export default Container.namedConnect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  'OperationRow'
)(OperationRow)
