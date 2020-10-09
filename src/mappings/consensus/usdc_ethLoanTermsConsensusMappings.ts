import {
  TermsAccepted as TermsAcceptedEvent,
  TermsSubmitted as TermsSubmittedEvent,
  SignerAdded as SignerAddedEvent,
  SignerRemoved as SignerRemovedEvent,
} from "../../../generated/USDC_ETH_LoanTermsConsensus/USDCLoanTermsConsensus";
import { TOKEN_USDC, CONTRACT_LOAN_TERMS_CONSENSUS, COLLATERAL_TOKEN_ETH } from "../../utils/consts";
import {
  internalHandleSigner,
  internalHandleLoanTermsSubmitted,
  internalHandleLoanTermsAccepted,
  internalHandleBorrowerNoncesChange,
} from "../../utils/consensus-commons";

export function handleTermsSubmitted(event: TermsSubmittedEvent): void {
  internalHandleLoanTermsSubmitted(
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    event.params.signer,
    event.params.borrower,
    event.params.requestNonce,
    event.params.signerNonce,
    event.params.interestRate,
    event.params.collateralRatio,
    event.params.maxLoanAmount,
    event
  );
}

export function handleTermsAccepted(event: TermsAcceptedEvent): void {
  let loanTermsAccepted = internalHandleLoanTermsAccepted(
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    event.params.borrower,
    event.params.requestNonce,
    event.params.interestRate,
    event.params.collateralRatio,
    event.params.maxLoanAmount,
    event
  );
  internalHandleBorrowerNoncesChange(
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    loanTermsAccepted
  )
}

export function handleSignerAdded(event: SignerAddedEvent): void {
  internalHandleSigner(
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    CONTRACT_LOAN_TERMS_CONSENSUS,
    false,
    event.params.account,
    event
  );
}

export function handleSignerRemoved(event: SignerRemovedEvent): void {
  internalHandleSigner(
    TOKEN_USDC,
    COLLATERAL_TOKEN_ETH,
    CONTRACT_LOAN_TERMS_CONSENSUS,
    true,
    event.params.account,
    event
  );
}
