export enum DashboardActionType {
  CreateOrEditAuction = 'createOrEditAuction',
  UserAuctions = 'userAuctions',
  UserBids = 'userBids',
  UserSettings = 'userSettings',
}

export enum AuctionStatus {
  Active = 'Active',
  AwaitingPayment = 'Awaiting Payment',
  Completed = 'Completed',
}

export enum AppRoutes {
  Home = '/',
  Dashboard = '/dashboard',
  SignIn = '/sign-in',
  SignUp = '/sign-up',
  Auction = '/auction',
}

export enum ApiRoutes {
  Api = '/api',
  DashboardAuction = '/api/dashboard/auction',
  DashboardUser = '/api/dashboard/user',
  Checkout = '/api/checkout',
  AuthSignIn = '/api/auth/sign-in',
  AuthSignUp = '/api/auth/sign-up',
  Auction = '/api/auction',
}
