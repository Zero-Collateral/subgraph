import {
  AccruedInterestUpdated as AccruedInterestUpdatedEvent,
  AccruedInterestWithdrawn as AccruedInterestWithdrawnEvent,
} from "../../../generated/DAILenders/DAILenders";
import {
  internalHandleAccruedInterestWithdrawn,
  internalHandleAccruedInterestUpdated,
} from "../../utils/lenders-commons";
import { TOKEN_USDC } from "../../utils/consts";

export function handleAccruedInterestUpdated(
  event: AccruedInterestUpdatedEvent
): void {
  internalHandleAccruedInterestUpdated(
    TOKEN_USDC,
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
    event.params.recipient,
    event.params.amount,
    event
  );
}
