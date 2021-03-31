import { log, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  Borrower,
  LoanTerm,
  Loan,
  LoanRepayment,
  Liquidation,
  CollateralWithdraw,
  CollateralDeposit,
  Escrow,
  EthTransaction,
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
  getOrCreateBorrower,
  getTimestampInMillis,
  getTimeInMillis,
  createEthTransaction,
  buildId,
  updateTTokenTotalLentFor,
  updateTTokenTotalRepaidFor,
} from "./commons";

export function createLoanRepayment(
  loan: Loan,
  amountPaid: BigInt,
  payer: Address,
  event: ethereum.Event
): LoanRepayment {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_REPAID);
  let id = buildId(event);
  let loanID = loan.id;
  log.info("Creating loan repayment for loan id {}", [loanID]);
  let entity = new LoanRepayment(id);
  entity.transaction = ethTransaction.id;
  entity.loan = loanID;
  entity.amount = amountPaid;
  entity.payer = payer;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createLoanTerms(
  loanID: string,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  duration: BigInt,
  termsExpiry: BigInt,
  nonce: BigInt,
  event: ethereum.Event
): LoanTerm {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TERMS_SET);
  log.info("Creating loan terms for loan id {}", [loanID]);
  let entity = new LoanTerm(loanID);
  entity.transaction = ethTransaction.id;
  entity.interestRate = interestRate;
  entity.collateralRatio = collateralRatio;
  entity.maxLoanAmount = maxLoanAmount;
  entity.duration = getTimeInMillis(duration);
  entity.expiryAt = getTimeInMillis(termsExpiry);
  entity.nonce = nonce;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createLoan(
  loanID: string, // It already contains the token
  token: string,
  collateralToken: string,
  transactionId: string,
  loanTerms: LoanTerm,
  borrowerAddress: Address,
  recipient: Address,
  amountBorrowed: BigInt,
  event: ethereum.Event
): Loan {
  log.info("Creating {} loan with id {} ", [token, loanID]);
  let entity = new Loan(loanID);
  entity.token = token;
  entity.collateralToken = collateralToken;
  entity.transaction = transactionId;
  let borrower: Borrower = getOrCreateBorrower(borrowerAddress);
  entity.borrower = borrower.id;
  entity.recipient = recipient;
  entity.terms = loanTerms.id;
  entity.startDate = BigInt.fromI32(0);
  entity.endDate = BigInt.fromI32(0);
  entity.status = LOAN_STATUS_TERMS_SET;
  entity.amountBorrowed = amountBorrowed;
  entity.totalRepaidAmount = BigInt.fromI32(0);
  entity.totalOwedAmount = BigInt.fromI32(0);
  entity.totalCollateralDepositsAmount = BigInt.fromI32(0);
  entity.totalCollateralWithdrawalsAmount = BigInt.fromI32(0);
  entity.repayments = [];
  entity.collateralDeposits = [];
  entity.collateralWithdrawns = [];
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createEscrow(escrowAddress: Address, loan: Loan): Escrow {
  let id = escrowAddress.toHexString();
  log.info("Creating an escrow (id: {}) associated to the loan {} ", [
    id,
    loan.id,
  ]);
  let entity = new Escrow(id);
  entity.transaction = loan.transaction;
  entity.loan = loan.id;
  entity.blockNumber = loan.blockNumber;
  entity.timestamp = loan.timestamp;
  entity.save();
  return entity;
}

export function internalHandleLoanTakenOut(
  loanID: string,
  tToken: Address,
  borrowerAddress: Address,
  escrowAddress: Address,
  amountBorrowed: BigInt,
  event: ethereum.Event
): void {
  log.info("Processing LoanTakenOut - loan id {}", [loanID]);
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TAKEN_OUT);

  let loan = Loan.load(loanID);
  let loanTerms = LoanTerm.load(loan.terms);

  loan.transaction = ethTransaction.id;
  loan.status = LOAN_STATUS_ACTIVE;
  loan.amountBorrowed = amountBorrowed;
  loan.startDate = getTimestampInMillis(event);
  loan.endDate = loan.startDate.plus(loanTerms.duration);

  let escrow = createEscrow(escrowAddress, loan as Loan);
  loan.escrow = escrow.id;
  loan.save();

  let borrower = getOrCreateBorrower(borrowerAddress);
  log.info("Adding new loan {} to borrower {}", [
    loanID,
    borrowerAddress.toHexString(),
  ]);
  let loans = borrower.loans;
  loans.push(loanID);
  borrower.loans = loans;
  borrower.save();

  updateTTokenTotalLentFor(tToken, amountBorrowed, ethTransaction);
}

export function internalHandleLoanRepaid(
  tToken: Address,
  loanID: string,
  amountPaid: BigInt,
  payer: Address,
  totalOwed: BigInt,
  event: ethereum.Event
): void {
  log.info("Getting loan id {}.", [loanID]);
  let loan = Loan.load(loanID);

  let repayment = createLoanRepayment(loan as Loan, amountPaid, payer, event);
  let repayments = loan.repayments;

  repayments.push(repayment.id);
  loan.repayments = repayments;
  let newStatus = totalOwed.isZero() ? LOAN_STATUS_CLOSED : LOAN_STATUS_ACTIVE;
  loan.status = newStatus;
  loan.totalRepaidAmount = loan.totalRepaidAmount.plus(amountPaid);
  loan.totalOwedAmount = totalOwed;
  loan.save();

  let ethTransaction = EthTransaction.load(
    repayment.transaction
  ) as EthTransaction;
  updateTTokenTotalRepaidFor(tToken, amountPaid, ethTransaction);
}

export function internalHandleLoanTermsSet(
  loanID: string,
  token: string,
  collateralToken: string,
  borrower: Address,
  recipient: Address,
  interestRate: BigInt,
  collateralRatio: BigInt,
  maxLoanAmount: BigInt,
  duration: BigInt,
  termsExpiry: BigInt,
  nonce: BigInt,
  event: ethereum.Event
): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_TERMS_SET);
  let loanTerms = createLoanTerms(
    loanID,
    interestRate,
    collateralRatio,
    maxLoanAmount,
    duration,
    termsExpiry,
    nonce,
    event
  );

  createLoan(
    loanID,
    token,
    collateralToken,
    ethTransaction.id,
    loanTerms,
    borrower,
    recipient,
    BigInt.fromI32(0),
    event
  );
}

export function internalHandleLoanLiquidated(
  loanID: string,
  liquidator: Address,
  collateralOut: BigInt,
  tokensIn: BigInt,
  event: ethereum.Event
): void {
  let loan = Loan.load(loanID);

  log.info("Creating liquidation for loan id {}", [loan.id]);

  let ethTransaction = createEthTransaction(event, ETH_TX_LOAN_LIQUIDATED);

  let entity = new Liquidation(loanID);
  entity.transaction = ethTransaction.id;
  entity.loan = loan.id;
  entity.liquidator = liquidator;
  entity.collateralOut = collateralOut;
  entity.tokensIn = tokensIn;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();

  loan.liquidation = entity.id;
  loan.status = LOAN_STATUS_CLOSED;
  loan.save();
}

export function internalHandleCollateralWithdrawn(
  loanID: string,
  borrower: Address,
  withdrawalAmount: BigInt,
  event: ethereum.Event
): void {
  let ethTransaction = createEthTransaction(event, ETH_TX_COLLATERAL_WITHDRAWN);

  log.info(`Adding collateral withdrawn for loan id {}.`, [loanID]);
  let collateralWId =
    event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  let entity = new CollateralWithdraw(collateralWId);
  entity.loan = loanID;
  entity.transaction = ethTransaction.id;
  entity.borrower = getOrCreateBorrower(borrower).address.toHexString();
  entity.amount = withdrawalAmount;
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
    withdrawalAmount
  );
  loan.save();
}

export function internalHandleCollateralDeposited(
  loanID: string,
  borrower: Address,
  depositAmount: BigInt,
  event: ethereum.Event
): void {
  log.info("Adding collateral deposit for loan id {}", [loanID]);
  let ethTransaction = createEthTransaction(event, ETH_TX_COLLATERAL_DEPOSITED);

  let collateralDId = buildId(event);
  let entity = new CollateralDeposit(collateralDId);
  entity.loan = loanID;
  entity.transaction = ethTransaction.id;
  entity.borrower = getOrCreateBorrower(borrower).address.toHexString();
  entity.amount = depositAmount;
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
    depositAmount
  );
  loan.save();
}
