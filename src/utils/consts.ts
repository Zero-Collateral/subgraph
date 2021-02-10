import { ethers } from "ethers";

// See enums in schema.graphql
export const EMPTY_ADDRESS_STRING = "0x0000000000000000000000000000000000000000";
export const ETH_ADDRESS_STRING = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

// Collateral Tokens consts
export const COLLATERAL_TOKEN_ETH = "ETH";
export const COLLATERAL_TOKEN_LINK = "LINK";

// cTokens consts
export const CTOKEN_CDAI = "CDAI";
export const CTOKEN_CUSDC = "CUSDC";

// tTokens consts
export const TTOKEN_TDAI = "tDAI";
export const TTOKEN_TUSDC = "tUSDC";

// LendingPool consts
export const LENDING_POOL_DEPOSITED = 'Deposited';
export const LENDING_POOL_REPAID = 'Repaid';
export const LENDING_POOL_WITHDRAWN = 'Withdrawn';
export const LENDING_POOL_LIQUIDATED = 'PaymentLiquidated';
export const LENDING_POOL_INTEREST_WITHDRAWN = 'InterestWithdrawn';

// Ethereum Transaction consts

// Eth Event Types
// Loans
export const ETH_TX_COLLATERAL_DEPOSITED = "CollateralDeposited"
export const ETH_TX_COLLATERAL_WITHDRAWN = "CollateralWithdrawn"
export const ETH_TX_LOAN_TERMS_SET = "LoanTermsSet"
export const ETH_TX_LOAN_TAKEN_OUT = "LoanTakenOut"
export const ETH_TX_LOAN_REPAID = "LoanRepaid"
export const ETH_TX_LOAN_LIQUIDATED = "LoanLiquidated"
// Lenders
export const ETH_TX_ACCRUED_INTEREST_UPDATED = "AccruedInterestUpdated"
export const ETH_TX_ACCRUED_INTEREST_WITHDRAWN = "AccruedInterestWithdrawn"
// LendingPool
export const ETH_TX_TOKEN_DEPOSITED = "TokenDeposited"
export const ETH_TX_TOKEN_WITHDRAWN = "TokenWithdrawn"
export const ETH_TX_TOKEN_REPAID = "TokenRepaid"
export const ETH_TX_INTEREST_WITHDRAWN = "InterestWithdrawn"
export const ETH_TX_PAYMENT_LIQUIDATED = "PaymentLiquidated"
// Settings
export const ETH_TX_PLATFORM_SETTING_UPDATED = "PlatformSettingUpdated"
export const ETH_TX_PLATFORM_SETTING_CREATED = "PlatformSettingCreated"
export const ETH_TX_PLATFORM_SETTING_REMOVED = "PlatformSettingRemoved"
export const ETH_TX_LENDING_POOL_PAUSED = "LendingPoolPaused"
export const ETH_TX_LENDING_POOL_UNPAUSED = "LendingPoolUnpaused"
export const ETH_TX_PLATFORM_PAUSED = "Paused"
export const ETH_TX_PLATFORM_UNPAUSED = "Unpaused"
export const ETH_TX_PLATFORM_PAUSER_ADDED = "PauserAdded"
export const ETH_TX_PLATFORM_PAUSER_REMOVED = "PauserRemoved"

// Interest Consensus
export const ETH_TX_INTEREST_SUBMITTED = "InterestSubmitted"
export const ETH_TX_INTEREST_ACCEPTED = "InterestAccepted"
// Loan Terms Consensus
export const ETH_TX_TERMS_SUBMITTED = "TermsSubmitted"
export const ETH_TX_TERMS_ACCEPTED = "TermsAccepted"
// Consensus
export const ETH_TX_SIGNER_ADDED = "SignerAdded"
export const ETH_TX_SIGNER_REMOVED = "SignerRemoved"
// tTokens
export const ETH_TX_TTOKEN_TRANSFER = "TTokenTransfer"
export const ETH_TX_TTOKEN_APPROVAL = "TTokenApproval"
export const ETH_TX_TTOKEN_MINTER_ADDED = "TTokenMinterAdded"
export const ETH_TX_TTOKEN_MINTER_REMOVED = "TTokenMinterRemoved"
// ChainlinkPairAggregator
export const ETH_TX_PAIR_AGGREGATOR_REGISTERED = "PairAggregatorRegistered"
export const ETH_TX_PAIR_AGGREGATOR_UPDATED = "PairAggregatorUpdated"

// Tokens consts
export const TOKEN_DAI = "DAI";
export const TOKEN_USDC = "USDC";

// Consensus Contracts consts
export const CONTRACT_LOAN_TERMS_CONSENSUS = "LoanTermsConsensus";
export const CONTRACT_INTEREST_CONSENSUS = "InterestConsensus";

// Interest Update Status consts
export const INTEREST_UPDATE_REQUESTED = "Requested";
export const INTEREST_UPDATE_CANCELED = "Canceled";

// Accrued Interest Status consts
export const ACCRUED_INTEREST_STATUS_WITHDRAWN = "Withdrawn";
export const ACCRUED_INTEREST_STATUS_UPDATED = "Updated";

// tToken Status consts
export const TTOKEN_STATUS_TRANSFER = "Transfer";
export const TTOKEN_STATUS_APPROVAL = "Approval";
export const TTOKEN_STATUS_MINTER_ADDED = "MinterAdded";
export const TTOKEN_STATUS_MINTER_REMOVED = "MinterRemoved";

// Loan Status consts
export const LOAN_STATUS_TERMS_SET = "TermsSet";
export const LOAN_STATUS_ACTIVE = "Active";
export const LOAN_STATUS_CLOSED = "Closed";

// Asset Settings Property Consts
export const ASSET_SETTINGS_CTOKEN_ADDRESS:string = ethers.utils.id('CTokenAddress');
export const ASSET_SETTINGS_MAX_LOAN_AMOUNT:string = ethers.utils.id('MaxLoanAmount');
export const ASSET_SETTINGS_REMOVED:string = "Removed";