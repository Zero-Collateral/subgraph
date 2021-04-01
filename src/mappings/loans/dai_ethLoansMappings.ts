import {
  CollateralDeposited as CollateralDepositedEvent,
  CollateralWithdrawn as CollateralWithdrawnEvent,
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent,
  LoanTakenOut as LoanTakenOutEvent,
  LoanLiquidated as LoanLiquidatedEvent,
  ETH_DAI_Loans__loansResultValue0Struct as Loan,
  ETH_DAI_Loans,
} from "../../../generated/ETH_DAI_Loans/ETH_DAI_Loans";
import { SettingsInterface } from "../../../generated/ETH_DAI_Loans/SettingsInterface";
import { LendingPool } from "../../../generated/ETH_DAI_Loans/LendingPool";
import { TOKEN_DAI, COLLATERAL_TOKEN_ETH } from "../../utils/consts";
import {
  internalHandleCollateralDeposited,
  internalHandleLoanLiquidated,
  internalHandleLoanTermsSet,
  internalHandleLoanRepaid,
  internalHandleLoanTakenOut,
  internalHandleCollateralWithdrawn,
  createLoanTerms,
} from "../../utils/loans-commons";
import { buildLoanId } from "../../utils/commons";
import { Address, BigInt } from "@graphprotocol/graph-ts";

function getTTokenAddress(loansAddress: Address): Address {
  let loans = ETH_DAI_Loans.bind(loansAddress);
  let lendingPoolAddress = loans.lendingPool();
  let lendingPool = LendingPool.bind(lendingPoolAddress);
  let tTokenAddress = lendingPool.tToken();
  return tTokenAddress;
}

function getLoan(loansAddress: Address, loanID: BigInt): Loan {
  let loans = ETH_DAI_Loans.bind(loansAddress);
  let loan = loans.loans(loanID);
  return loan;
}

function getExpiryTime(loansAddress: Address): BigInt {
  let loans = ETH_DAI_Loans.bind(loansAddress);
  let settingsAddress = loans.settings();
  let settings = SettingsInterface.bind(settingsAddress);
  let termsExpiry = settings.getTermsExpiryTimeValue();
  return termsExpiry;
}

export function handleCollateralDeposited(
  event: CollateralDepositedEvent
): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  internalHandleCollateralDeposited(
    loanID,
    event.params.borrower,
    event.params.depositAmount,
    event
  );
}

export function handleCollateralWithdrawn(
  event: CollateralWithdrawnEvent
): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  internalHandleCollateralWithdrawn(
    loanID,
    event.params.borrower,
    event.params.amount,
    event
  );
}

export function handleLoanTakenOut(event: LoanTakenOutEvent): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  internalHandleLoanTakenOut(
    loanID,
    getTTokenAddress(event.address),
    event.params.borrower,
    event.params.escrow,
    event.params.amountBorrowed,
    event
  );
}

export function handleLoanTermsSet(event: LoanTermsSetEvent): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  let loan = getLoan(event.address, event.params.loanID);
  let loanTerms = loan.loanTerms;
  let expiryTime = getExpiryTime(event.address);

  internalHandleLoanTermsSet(
    loanID,
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.borrower,
    event.params.recipient,
    loanTerms.interestRate,
    loanTerms.collateralRatio,
    loanTerms.maxLoanAmount,
    loanTerms.duration,
    event.block.timestamp.plus(expiryTime),
    event.params.nonce,
    event
  );
}

export function handleLoanRepaid(event: LoanRepaidEvent): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  internalHandleLoanRepaid(
    getTTokenAddress(event.address),
    loanID,
    event.params.amountPaid,
    event.params.payer,
    event.params.totalOwed,
    event
  );
}

export function handleLoanLiquidated(event: LoanLiquidatedEvent): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  internalHandleLoanLiquidated(
    loanID,
    event.params.liquidator,
    event.params.collateralOut,
    event.params.tokensIn,
    event
  );
}
