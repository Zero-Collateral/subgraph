import {
  TermsAccepted as TermsAcceptedEvent,
  TermsSubmitted as TermsSubmittedEvent,
  SignerAdded as SignerAddedEvent,
  SignerRemoved as SignerRemovedEvent,
} from "../../../generated/DAILoanTermsConsensus/DAILoanTermsConsensus";
import { TOKEN_DAI, CONTRACT_LOAN_TERMS_CONSENSUS } from "../../utils/consts";
import {
  internalHandleSigner,
  internalHandleLoanTermsSubmitted,
  internalHandleLoanTermsAccepted,
} from "../../utils/consensus-commons";

export function handleTermsSubmitted(event: TermsSubmittedEvent): void {
  internalHandleLoanTermsSubmitted(
    TOKEN_DAI,
    event.params.signer,
    event.params.borrower,
    event.params.requestNonce,
    event.params.interestRate,
    event.params.collateralRatio,
    event.params.maxLoanAmount,
    event
  );
}

export function handleTermsAccepted(event: TermsAcceptedEvent): void {
  internalHandleLoanTermsAccepted(
    TOKEN_DAI,
    event.params.borrower,
    event.params.requestNonce,
    event.params.interestRate,
    event.params.collateralRatio,
    event.params.maxLoanAmount,
    event
  );
}

export function handleSignerAdded(event: SignerAddedEvent): void {
  internalHandleSigner(
    TOKEN_DAI,
    CONTRACT_LOAN_TERMS_CONSENSUS,
    false,
    event.params.account,
    event
  );
}

export function handleSignerRemoved(event: SignerRemovedEvent): void {
  internalHandleSigner(
    TOKEN_DAI,
    CONTRACT_LOAN_TERMS_CONSENSUS,
    true,
    event.params.account,
    event
  );
}
