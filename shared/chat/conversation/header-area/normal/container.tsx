import * as React from 'react'
import * as Types from '../../../../constants/types/chat2'
import * as Constants from '../../../../constants/chat2'
import * as Chat2Gen from '../../../../actions/chat2-gen'
import {ChannelHeader, UsernameHeader, PhoneOrEmailHeader, Props} from '.'
import * as Container from '../../../../util/container'
import {createShowUserProfile} from '../../../../actions/profile-gen'
import {getVisiblePath} from '../../../../constants/router2'
import * as Tabs from '../../../../constants/tabs'

type OwnProps = {
  conversationIDKey: Types.ConversationIDKey
  infoPanelOpen: boolean
  onToggleInfoPanel: () => void
}

const isPhoneOrEmail = (props: Props): boolean =>
  props.participants.some(participant => participant.endsWith('@phone') || participant.endsWith('@email'))

const HeaderBranch = (props: Props) => {
  if (props.teamName) {
    return <ChannelHeader {...props} />
  }
  if (isPhoneOrEmail(props)) {
    return <PhoneOrEmailHeader {...props} />
  }
  return <UsernameHeader {...props} />
}

export default Container.connect(
  (state, {infoPanelOpen, conversationIDKey}: OwnProps) => {
    const meta = Constants.getMeta(state, conversationIDKey)
    const _participants = meta.teamname ? null : meta.nameParticipants
    const _contactNames = meta.participantToContactName

    return {
      _badgeMap: state.chat2.badgeMap,
      _contactNames,
      _conversationIDKey: conversationIDKey,
      _participants,
      channelName: meta.channelname,
      infoPanelOpen,
      muted: meta.isMuted,
      pendingWaiting:
        conversationIDKey === Constants.pendingWaitingConversationIDKey ||
        conversationIDKey === Constants.pendingErrorConversationIDKey,
      smallTeam: meta.teamType !== 'big',
      teamName: meta.teamname,
    }
  },
  (dispatch: Container.TypedDispatch, {onToggleInfoPanel, conversationIDKey}: OwnProps) => ({
    _onOpenFolder: () => dispatch(Chat2Gen.createOpenFolder({conversationIDKey})),
    _onUnMuteConversation: () => dispatch(Chat2Gen.createMuteConversation({conversationIDKey, muted: false})),
    onShowProfile: (username: string) => dispatch(createShowUserProfile({username})),
    onToggleInfoPanel,
    onToggleThreadSearch: () => dispatch(Chat2Gen.createToggleThreadSearch({conversationIDKey})),
  }),
  (stateProps, dispatchProps) => {
    const visiblePath = getVisiblePath()
    const onTopOfInbox = visiblePath?.length === 4 && visiblePath[2]?.routeName === Tabs.chatTab
    return {
      badgeNumber: onTopOfInbox
        ? [...stateProps._badgeMap.entries()].reduce(
            (res, [currentConvID, currentValue]) =>
              // only show sum of badges that aren't for the current conversation
              currentConvID !== stateProps._conversationIDKey ? res + currentValue : res,
            0
          )
        : 0,
      channelName: stateProps.channelName,
      contactNames: stateProps._contactNames,
      infoPanelOpen: stateProps.infoPanelOpen,
      muted: stateProps.muted,
      onOpenFolder: dispatchProps._onOpenFolder,
      onShowProfile: dispatchProps.onShowProfile,
      onToggleInfoPanel: dispatchProps.onToggleInfoPanel,
      onToggleThreadSearch: dispatchProps.onToggleThreadSearch,
      participants: stateProps._participants || [],
      pendingWaiting: stateProps.pendingWaiting,
      smallTeam: stateProps.smallTeam,
      teamName: stateProps.teamName,
      unMuteConversation: dispatchProps._onUnMuteConversation,
    }
  }
)(HeaderBranch)
