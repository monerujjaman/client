import * as React from 'react'
import * as Kb from '../../../common-adapters'
import * as Styles from '../../../styles'

type Props = {
  title: string
  isSelected: boolean
  onSelect: () => void
}

const OperationRow = (props: Props) => {
  return (
    <Kb.ClickableBox onClick={props.onSelect}>
      <Kb.Box style={styles.rowContainer} className="hover_container">
        <Kb.Box
          className={Styles.classnames('hover_contained', 'hover_background_color_blueGreyDark', {
            background_color_blueGreyDark: props.isSelected,
          })}
        >
          <Kb.Text>{props.title}</Kb.Text>
        </Kb.Box>
      </Kb.Box>
    </Kb.ClickableBox>
  )
}

const styles = Styles.styleSheetCreate(() => ({
  rowContainer: {
    height: 90,
  },
}))

export default OperationRow
