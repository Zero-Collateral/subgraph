import { log, EthereumEvent, BigInt } from "@graphprotocol/graph-ts";
import {
  SignerStatus,
  SignerChange,
  InterestSubmitted,
  InterestAccepted,
  LoanTermsSubmitted,
  LoanTermsAccepted,
} from "../../generated/schema";
import {
  InterestAccepted as InterestAcceptedEvent,
  InterestSubmitted as InterestSubmittedEvent,
} from "../../generated/DAIInterestConsensus/DAIInterestConsensus"
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

export function createSignerChange(event: EthereumEvent, token: string, contract: string, account: Address, removed: boolean): void {
  let eventType = removed ? ETH_TX_SIGNER_REMOVED : ETH_TX_SIGNER_ADDED
  let id = buildSignerId(token, contract, account)
  log.info('Creating signer change (removed? {}) for id {}.', [removed.toString(), id])
  let ethTransaction = createEthTransaction(event, eventType)
  let entity = new SignerChange(id)
  entity.transaction = ethTransaction.id
  entity.account = account
  entity.token = token
  entity.contract = contract
  entity.removed = removed
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleSigner(token: string, contract: string, removed: boolean, account: Address, event: EthereumEvent): void {
  createSignerChange(
    event,
    token,
    contract,
    account,
    removed
  )

  let signerId = buildSignerId(token, contract, account)
  let entity = SignerStatus.load(signerId)
  if (entity == null) {
    entity = new SignerStatus(signerId)
    entity.account = account
  }
  entity.token = token
  entity.contract = contract
  entity.removed = removed
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleInterestSubmitted(token: string, event: InterestSubmittedEvent): void {
  let id = buildId(event)
  log.info('Creating new interest submitted {} with id {}', [token, id])
  let ethTransaction = createEthTransaction(event, ETH_TX_INTEREST_SUBMITTED)
  let entity = new InterestSubmitted(id)
  entity.transaction = ethTransaction.id
  entity.token = token
  entity.signer = event.params.signer
  entity.lender = event.params.lender
  entity.interest = event.params.interest
  entity.endTime = event.params.endTime
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleInterestAccepted(token: string, event: InterestAcceptedEvent): void {
  let id = buildId(event)
  log.info('Creating new interest accepted {} with id {}', [token, id])
  let ethTransaction = createEthTransaction(event, ETH_TX_INTEREST_ACCEPTED)
  let entity = new InterestAccepted(id)
  entity.token = token
  entity.transaction = ethTransaction.id
  entity.lender = event.params.lender
  entity.endTime = event.params.endTime
  entity.interest = event.params.interest
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleLoanTermsSubmitted(
  token: string,
  signer: Address,
  borrower: Address,
  requestNonce: BigInt,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  event: EthereumEvent
): void {
  let id = buildId(event)
  log.info('Creating new loan terms submitted ({}) with id {}', [token, id])
  let ethTransaction = createEthTransaction(event, ETH_TX_TERMS_SUBMITTED)
  let entity = new LoanTermsSubmitted(id)
  entity.transaction = ethTransaction.id
  entity.token = token
  entity.signer = signer
  entity.borrower = borrower
  entity.requestNonce = requestNonce
  entity.interestRate = interestRate
  entity.collateralRatio = collateralRatio
  entity.maxLoanAmount = maxLoanAmount
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}

export function internalHandleLoanTermsAccepted(
  token: string,
  borrower: Address,
  requestNonce: BigInt,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  event: EthereumEvent): void {
  let id = buildId(event)
  log.info('Creating new loan terms accepted ({}) with id {}', [token, id])
  let ethTransaction = createEthTransaction(event, ETH_TX_TERMS_ACCEPTED)
  let entity = new LoanTermsAccepted(id)
  entity.token = token
  entity.transaction = ethTransaction.id
  entity.borrower = borrower
  entity.requestNonce = requestNonce
  entity.interestRate = interestRate
  entity.collateralRatio = collateralRatio
  entity.maxLoanAmount = maxLoanAmount
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
}