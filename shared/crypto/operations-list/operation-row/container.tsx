import * as Container from '../../../util/container'
import OperationRow from '.'

type OwnProps = {}

const mapStateToProps = (state: Container.TypedState, ownProps: OwnProps) => ({})

// TODO @jacob - Add navigation for onSelect
const mapDispatchToProps = (dispatch: Container.TypedDispatch) => ({})

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
