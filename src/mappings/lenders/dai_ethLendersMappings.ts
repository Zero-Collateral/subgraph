import {
  AccruedInterestUpdated as AccruedInterestUpdatedEvent,
  AccruedInterestWithdrawn as AccruedInterestWithdrawnEvent,
} from "../../../generated/DAI_ETH_Lenders/DAILenders";
import {
  internalHandleAccruedInterestWithdrawn,
  internalHandleAccruedInterestUpdated,
} from "../../utils/lenders-commons";
import { TOKEN_DAI, COLLATERAL_TOKEN_ETH } from "../../utils/consts";

export function handleAccruedInterestUpdated(
  event: AccruedInterestUpdatedEvent
): void {
  internalHandleAccruedInterestUpdated(
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
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
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    event.params.recipient,
    event.params.amount,
    event
  );
}
