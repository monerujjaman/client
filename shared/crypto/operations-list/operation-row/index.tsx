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

const HoverBox = Styles.styled(Kb.Box2)(() => ({
  ':hover': {backgroundColor: Styles.globalColors.blueGreyDark},
}))

const OperationRow = (props: Props) => {
  return (
    <Kb.ClickableBox style={styles.clickableContainer} onClick={props.onSelect}>
      <HoverBox
        direction="horizontal"
        fullWidth={true}
        style={Styles.collapseStyles([styles.hoverBox, props.isSelected ? styles.selected : null])}
      >
        <Kb.Box2
          direction="vertical"
          fullHeight={true}
          fullWidth={true}
          style={Styles.collapseStyles([styles.textContainer])}
        >
          <Kb.Text type="BodySemibold">{props.title}</Kb.Text>
        </Kb.Box2>
      </HoverBox>
    </Kb.ClickableBox>
  )
}

const rowHeight = 50

const styles = Styles.styleSheetCreate(() => ({
  clickableContainer: Styles.platformStyles({
    isElectron: {
      ...Styles.desktopStyles.clickable,
      flexShrink: 0,
      height: rowHeight,
      width: '100%',
    },
  }),
  hoverBox: {
    height: rowHeight,
  },
  selected: {
    backgroundColor: Styles.globalColors.blueLight,
  },
  textContainer: {
    justifyContent: 'center',
    marginLeft: Styles.globalMargins.tiny,
  },
}))

export default OperationRow
