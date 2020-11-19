import { log, ethereum, BigInt } from "@graphprotocol/graph-ts";
import {
  SignerStatus,
  SignerChange,
  InterestSubmitted,
  InterestAccepted,
  LoanTermsSubmitted,
  LoanTermsAccepted,
  BorrowerNoncesChange,
  LenderNoncesChange,
  EthTransaction,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import {
  ETH_TX_SIGNER_REMOVED,
  ETH_TX_SIGNER_ADDED,
  ETH_TX_INTEREST_SUBMITTED,
  ETH_TX_INTEREST_ACCEPTED,
  ETH_TX_TERMS_SUBMITTED,
  ETH_TX_TERMS_ACCEPTED,
} from "./consts";
import {
  getTimestampInMillis,
  createEthTransaction,
  buildSignerId,
  buildId,
} from "./commons";

export function createSignerChange(
  event: ethereum.Event,
  token: string,
  collateralToken: string,
  contract: string,
  account: Address,
  removed: boolean
): void {
  let eventType = removed ? ETH_TX_SIGNER_REMOVED : ETH_TX_SIGNER_ADDED
  let id = buildSignerId(token, contract, account)
  log.info("Creating signer change (removed? {}) for id {}.", [
    removed.toString(),
    id,
  ])
  let ethTransaction = createEthTransaction(event, eventType)
  let entity = new SignerChange(id)
  entity.transaction = ethTransaction.id
  entity.account = account
  entity.token = token
  entity.collateralToken = collateralToken
  entity.contract = contract
  entity.removed = removed
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleSigner(
  token: string,
  collateralToken: string,
  contract: string,
  removed: boolean,
  account: Address,
  event: ethereum.Event
): void {
  createSignerChange(event, token, collateralToken, contract, account, removed);

  let signerId = buildSignerId(token, contract, account)
  let entity = SignerStatus.load(signerId)
  if (entity == null) {
    entity = new SignerStatus(signerId)
    entity.account = account
  }
  entity.token = token
  entity.collateralToken = collateralToken
  entity.contract = contract
  entity.removed = removed
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleInterestSubmitted(
  token: string,
  collateralToken: string,
  signer: Address,
  lender: Address,
  interest: BigInt,
  endTime: BigInt,
  requestNonce: BigInt,
  event: ethereum.Event
): void {
  let id = buildId(event)
  log.info("Creating new interest submitted ({}/{}) with id {}", [token, collateralToken, id])
  let ethTransaction = createEthTransaction(event, ETH_TX_INTEREST_SUBMITTED)
  let entity = new InterestSubmitted(id)
  entity.transaction = ethTransaction.id
  entity.token = token
  entity.collateralToken = collateralToken
  entity.signer = signer
  entity.lender = lender
  entity.interest = interest
  entity.endTime = endTime
  entity.requestNonce = requestNonce
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleInterestAccepted(
  token: string,
  collateralToken: string,
  lender: Address,
  interest: BigInt,
  endTime: BigInt,
  requestNonce: BigInt,
  event: ethereum.Event
): InterestAccepted {
  let id = buildId(event)
  log.info("Creating new interest accepted ({} / {}) with id {}", [token, collateralToken, id])
  let ethTransaction = createEthTransaction(event, ETH_TX_INTEREST_ACCEPTED)
  let entity = new InterestAccepted(id)
  entity.token = token
  entity.collateralToken = collateralToken
  entity.transaction = ethTransaction.id
  entity.lender = lender
  entity.endTime = endTime
  entity.interest = interest
  entity.requestNonce = requestNonce
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
  return entity
}

export function createLoanTermsSubmitted(
  token: string,
  collateralToken: string,
  signer: Address,
  borrower: Address,
  requestNonce: BigInt,
  signerNonce: BigInt,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  ethTransaction: EthTransaction,
  event: ethereum.Event
): LoanTermsSubmitted {
  let id = buildId(event);
  log.info("Creating new loan terms submitted ({}) with id {}", [token, id]);
  let entity = new LoanTermsSubmitted(id);
  entity.transaction = ethTransaction.id;
  entity.token = token;
  entity.collateralToken = collateralToken;
  entity.signer = signer;
  entity.borrower = borrower;
  entity.requestNonce = requestNonce;
  entity.signerNonce = signerNonce;
  entity.interestRate = interestRate;
  entity.collateralRatio = collateralRatio;
  entity.maxLoanAmount = maxLoanAmount;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function internalHandleLoanTermsSubmitted(
  token: string,
  collateralToken: string,
  signer: Address,
  borrower: Address,
  requestNonce: BigInt,
  signerNonce: BigInt,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  event: ethereum.Event
): void {
  let id = buildId(event);
  log.info("Creating new loan terms submitted ({}) with id {}", [token, id]);
  let ethTransaction = createEthTransaction(event, ETH_TX_TERMS_SUBMITTED);
  createLoanTermsSubmitted(
    token,
    collateralToken,
    signer,
    borrower,
    requestNonce,
    signerNonce,
    interestRate,
    collateralRatio,
    maxLoanAmount,
    ethTransaction,
    event,
  )
}

export function internalHandleLoanTermsAccepted(
  token: string,
  collateralToken: string,
  borrower: Address,
  requestNonce: BigInt,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  event: ethereum.Event
): LoanTermsAccepted {
  let id = buildId(event);
  log.info("Creating new loan terms accepted ({}) with id {}", [token, id]);
  let ethTransaction = createEthTransaction(event, ETH_TX_TERMS_ACCEPTED);
  let entity = new LoanTermsAccepted(id);
  entity.token = token;
  entity.collateralToken = collateralToken;
  entity.transaction = ethTransaction.id;
  entity.borrower = borrower;
  entity.requestNonce = requestNonce;
  entity.interestRate = interestRate;
  entity.collateralRatio = collateralRatio;
  entity.maxLoanAmount = maxLoanAmount;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function internalHandleBorrowerNoncesChange(
  token: string,
  collateralToken: string,
  loanTermsAccepted: LoanTermsAccepted
): void {
  let borrower = loanTermsAccepted.borrower
  let requestNonce = loanTermsAccepted.requestNonce
  log.info("Creating new borrower nonce change: Market: {}/{} - Borrower {} - Nonce: {}", [token, collateralToken, borrower.toHexString(), requestNonce.toString()]);
  
  let id = loanTermsAccepted.id
  let entity = new BorrowerNoncesChange(id);
  entity.borrower = borrower
  entity.token = token
  entity.collateralToken = collateralToken
  entity.nonce = requestNonce
  entity.timestamp = loanTermsAccepted.timestamp
  entity.blockNumber = loanTermsAccepted.blockNumber
  entity.save()
}

export function internalHandleLenderNoncesChange(
  token: string,
  collateralToken: string,
  interestAccepted: InterestAccepted
): void {
  let lender = interestAccepted.lender
  let requestNonce = interestAccepted.requestNonce
  log.info("Creating new lender nonce change: Market: {}/{} - Lender {} - Nonce: {}", [token, collateralToken, lender.toHexString(), requestNonce.toString()]);
  
  let id = interestAccepted.id
  let entity = new LenderNoncesChange(id);
  entity.lender = lender
  entity.token = token
  entity.collateralToken = collateralToken
  entity.nonce = requestNonce
  entity.timestamp = interestAccepted.timestamp
  entity.blockNumber = interestAccepted.blockNumber
  entity.save()
}