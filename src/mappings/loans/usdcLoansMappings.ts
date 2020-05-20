import {
  CollateralDeposited as CollateralDepositedEvent,
  CollateralWithdrawn as CollateralWithdrawnEvent,
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent,
  LoanTakenOut as LoanTakenOutEvent,
  LoanLiquidated as LoanLiquidatedEvent,
} from "../../../generated/DAILoans/DAILoans";
import { TOKEN_USDC } from "../../utils/consts";
import {
  internalHandleCollateralDeposited,
  internalHandleLoanLiquidated,
  internalHandleLoanTermsSet,
  internalHandleLoanRepaid,
  internalHandleLoanTakenOut,
  internalHandleCollateralWithdrawn,
} from "../../utils/loans-commons";

export function handleCollateralDeposited(
  event: CollateralDepositedEvent
): void {
  internalHandleCollateralDeposited(TOKEN_USDC, event);
}

export function handleCollateralWithdrawn(
  event: CollateralWithdrawnEvent
): void {
  internalHandleCollateralWithdrawn(TOKEN_USDC, event);
}

export function handleLoanTermsSet(event: LoanTermsSetEvent): void {
  internalHandleLoanTermsSet(TOKEN_USDC, event);
}

export function handleLoanTakenOut(event: LoanTakenOutEvent): void {
  internalHandleLoanTakenOut(TOKEN_USDC, event);
}

export function handleLoanRepaid(event: LoanRepaidEvent): void {
  internalHandleLoanRepaid(TOKEN_USDC, event);
}

export function handleLoanLiquidated(event: LoanLiquidatedEvent): void {
  internalHandleLoanLiquidated(TOKEN_USDC, event);
}
