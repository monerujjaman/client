import * as React from 'react'
import * as Kb from '../../common-adapters'
import * as Styles from '../../styles'
import * as Constants from '../../constants/crypto'
import * as Types from '../../constants/types/crypto'
import OperationRow from './operation-row/container'

type Props = {
  children?: React.ReactNode
  routeSelected: Types.CryptoSubTab
}

type Row = {
  title: string
  tab: Types.CryptoSubTab
}

const rows: Array<Row> = [
  {
    tab: Constants.encryptTab,
    title: 'Encrypt',
  },
  {
    tab: Constants.decryptTab,
    title: 'Decrypt',
  },
  {
    tab: Constants.signTab,
    title: 'Sign',
  },
  {
    tab: Constants.verifyTab,
    title: 'Verify',
  },
]

class OperationsList extends React.PureComponent<Props> {
  _renderItem = (_: number, row: Row) => {
    return (
      <OperationRow
        key={row.tab}
        isSelected={this.props.routeSelected === row.tab}
        title={row.title}
        tab={row.tab}
      />
    )
  }

  render() {
    return (
      <Kb.Box2 direction="horizontal" fullHeight={true} fullWidth={true}>
        <Kb.Box2 direction="vertical" fullHeight={true} style={styles.operationsListContainer}>
          <Kb.BoxGrow>
            <Kb.List items={rows} renderItem={this._renderItem} keyProperty="key" style={styles.list} />
          </Kb.BoxGrow>
        </Kb.Box2>
        {this.props.children}
      </Kb.Box2>
    )
  }
}

const styles = Styles.styleSheetCreate(() => ({
  list: {
    ...Styles.globalStyles.fullHeight,
  },
  operationsListContainer: {
    backgroundColor: Styles.globalColors.blueGrey,
    borderStyle: 'solid',
    flexGrow: 0,
    flexShrink: 0,
    width: 240,
  },
}))

export default OperationsList
