import {
  InterestAccepted as InterestAcceptedEvent,
  InterestSubmitted as InterestSubmittedEvent,
  SignerAdded as SignerAddedEvent,
  SignerRemoved as SignerRemovedEvent,
} from "../../../generated/DAIInterestConsensus/DAIInterestConsensus";
import { TOKEN_USDC, CONTRACT_INTEREST_CONSENSUS } from "../../utils/consts";
import {
  internalHandleSigner,
  internalHandleInterestSubmitted,
  internalHandleInterestAccepted,
} from "../../utils/consensus-commons";

export function handleInterestSubmitted(event: InterestSubmittedEvent): void {
  internalHandleInterestSubmitted(TOKEN_USDC, event);
}

export function handleInterestAccepted(event: InterestAcceptedEvent): void {
  internalHandleInterestAccepted(TOKEN_USDC, event);
}

export function handleSignerAdded(event: SignerAddedEvent): void {
  internalHandleSigner(TOKEN_USDC, CONTRACT_INTEREST_CONSENSUS, false, event.params.account, event);
}

export function handleSignerRemoved(event: SignerRemovedEvent): void {
  internalHandleSigner(TOKEN_USDC, CONTRACT_INTEREST_CONSENSUS, true, event.params.account, event);
}
