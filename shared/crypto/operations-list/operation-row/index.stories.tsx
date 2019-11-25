import * as React from 'react'
import * as Sb from '../../../stories/storybook'
import * as Constants from '../../../constants/crypto'
import * as Types from '../../../constants/types/crypto'
import OperationRow from '.'

const onSelect = Sb.action('onSelect')

const rows = [
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

const load = () => {
  Sb.storiesOf('Crypto', module).add('Operation Row', () =>
    rows.map(row => (
      <OperationRow
        key={row.tab}
        title={row.title}
        isSelected={false}
        tab={row.tab as Types.CryptoSubTab}
        onSelect={onSelect}
      />
    ))
  )
}

export default load
