import * as React from 'react'
import * as Kb from '../../../common-adapters'
import * as Types from '../../../constants/types/crypto'
import * as Styles from '../../../styles'

type Props = {
  title: string
  tab: Types.CryptoSubTab
  isSelected: boolean
  onSelect: () => void
}

const OperationRow = (props: Props) => {
  return (
    <Kb.ListItem2
      type="Small"
      firstItem={true}
      onClick={props.onSelect}
      body={
        <Kb.Box2
          direction="horizontal"
          fullHeight={true}
          fullWidth={true}
          style={props.isSelected ? styles.selected : null}
        >
          <Kb.Text type="BodySemibold">{props.title}</Kb.Text>
        </Kb.Box2>
      }
    ></Kb.ListItem2>
  )
}

const styles = Styles.styleSheetCreate(() => ({
  selected: {
    backgroundColor: Styles.globalColors.purpleLight,
  },
}))

export default OperationRow
