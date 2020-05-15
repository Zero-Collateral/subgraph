import { log } from '@graphprotocol/graph-ts'
import { BigInt } from "@graphprotocol/graph-ts"
import {
  CollateralDeposited as CollateralDepositedEvent,
  CollateralWithdrawn as CollateralWithdrawnEvent,
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent,
  LoanTakenOut as LoanTakenOutEvent,
} from "../../../generated/Loans/Loans"
import { LoanTerm, Loan, CollateralDeposit, CollateralWithdraw } from "../../../generated/schema"
import { getOrCreateBorrower, createEthTransaction, getTimestampInMillis, createLoanTerms, createLoan, createLoanRepayment } from "../../utils/commons"
import { LOAN_STATUS_CLOSED, LOAN_STATUS_ACTIVE, ETH_TX_COLLATERAL_DEPOSITED, ETH_TX_COLLATERAL_WITHDRAWN, ETH_TX_LOAN_TAKEN_OUT, ETH_TX_LOAN_TERMS_SET } from '../../utils/consts'

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
  loan.totalCollateralDepositsAmount = loan.totalCollateralDepositsAmount.plus(event.params.depositAmount)
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
  entity.amount = event.params.withdrawalAmount
  entity.blockNumber = ethTransaction.blockNumber
  entity.timestamp = getTimestampInMillis(event)
  entity.save()

  log.info('Adding new collateral withdrawn {} item in loan id {}', [entity.id, loanID])
  let loan = Loan.load(loanID)
  let collateralWithdrawns = loan.collateralWithdrawns;
  collateralWithdrawns.push(collateralWId)
  loan.collateralWithdrawns = collateralWithdrawns
  loan.totalCollateralWithdrawalsAmount = loan.totalCollateralWithdrawalsAmount.plus(event.params.withdrawalAmount)
  loan.save()
}

export function handleLoanTermsSet(event: LoanTermsSetEvent): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TERMS_SET)

  let loanID = event.params.loanID.toBigDecimal().toString()
  let loanTerms = createLoanTerms(event)
  createLoan(
    loanID,
    ethTransaction.id,
    loanTerms,
    event.params.borrower,
    event.params.recipient,
    BigInt.fromI32(0),
    event,
  )
}

export function handleLoanTakenOut(event: LoanTakenOutEvent): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TAKEN_OUT)

  let loanID = event.params.loanID.toBigDecimal().toString()
  let loan = Loan.load(loanID)
  let loanTerms = LoanTerm.load(loan.terms)

  loan.transaction = ethTransaction.id
  loan.status = LOAN_STATUS_ACTIVE
  loan.amountBorrowed = event.params.amountBorrowed
  loan.startDate = getTimestampInMillis(event)
  loan.endDate = loan.startDate.plus(loanTerms.duration)
  loan.save()

  let borrower = getOrCreateBorrower(event.params.borrower)
  log.info('Adding new loan {} to borrower {}', [loanID, event.params.borrower.toHexString()])
  let loans = borrower.loans
  loans.push(loanID)
  borrower.loans = loans
  borrower.save()
}

export function handleLoanRepaid(event: LoanRepaidEvent): void {
  let loanID = event.params.loanID.toBigDecimal().toString()
  let loan = Loan.load(loanID)
  let repayment = createLoanRepayment(event)
  let repayments = loan.repayments
  
  repayments.push(repayment.id)
  loan.repayments = repayments
  let newStatus = event.params.totalOwed.isZero() ? LOAN_STATUS_CLOSED : LOAN_STATUS_ACTIVE;
  loan.status = newStatus
  loan.totalRepaidAmount = loan.totalRepaidAmount.plus(event.params.paid)

  loan.save()
}

/*
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

*/