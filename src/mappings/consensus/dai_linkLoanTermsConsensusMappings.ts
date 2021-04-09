import {
  TermsAccepted as TermsAcceptedEvent,
  TermsSubmitted as TermsSubmittedEvent,
  SignerAdded as SignerAddedEvent,
  SignerRemoved as SignerRemovedEvent,
} from "../../../generated/DAI_LINK_LoanTermsConsensus/DAILoanTermsConsensus";
import { TOKEN_DAI, CONTRACT_LOAN_TERMS_CONSENSUS, COLLATERAL_TOKEN_LINK } from "../../utils/consts";
import {
  internalHandleSigner,
  internalHandleLoanTermsSubmitted,
  internalHandleLoanTermsAccepted,
  internalHandleBorrowerNoncesChange,
} from "../../utils/consensus-commons";

export function handleTermsSubmitted(event: TermsSubmittedEvent): void {
  internalHandleLoanTermsSubmitted(
    TOKEN_DAI,
    COLLATERAL_TOKEN_LINK,
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
  let loanTermsAccepted = internalHandleLoanTermsAccepted(
    TOKEN_DAI,
    COLLATERAL_TOKEN_LINK,
    event.params.borrower,
    event.params.requestNonce,
    event.params.interestRate,
    event.params.collateralRatio,
    event.params.maxLoanAmount,
    event
  );

  internalHandleBorrowerNoncesChange(
    TOKEN_DAI,
    COLLATERAL_TOKEN_LINK,
    loanTermsAccepted
  )
}

export function handleSignerAdded(event: SignerAddedEvent): void {
  internalHandleSigner(
    TOKEN_DAI,
    COLLATERAL_TOKEN_LINK,
    CONTRACT_LOAN_TERMS_CONSENSUS,
    false,
    event.params.account,
    event
  );
}

export function handleSignerRemoved(event: SignerRemovedEvent): void {
  internalHandleSigner(
    TOKEN_DAI,
    COLLATERAL_TOKEN_LINK,
    CONTRACT_LOAN_TERMS_CONSENSUS,
    true,
    event.params.account,
    event
  );
}
