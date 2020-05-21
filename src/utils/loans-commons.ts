import { log, BigInt, EthereumEvent } from "@graphprotocol/graph-ts";
import {
  Borrower,
  LoanTerm,
  Loan,
  LoanRepayment,
  Liquidation,
  CollateralWithdraw,
  CollateralDeposit,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import {
  LOAN_STATUS_TERMS_SET,
  ETH_TX_LOAN_REPAID,
  ETH_TX_LOAN_TERMS_SET,
  ETH_TX_LOAN_LIQUIDATED,
  ETH_TX_LOAN_TAKEN_OUT,
  LOAN_STATUS_ACTIVE,
  LOAN_STATUS_CLOSED,
  ETH_TX_COLLATERAL_WITHDRAWN,
  ETH_TX_COLLATERAL_DEPOSITED,
} from "./consts";
import {
  CollateralDeposited as CollateralDepositedEvent,
  CollateralWithdrawn as CollateralWithdrawnEvent,
  LoanRepaid as LoanRepaidEvent,
  LoanTermsSet as LoanTermsSetEvent,
  LoanTakenOut as LoanTakenOutEvent,
  LoanLiquidated as LoanLiquidatedEvent,
} from "../../generated/DAILoans/DAILoans";
import {
  getOrCreateBorrower,
  getTimestampInMillis,
  getTimeInMillis,
  createEthTransaction,
  buildId,
  buildLoanIdBigInt,
  buildLoanId,
} from "./commons";

export function createLoanRepayment(token: string, loan:Loan, event: LoanRepaidEvent): LoanRepayment {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_REPAID);
  let loanID = buildLoanIdBigInt(token, event.params.loanID)
  let id = buildId(event);
  log.info("Creating loan repayment for loan id {}", [loanID]);
  let entity = new LoanRepayment(id);
  entity.transaction = ethTransaction.id;
  entity.loan = loan.id
  entity.amount = event.params.amountPaid;
  entity.payer = event.params.payer;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createLoanTerms(event: LoanTermsSetEvent): LoanTerm {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TERMS_SET);
  let id = event.params.loanID.toBigDecimal().toString();
  log.info("Creating loan terms for loan id {}", [id]);
  let entity = new LoanTerm(id);
  entity.transaction = ethTransaction.id;
  entity.interestRate = event.params.interestRate;
  entity.collateralRatio = event.params.collateralRatio;
  entity.maxLoanAmount = event.params.maxLoanAmount;
  entity.duration = getTimeInMillis(event.params.duration);
  entity.expiryAt = getTimeInMillis(event.params.termsExpiry);
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createLoan(
  loanID: string, // It already contains the token
  token: string,
  transactionId: string,
  loanTerms: LoanTerm,
  borrowerAddress: Address,
  recipient: Address,
  amountBorrowed: BigInt,
  event: EthereumEvent
): Loan {
  log.info("Creating {} loan with id {} ", [token, loanID])
  let entity = new Loan(loanID)
  entity.token = token
  entity.transaction = transactionId
  let borrower: Borrower = getOrCreateBorrower(borrowerAddress)
  entity.borrower = borrower.id
  entity.recipient = recipient
  entity.terms = loanTerms.id
  entity.startDate = BigInt.fromI32(0)
  entity.endDate = BigInt.fromI32(0)
  entity.status = LOAN_STATUS_TERMS_SET
  entity.amountBorrowed = amountBorrowed
  entity.totalRepaidAmount = BigInt.fromI32(0)
  entity.totalOwedAmount = BigInt.fromI32(0)
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

export function internalHandleLoanTakenOut(token:string, event: LoanTakenOutEvent): void {
  let loanID = buildLoanIdBigInt(token, event.params.loanID)

  log.info('Processing {} LoanTakenOut - loan id {}', [token, loanID])
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TAKEN_OUT)
  
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

export function internalHandleLoanRepaid(token:string, event: LoanRepaidEvent): void {
  let loanID = buildLoanIdBigInt(token, event.params.loanID)
  log.info('Getting loan id {}.', [loanID])
  let loan = Loan.load(loanID)
  
  let repayment = createLoanRepayment(token, loan as Loan, event)
  let repayments = loan.repayments

  repayments.push(repayment.id)
  loan.repayments = repayments
  let newStatus = event.params.totalOwed.isZero() ? LOAN_STATUS_CLOSED : LOAN_STATUS_ACTIVE;
  loan.status = newStatus
  loan.totalRepaidAmount = loan.totalRepaidAmount.plus(event.params.amountPaid)
  loan.totalOwedAmount = event.params.totalOwed
  loan.save()
}

export function internalHandleLoanTermsSet(token:string, event: LoanTermsSetEvent): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TERMS_SET)

  let loanID = buildLoanIdBigInt(token, event.params.loanID)
  let loanTerms = createLoanTerms(event)
  createLoan(
    loanID,
    token,
    ethTransaction.id,
    loanTerms,
    event.params.borrower,
    event.params.recipient,
    BigInt.fromI32(0),
    event,
  )
}

export function internalHandleLoanLiquidated(token: string, event: LoanLiquidatedEvent): void {
  let loanID = buildLoanIdBigInt(token, event.params.loanID)
  let loan = Loan.load(loanID)

  log.info('Creating {} liquidation for loan id {}', [token, loan.id])

  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_LIQUIDATED)

  let entity = new Liquidation(loanID)
  entity.transaction = ethTransaction.id
  entity.loan = loan.id
  entity.liquidator = event.params.liquidator
  entity.collateralOut = event.params.collateralOut
  entity.tokensIn = event.params.tokensIn
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()
  
  loan.liquidation = entity.id
  loan.save()
}

export function internalHandleCollateralWithdrawn(
  token: string,
  event: CollateralWithdrawnEvent
): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_COLLATERAL_WITHDRAWN);

  let loanID = buildLoanIdBigInt(token, event.params.loanID)
  log.info(`Adding collateral withdrawn {} for loan id {}.`, [token, loanID]);
  let collateralWId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let entity = new CollateralWithdraw(collateralWId);
  entity.loan = loanID;
  entity.transaction = ethTransaction.id;
  entity.borrower = getOrCreateBorrower(
    event.params.borrower
  ).address.toHexString();
  entity.amount = event.params.withdrawalAmount;
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();

  log.info("Adding new collateral withdrawn {} item in loan id {}", [
    entity.id,
    loanID,
  ]);
  let loan = Loan.load(loanID);
  let collateralWithdrawns = loan.collateralWithdrawns;
  collateralWithdrawns.push(collateralWId);
  loan.collateralWithdrawns = collateralWithdrawns;
  loan.totalCollateralWithdrawalsAmount = loan.totalCollateralWithdrawalsAmount.plus(
    event.params.withdrawalAmount
  );
  loan.save();
}

export function internalHandleCollateralDeposited(
  token: string,
  event: CollateralDepositedEvent
): void {
  let loanID = buildLoanIdBigInt(token, event.params.loanID)
  log.info("Adding collateral deposit {} for loan id {}", [token, loanID]);
  let ethTransaction = createEthTransaction(event, ETH_TX_COLLATERAL_DEPOSITED);

  let collateralDId = buildId(event);
  let entity = new CollateralDeposit(collateralDId);
  entity.loan = loanID;
  entity.transaction = ethTransaction.id;
  entity.borrower = getOrCreateBorrower(
    event.params.borrower
  ).address.toHexString();
  entity.amount = event.params.depositAmount;
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();

  log.info("Adding new collateral deposit {} item in loan id {}", [
    entity.id,
    loanID,
  ]);
  let loan = Loan.load(loanID);
  let collateralDeposits = loan.collateralDeposits;
  collateralDeposits.push(collateralDId);
  loan.collateralDeposits = collateralDeposits;
  loan.totalCollateralDepositsAmount = loan.totalCollateralDepositsAmount.plus(
    event.params.depositAmount
  );
  loan.save();
}