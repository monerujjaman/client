import * as React from 'react'
import * as Kb from '../../common-adapters'

type Props = {
  children?: React.ReactNode
}
// TODO: @jacob - render left list and active operation
const OperationsList = (props: Props) => <Kb.Box2 direction="vertical">{props.children}</Kb.Box2>

export default OperationsList
