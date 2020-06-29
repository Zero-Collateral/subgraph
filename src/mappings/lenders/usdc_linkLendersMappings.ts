import {
  AccruedInterestUpdated as AccruedInterestUpdatedEvent,
  AccruedInterestWithdrawn as AccruedInterestWithdrawnEvent,
} from "../../../generated/USDC_LINK_Lenders/USDCLenders";
import {
  internalHandleAccruedInterestWithdrawn,
  internalHandleAccruedInterestUpdated,
} from "../../utils/lenders-commons";
import { TOKEN_USDC, COLLATERAL_TOKEN_LINK } from "../../utils/consts";

export function handleAccruedInterestUpdated(
  event: AccruedInterestUpdatedEvent
): void {
  internalHandleAccruedInterestUpdated(
    TOKEN_USDC,
    COLLATERAL_TOKEN_LINK,
    event.params.lender,
    event.params.totalNotWithdrawn,
    event.params.totalAccruedInterest,
    event
  );
}

export function handleAccruedInterestWithdrawn(
  event: AccruedInterestWithdrawnEvent
): void {
  internalHandleAccruedInterestWithdrawn(
    TOKEN_USDC,
    COLLATERAL_TOKEN_LINK,
    event.params.recipient,
    event.params.amount,
    event
  );
}
