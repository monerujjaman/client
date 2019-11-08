export type FeatureFlags = {
  admin: boolean
  airdrop: boolean
  audioAttachments: boolean
  chatIndexProfilingEnabled: boolean
  conflictResolution: boolean
  cryptoTab: boolean
  dbCleanEnabled: boolean
  fastAccountSwitch: boolean
  foldersInProfileTab: boolean
  lagRadar: boolean
  moveOrCopy: boolean
  newTeamBuildingForChatAllowMakeTeam: boolean
  outOfDateBanner: boolean
  plansEnabled: boolean
  proofProviders: boolean
  stellarExternalPartners: boolean
  userBlocking: boolean
}

declare const ff: FeatureFlags
export default ff
