import { log, BigInt, EthereumEvent, Bytes } from '@graphprotocol/graph-ts'
import { Borrower, LendingPoolStatus, EthTransaction, ZTokenStatus, ZTokenBalance, LendingPoolPause, LoanTerm, Loan, LoanRepayment } from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import { EMPTY_ADDRESS_STRING, LOAN_STATUS_TERMS_SET, ETH_TX_LOAN_REPAID, ETH_TX_LOAN_TERMS_SET } from './consts';
import {
  Transfer as TransferEvent,
} from "../../generated/ZToken/ZToken";
import {
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent,
} from "../../generated/Loans/Loans"
import { LendingPoolPaused } from '../../generated/SettingsInterface/SettingsInterface';

export function getTimestampInMillis(event: EthereumEvent): BigInt {
  return event.block.timestamp.times(BigInt.fromI32(1000));
}

export function getTimeInMillis(time: BigInt): BigInt {
  return time.times(BigInt.fromI32(1000));
}

export function createEthTransaction (event:EthereumEvent, action:string): EthTransaction {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  log.info("Creating EthTransaction with id {}", [id])
  let entity = new EthTransaction(id)
  entity.event = action
  entity.from = event.transaction.from
  entity.gasPrice = event.transaction.gasPrice
  entity.gasSent = event.transaction.gasUsed
  entity.hash = event.transaction.hash
  entity.index = event.transaction.index
  entity.to = event.transaction.to as Bytes
  entity.value = event.transaction.value
  entity.contract = event.address
  entity.timestamp = getTimestampInMillis(event)
  entity.gasLimit = event.block.gasLimit
  entity.blockNumber = event.block.number
  entity.save()
  return entity;
}

export function getOrCreateBorrower (address:Address): Borrower {
  log.info("Trying to load borrower by address {}", [address.toHexString()])
  let borrower = Borrower.load(address.toHexString())
  if (borrower == null){
    log.info("Creating borrower with address {}", [address.toHexString()])
    borrower = new Borrower(address.toHexString())
    borrower.address = address
    borrower.loans = [];
    borrower.save()
  }
  return borrower as Borrower;
}

export function createLendingPoolStatus (id:string, zToken:string, lendingToken:string, action:string, address:Address, amount:BigInt, transaction:EthTransaction): void {
  log.info("Creating lending pool action {} ({}/{}) for address / amount {} / {}", [action.toString(), zToken, lendingToken, address.toHexString(), amount.toString()])
  let daiPoolAction = new LendingPoolStatus(id)
  daiPoolAction.zToken = zToken
  daiPoolAction.lendingToken = lendingToken
  daiPoolAction.action = action
  daiPoolAction.address = address
  daiPoolAction.amount = amount
  daiPoolAction.transaction = transaction.id
  daiPoolAction.blockNumber = transaction.blockNumber
  daiPoolAction.timestamp = transaction.timestamp
  daiPoolAction.save()
}

export function buildId(event:EthereumEvent): string {
  return event.transaction.hash.toHex() + "-" + event.logIndex.toString();
}

export function createZTokenStatus(id: string, amount:BigInt, zToken:string, from:Address, to:Address, action:string, ethTransaction:EthTransaction): void {
  let entity = new ZTokenStatus(id);
  entity.transaction = ethTransaction.id
  entity.amount = amount
  entity.zToken = zToken
  entity.from = from
  entity.to = to
  entity.action = action
  entity.blockNumber = ethTransaction.blockNumber
  entity.timestamp = ethTransaction.timestamp
  entity.save()
}

export function getOrCreateZTokenBalance(holder: Address): ZTokenBalance {
  let id = holder.toHexString();
  log.info('Loading ZTokenBalance for holder {}', [id])
  let entity = ZTokenBalance.load(id);
  if (entity == null) {
    log.info('Creating new ZTokenBalance instance for holder {}', [id])
    entity = new ZTokenBalance(id)
    entity.amount = BigInt.fromI32(0)
    entity.account = holder
    entity.blockNumber = BigInt.fromI32(0)
    entity.updatedAt = BigInt.fromI32(0)
  }
  return entity as ZTokenBalance;
}

export function updateZTokenBalancesFor(zToken: string, event: TransferEvent): void {
  log.info('Updating ZToken balance for holders {} / {} ', [event.params.from.toHexString(), event.params.to.toHexString()])
  if (event.params.from.toHexString() != EMPTY_ADDRESS_STRING) {
    let fromEntity = getOrCreateZTokenBalance(event.params.from)
    log.info('Updating ZToken balance for holder {} (from). Current balance {} {}', [event.params.from.toHexString(), fromEntity.amount.toString(), zToken])
    fromEntity.amount = fromEntity.amount.minus(event.params.value)
    fromEntity.zToken = zToken
    fromEntity.blockNumber = event.block.number
    fromEntity.updatedAt = getTimestampInMillis(event)
    fromEntity.save()
  }
  if (event.params.to.toHexString() != EMPTY_ADDRESS_STRING) {
    let toEntity = getOrCreateZTokenBalance(event.params.to)
    log.info('Updating ZToken balance for holder {} (to). Current balance {} {}', [event.params.to.toHexString(), toEntity.amount.toString(), zToken])
    toEntity.amount = toEntity.amount.plus(event.params.value)
    toEntity.zToken = zToken
    toEntity.blockNumber = event.block.number
    toEntity.updatedAt = getTimestampInMillis(event)
    toEntity.save()
  }
}

export function updateOrCreateLendingPoolPause(id: string, paused:boolean, lendingPool:Bytes, blockNumber:BigInt, timestamp:BigInt ): void {
  let pauseEntity = LendingPoolPause.load(id)
  if(pauseEntity == null) {
    pauseEntity = new LendingPoolPause(id);
    pauseEntity.paused = paused
  }
  pauseEntity.lendingPool = lendingPool
  pauseEntity.lastBlockNumber = blockNumber
  pauseEntity.lastTimestamp = timestamp
  pauseEntity.save()
}

export function createLoanRepayment(event: LoanRepaidEvent): LoanRepayment {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_REPAID)
  let loanID = event.params.loanID.toBigDecimal().toString()
  let id = buildId(event)
  log.info('Creating loan repayment for loan id {}', [loanID])
  let entity = new LoanRepayment(id)
  entity.transaction = ethTransaction.id
  entity.amount = event.params.paid
  entity.payer = event.params.payer
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
  return entity;
}

export function createLoanTerms(event: LoanTermsSetEvent): LoanTerm {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TERMS_SET)
  let id = event.params.loanID.toBigDecimal().toString()
  log.info('Creating loan terms for loan id {}', [id])
  let entity = new LoanTerm(id)
  entity.transaction = ethTransaction.id
  entity.interestRate = event.params.interestRate
  entity.collateralRatio = event.params.collateralRatio
  entity.maxLoanAmount = event.params.maxLoanAmount
  entity.duration = getTimeInMillis(event.params.duration)
  entity.expiryAt = getTimeInMillis(event.params.termsExpiry)
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
  return entity;
}

export function createLoan(
  loanID:string,
  transactionId:string,
  loanTerms:LoanTerm,
  borrowerAddress:Address,
  recipient:Address,
  amountBorrowed:BigInt,
  event:EthereumEvent
): Loan {
  let id = loanID
  log.info('Creating loan with id {}', [id])
  let entity = new Loan(id)
  entity.transaction = transactionId
  let borrower:Borrower = getOrCreateBorrower(borrowerAddress)
  entity.borrower = borrower.id
  entity.recipient = recipient
  entity.terms = loanTerms.id
  entity.startDate = BigInt.fromI32(0)
  entity.endDate = BigInt.fromI32(0)
  entity.status = LOAN_STATUS_TERMS_SET
  entity.amountBorrowed = amountBorrowed
  entity.totalRepaidAmount = BigInt.fromI32(0)
  entity.totalCollateralDepositsAmount = BigInt.fromI32(0)
  entity.totalCollateralWithdrawalsAmount = BigInt.fromI32(0)
  entity.repayments = []
  entity.collateralDeposits = []
  entity.collateralWithdrawns = []
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
  return entity
}