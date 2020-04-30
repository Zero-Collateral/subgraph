import { log } from '@graphprotocol/graph-ts'
import { BigInt } from "@graphprotocol/graph-ts"
import {
  CollateralDeposited as CollateralDepositedEvent,
  CollateralWithdrawn as CollateralWithdrawnEvent,
  LoanCreated as LoanCreatedEvent,
  SignerAdded as SignerAddedEvent,
  SignerRemoved as SignerRemovedEvent,
} from "../../generated/Loans/Loans"
import { Borrower, Signer, Loan, CollateralDeposit, CollateralWithdraw } from "../../generated/schema"
import { getOrCreateBorrower, createEthTransaction, getTimestampInMillis } from "../utils/commons"
import { ETH_TX_COLLATERAL_DEPOSITED, ETH_TX_COLLATERAL_WITHDRAWN, ETH_TX_LOAN_CREATED } from '../utils/consts'

export function handleCollateralDeposited(event: CollateralDepositedEvent): void {
  let loanID = event.params.loanID.toBigDecimal().toString()
  log.info('Adding collateral deposit for loan id {}', [loanID])
  let ethTransaction = createEthTransaction(event, ETH_TX_COLLATERAL_DEPOSITED)

  let collateralDId = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let entity = new CollateralDeposit(collateralDId)
  entity.loan = loanID
  entity.transaction = ethTransaction.id
  entity.borrower = getOrCreateBorrower(event.params.borrower).address.toHexString()
  entity.amount = event.params.depositAmount
  entity.blockNumber = ethTransaction.blockNumber
  entity.timestamp = getTimestampInMillis(event)
  entity.save()

  log.info('Adding new collateral deposit {} item in loan id {}', [entity.id, loanID])
  let loan = Loan.load(loanID)
  let collateralDeposits = loan.collateralDeposits;
  collateralDeposits.push(collateralDId)
  loan.collateralDeposits = collateralDeposits

  loan.save()
}

export function handleCollateralWithdrawn(event: CollateralWithdrawnEvent): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_COLLATERAL_WITHDRAWN)

  let loanID = event.params.loanID.toBigDecimal().toString()
  log.info(`Adding collateral withdrawn for loan id ${loanID}`, [])
  let collateralWId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let entity = new CollateralWithdraw(collateralWId)
  entity.loan = loanID
  entity.transaction = ethTransaction.id
  entity.borrower = getOrCreateBorrower(event.params.borrower).address.toHexString()
  entity.amount = event.params.depositAmount
  entity.blockNumber = ethTransaction.blockNumber
  entity.timestamp = getTimestampInMillis(event)
  entity.save()

  log.info('Adding new collateral withdrawn {} item in loan id {}', [entity.id, loanID])
  let loan = Loan.load(loanID)
  let collateralWithdrawns = loan.collateralWithdrawns;
  collateralWithdrawns.push(collateralWId)
  loan.collateralWithdrawns = collateralWithdrawns
  loan.save()
}

export function handleLoanCreated(event: LoanCreatedEvent): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_CREATED)

  let loanID = event.params.loanID.toBigDecimal().toString()
  let address = event.params.borrower
  let borrower:Borrower = getOrCreateBorrower(event.params.borrower)

  let loan = new Loan(loanID)
  log.info('Adding new loan {}', [loanID])
  loan.borrower = address.toHexString()
  loan.transaction = ethTransaction.id
  // TODO Do we need end date? or just we calculate with start date and number of days?
  loan.startDate = getTimestampInMillis(event)
  loan.amountBorrow = event.transaction.value
  loan.interestRate = event.params.interestRate
  loan.collateralRatio = event.params.collateralRatio
  loan.maxLoanAmount = event.params.maxLoanAmount
  loan.numberDays = event.params.numberDays
  loan.collateralDeposits = []
  loan.collateralWithdrawns = []
  loan.blockNumber = ethTransaction.blockNumber
  loan.timestamp = getTimestampInMillis(event)
  loan.save()

  log.info('Adding new loan {} to borrower {}', [loanID, address.toHex()])
  let loans = borrower.loans
  loans.push(loanID)
  borrower.loans = loans
  borrower.save()
}

export function handleSignerAdded(event: SignerAddedEvent): void {
  let signerId = event.params.account.toHexString()
  let signer = Signer.load(signerId)
  if  (signer == null) {
    signer = new Signer(signerId)
    signer.address = event.params.account
    signer.active = true
  }
  signer.save()
}

export function handleSignerRemoved(event: SignerRemovedEvent): void {
  let signerId = event.params.account.toHexString()
  let signer = Signer.load(signerId)
  signer.active = false
  signer.save()
}
