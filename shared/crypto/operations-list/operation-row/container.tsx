import * as Container from '../../../util/container'
import * as RouteTreeGen from '../../../actions/route-tree-gen'
import {CryptoSubTab} from '../../../constants/crypto'
import OperationRow from '.'

type OwnProps = {
  title: string
  isSelected: boolean
  onSelect: () => void
}

const mapStateToProps = (state: Container.TypedState, ownProps: OwnProps) => ({})

// TODO @jacob - Add navigation for onSelect
const mapDispatchToProps = (dispatch: Container.TypedDispatch) => ({
  _switchOperationTab: (cryptoSubTab: CryptoSubTab) => {
    dispatch(RouteTreeGen.createNavigateAppend({path: [cryptoSubTab]}))
  },
})

const mergeProps = (stateProps, dispatchProps, ownProps: OwnProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
})

export default Container.namedConnect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  'OperationRow'
)(OperationRow)
