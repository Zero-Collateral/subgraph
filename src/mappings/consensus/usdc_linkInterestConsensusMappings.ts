import {
  InterestAccepted as InterestAcceptedEvent,
  InterestSubmitted as InterestSubmittedEvent,
  SignerAdded as SignerAddedEvent,
  SignerRemoved as SignerRemovedEvent,
} from "../../../generated/USDC_LINK_InterestConsensus/USDCInterestConsensus";
import {
  TOKEN_USDC,
  CONTRACT_INTEREST_CONSENSUS,
  COLLATERAL_TOKEN_LINK,
} from "../../utils/consts";
import {
  internalHandleSigner,
  internalHandleInterestSubmitted,
  internalHandleInterestAccepted,
} from "../../utils/consensus-commons";

export function handleInterestSubmitted(event: InterestSubmittedEvent): void {
  internalHandleInterestSubmitted(
    TOKEN_USDC,
    COLLATERAL_TOKEN_LINK,
    event.params.signer,
    event.params.lender,
    event.params.interest,
    event.params.endTime,
    event
  );
}

export function handleInterestAccepted(event: InterestAcceptedEvent): void {
  internalHandleInterestAccepted(
    TOKEN_USDC,
    COLLATERAL_TOKEN_LINK,
    event.params.lender,
    event.params.interest,
    event.params.endTime,
    event
  );
}

export function handleSignerAdded(event: SignerAddedEvent): void {
  internalHandleSigner(
    TOKEN_USDC,
    COLLATERAL_TOKEN_LINK,
    CONTRACT_INTEREST_CONSENSUS,
    false,
    event.params.account,
    event
  );
}

export function handleSignerRemoved(event: SignerRemovedEvent): void {
  internalHandleSigner(
    TOKEN_USDC,
    COLLATERAL_TOKEN_LINK,
    CONTRACT_INTEREST_CONSENSUS,
    true,
    event.params.account,
    event
  );
}
