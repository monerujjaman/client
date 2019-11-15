import * as React from 'react'
import * as Kb from '../../common-adapters'
import * as Styles from '../../styles'
import * as Constants from '../../constants/crypto'
import {CryptoSubTab} from '../../constants/types/crypto'
import OperationRow from './operation-row/container'

type Props = {
  children?: React.ReactNode
}

type Row = {
  title: string
  tab: CryptoSubTab
}

const rows = [
  {
    tab: Constants.EncryptTab,
    title: 'Encrypt',
  },
  {
    tab: Constants.DecryptTab,
    title: 'Decrypt',
  },
  {
    tab: Constants.SignTab,
    title: 'Sign',
  },
  {
    tab: Constants.VerifyTab,
    title: 'Verify',
  },
]

const renderItem = (_: number, row: Row) => {
  return <OperationRow key={row.title} title={row.title} />
}

const itemHeight = {height: 100, type: 'fixed'}

// TODO: @jacob - render left list and active operation
const OperationsList = (props: Props) => (
  <Kb.Box2 direction="horizontal" fullHeight={true} fullWidth={true}>
    <Kb.Box2 direction="vertical" fullHeight={true} style={styles.operationsListContainer}>
      <Kb.BoxGrow>
        <Kb.List2 itemHeight={itemHeight} items={rows} renderItem={renderItem} />
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
