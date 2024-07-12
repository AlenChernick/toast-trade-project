export enum DashboardActionType {
  CreateOrEditAuction = 'createOrEditAuction',
  Auctions = 'auctions',
  Bids = 'bids',
  Settings = 'settings',
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
