export enum DashboardActionType {
  CreateOrEditAuction = 'createOrEditAuction',
  UserAuctions = 'userAuctions',
  UserBids = 'userBids',
  UserSettings = 'userSettings',
}

export enum AuctionStatus {
  Active = 'Active',
  Ended = 'Ended',
  AwaitingPayment = 'Awaiting Payment',
  Completed = 'Completed',
}
