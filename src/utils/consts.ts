// See enums in schema.graphql
export const EMPTY_ADDRESS_STRING = "0x0000000000000000000000000000000000000000";

// zTokens consts
export const ZTOKEN_ZDAI = "zDAI";
export const ZTOKEN_ZUSDC = "zUSDC";

// LendingPool consts
export const LENDING_POOL_DEPOSIT = 'Deposit';
export const LENDING_POOL_REPAY = 'Repay';
export const LENDING_POOL_WITHDRAW = 'Withdraw';
export const LENDING_POOL_LIQUIDATE = 'Liquidate';

// Ethereum Transaction consts

// Loans contract
export const ETH_TX_LOAN_TERMS_SET = "LoanTermsSet";
export const ETH_TX_LOAN_TAKEN_OUT = "LoanTakenOut";
export const ETH_TX_LOAN_REPAID = "LoanRepaid";
export const ETH_TX_COLLATERAL_WITHDRAWN = "CollateralWithdrawn";
export const ETH_TX_COLLATERAL_DEPOSITED = "CollateralDeposited";

export const ETH_TX_TOKEN_DEPOSITED = "TokenDeposited";
export const ETH_TX_TOKEN_WITHDRAWN = "TokenWithdrawn";
export const ETH_TX_TOKEN_REPAID = "TokenRepaid";
export const ETH_TX_PAYMENT_LIQUIDATED = "PaymentLiquidated";
export const ETH_TX_SIGNER_ADDED = "SignerAdded";
export const ETH_TX_SIGNER_REMOVED = "SignerRemoved";
export const ETH_TX_INTEREST_SUBMITTED = "InterestSubmitted";
export const ETH_TX_INTEREST_ACCEPTED = "InterestAccepted";
export const ETH_TX_ACCRUED_INTEREST_UPDATED = "AccruedInterestUpdated";
export const ETH_TX_ACCRUED_INTEREST_WITHDRAWN = "AccruedInterestWithdrawn";
export const ETH_TX_INTEREST_UPDATE_REQUESTED = "InterestUpdateRequested";
export const ETH_TX_INTEREST_UPDATE_CANCELED = "CancelInterestUpdate";
export const ETH_TX_ZTOKEN_TRANSFER = "ZTokenTransfer";
export const ETH_TX_ZTOKEN_APPROVAL = "ZTokenApproval";
export const ETH_TX_ZTOKEN_MINTER_ADDED = "ZTokenMinterAdded";
export const ETH_TX_ZTOKEN_MINTER_REMOVED = "ZTokenMinterRemoved";
export const ETH_TX_SETTINGS_UPDATED = "SettingUpdated";
export const ETH_TX_LENDING_POOL_PAUSED = "LendingPoolPaused";
export const ETH_TX_LENDING_POOL_UNPAUSED = "LendingPoolUnpaused";

// Tokens consts
export const TOKEN_DAI = "DAI";
export const TOKEN_USDC = "USDC";

// Interest Update Status consts
export const INTEREST_UPDATE_REQUESTED = "Requested";
export const INTEREST_UPDATE_CANCELED = "Canceled";

// Accrued Interest Status consts
export const ACCRUED_INTEREST_STATUS_WITHDRAWN = "Withdrawn";
export const ACCRUED_INTEREST_STATUS_UPDATED = "Updated";

// ZToken Status consts
export const ZTOKEN_STATUS_TRANSFER = "Transfer";
export const ZTOKEN_STATUS_APPROVAL = "Approval";
export const ZTOKEN_STATUS_MINTER_ADDED = "MinterAdded";
export const ZTOKEN_STATUS_MINTER_REMOVED = "MinterRemoved";

// Loan Status consts
export const LOAN_STATUS_TERMS_SET = "TermsSet";
export const LOAN_STATUS_ACTIVE = "Active";
export const LOAN_STATUS_CLOSED = "Closed";