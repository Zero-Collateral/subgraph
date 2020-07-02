import {
  CollateralDeposited as CollateralDepositedEvent,
  CollateralWithdrawn as CollateralWithdrawnEvent,
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent,
  LoanTakenOut as LoanTakenOutEvent,
  LoanLiquidated as LoanLiquidatedEvent,
} from "../../../generated/USDC_LINK_Loans/USDCLoans";
import { TOKEN_DAI, COLLATERAL_TOKEN_ETH } from "../../utils/consts";
import {
  internalHandleCollateralDeposited,
  internalHandleLoanLiquidated,
  internalHandleLoanTermsSet,
  internalHandleLoanRepaid,
  internalHandleLoanTakenOut,
  internalHandleCollateralWithdrawn,
} from "../../utils/loans-commons";
import { buildLoanId } from "../../utils/commons";

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
    event.params.withdrawalAmount,
    event
  );
}

export function handleLoanTermsSet(event: LoanTermsSetEvent): void {
  let loanID = buildLoanId(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.loanID.toString()
  );
  internalHandleLoanTermsSet(
    loanID,
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.borrower,
    event.params.recipient,
    event.params.interestRate,
    event.params.collateralRatio,
    event.params.maxLoanAmount,
    event.params.duration,
    event.params.termsExpiry,
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
    event.params.borrower,
    event.params.amountBorrowed,
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
    loanID,
    event.params.amountPaid,
    event.params.totalOwed,
    event.params.payer,
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
