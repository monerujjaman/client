import * as React from 'react'
import * as Kb from '../../common-adapters'
import * as Styles from '../../styles'
import OperationRow from './operation-row/container'

type Props = {
  children?: React.ReactNode
}

type Row = {
  title: string
}

const rows = [
  {
    title: 'Encrypt',
  },
  {
    title: 'Decrypt',
  },
  {
    title: 'Sign',
  },
  {
    title: 'Verify',
  },
]

const renderItem = (_: number, row: Row) => {
  return <OperationRow key={row.title} title={row.title} />
}

// TODO: @jacob - render left list and active operation
const OperationsList = (props: Props) => (
  <Kb.Box2 direction="horizontal" fullHeight={true} fullWidth={true}>
    <Kb.Box2 direction="vertical" fullHeight={true} style={styles.operationsListContainer}>
      <Kb.BoxGrow>
        <Kb.List2 items={rows} renderItem={renderItem} />
      </Kb.BoxGrow>
    </Kb.Box2>
    {props.children}
  </Kb.Box2>
)

const styles = Styles.styleSheetCreate(() => ({
  operationsListContainer: {
    backgroundColor: Styles.globalColors.blueGrey,
    borderStyle: 'solid',
    flexGrow: 0,
    flexShrink: 0,
    width: 240,
  },
}))

export default OperationsList
