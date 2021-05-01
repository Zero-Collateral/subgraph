// - event: LoanTermsSet(indexed uint256, indexed address, indexed address)
// handler: loanTermsSet
// - event: LoanTakenOut(indexed uint256, indexed address, uint256)
// handler: loanTakenOut
// - event: LoanRepaid(indexed uint256, indexed address, uint256, address, uint256)
// handler: loanRepaid
// - event: LoanLiquidated(indexed uint256, indexed address, address, uint256, uint256)
// handler: loanLiquidated
// - event: CollateralDeposited(indexed uint256, indexed address, uint256)
// handler: collateralDeposited
// - event: CollateralWithdrawn(indexed uint256, indexed address, indexed address, uint256)
// handler: collateralWithdrawn
// - event: AssetSettingsCreated(indexed address, indexed bytes32, bytes32, CacheType)
// handler: assetSettingsCreated
// - event: AssetSettingsAddressUpdated(indexed address, indexed bytes32, bytes32, CacheType)
// handler: assetSettingsUpdated
// - event: PlatformSettingCreated(indexed bytes32, indexed address, uint256, uint256, uint256)
// handler: platformSettingCreated
// - event: PlatformSettingUpdated(indexed bytes32, indexed address, uint256, uint256)
// handler: platformSettingUpgraded

import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts';
import {
  AssetSettingsStatus,
  BorrowerNoncesChange,
  Loan,
  LoanTerm,
  PlatformSettingChange,
  PlatformSettingStatus
} from '../generated/schema';
import {
  AssetSettingsCreated,
  AssetSettingsUpdated,
  ITellerDiamond__getLoanResultLoan_Struct,
  LoanLiquidated,
  LoanRepaid,
  LoanTakenOut,
  LoanTermsSet,
  PlatformSettingCreated,
  PlatformSettingUpdated
} from '../generated/TellerDiamond/ITellerDiamond';
import { ITellerDiamond } from '../generated/TellerDiamond/ITellerDiamond';

export function getBorrowerLoans(addy: Address, borrower: Address): BigInt {
  return BigInt.fromI32(
    ITellerDiamond.bind(addy).getBorrowerLoans(borrower).length
  );
}

export function getLoan(
  addy: Address,
  loanID: BigInt
): ITellerDiamond__getLoanResultLoan_Struct {
  let result = ITellerDiamond.bind(addy).getLoan(loanID);
  return result;
}

export function loanTermsSet(event: LoanTermsSet): void {
  let addy = event.address;
  let loanID = event.params.loanID;
  let borrower = event.params.borrower;
  let loan = getLoan(addy, loanID);

  let borrowerLoans = getBorrowerLoans(addy, borrower);
  let nonce = borrowerLoans.minus(BigInt.fromI32(1));

  let borrowerNonceChange = new BorrowerNoncesChange(loanID.toHexString());
  borrowerNonceChange.nonce = nonce;
  borrowerNonceChange.borrower = borrower;
  borrowerNonceChange.timestamp = event.block.timestamp;
  borrowerNonceChange.blockNumber = event.block.number;
  borrowerNonceChange.token = loan.lendingToken.toHexString();
  borrowerNonceChange.collateralToken = loan.collateralToken.toHexString();
  borrowerNonceChange.save();

  let loanTerms = new LoanTerm(loanID.toHexString());
  loanTerms.blockNumber = event.block.number;
  loanTerms.timestamp = event.block.timestamp;
  loanTerms.transaction = event.transaction.hash.toHexString();
  loanTerms.nonce = nonce;
  loanTerms.maxLoanAmount = loan.loanTerms.maxLoanAmount;
  loanTerms.collateralRatio = loan.loanTerms.collateralRatio;
  loanTerms.duration = loan.loanTerms.duration;
  loanTerms.interestRate = loan.loanTerms.interestRate;
  loanTerms.expiryAt = event.block.timestamp.plus(loanTerms.duration);
  loanTerms.save();

  let newLoan = new Loan(loanID.toHexString());
  newLoan.amountBorrowed = loan.borrowedAmount;
  newLoan.blockNumber = event.block.number;
  newLoan.borrower = borrower;
  newLoan.collateralToken = loan.collateralToken.toHexString();
  newLoan.endDate = BigInt.fromI32(0);
  newLoan.recipient = loan.loanTerms.recipient;
  newLoan.startDate = loan.loanStartTime;
  newLoan.status = 'TermsSet';
  newLoan.terms = loanTerms.id;
  newLoan.timestamp = event.block.timestamp;
  newLoan.token = loan.lendingToken.toHexString();
  newLoan.totalOwedAmount = loan.principalOwed.plus(loan.interestOwed);
  newLoan.totalRepaidAmount = BigInt.fromI32(0);
  newLoan.nft = false;
  newLoan.transaction = event.transaction.hash.toHexString();
  newLoan.save();
}
export function loanTakenOut(event: LoanTakenOut): void {
  let addy = event.address;
  let loanID = event.params.loanID;
  let amountBorrowed = event.params.amountBorrowed;
  let loan = getLoan(addy, loanID);

  let oldLoan = Loan.load(loanID.toHexString());
  if (oldLoan) {
    oldLoan.nft = event.params.withNFT;
    oldLoan.status = 'Active';
    oldLoan.amountBorrowed = amountBorrowed;
    oldLoan.save();
  }
}
export function loanRepaid(event: LoanRepaid): void {
  let addy = event.address;
  let loanID = event.params.loanID;
  let amountPaid = event.params.amountPaid;
  let loan = getLoan(addy, loanID);

  let oldLoan = Loan.load(loanID.toHexString());
  if (oldLoan) {
    if (loan !== null && loan.status == 3) oldLoan.status = 'Closed';
    oldLoan.totalOwedAmount = oldLoan.totalOwedAmount.minus(amountPaid);
    oldLoan.totalRepaidAmount = oldLoan.totalRepaidAmount.plus(amountPaid);
    oldLoan.save();
  }
}
export function loanLiquidated(event: LoanLiquidated): void {
  let addy = event.address;
  let loanID = event.params.loanID;
  // let loan = getLoan(addy, loanID)

  let oldLoan = Loan.load(loanID.toHexString());
  if (oldLoan) {
    oldLoan.status = 'Closed';
    oldLoan.save();
  }
}

export function assetSettingsCreated(event: AssetSettingsCreated): void {
  let asset = event.params.asset;
  let key = event.params.key;
  let value = event.params.value;
  let assetSettings =
    AssetSettingsStatus.load(asset.toHexString()) ||
    new AssetSettingsStatus(asset.toHexString());
  assetSettings.tokenAddress = asset;
  if (
    key ==
    Bytes.fromHexString(
      '0xf525bf48e9856fe8ffe40794a6793d36612641c2549eb536845518cf7ffcb992'
    )
  ) {
    assetSettings.maxLoanAmount = BigInt.fromUnsignedBytes(value);
    assetSettings.blockNumber = event.block.number;
    assetSettings.timestamp = event.block.timestamp;
    assetSettings.save();
    return;
  }
}
export function assetSettingsUpdated(event: AssetSettingsUpdated): void {
  let asset = event.params.asset;
  let key = event.params.key;
  let value = event.params.value;
  let assetSettings = AssetSettingsStatus.load(asset.toHexString())!;
  if (
    key ==
    Bytes.fromHexString(
      '0xf525bf48e9856fe8ffe40794a6793d36612641c2549eb536845518cf7ffcb992'
    )
  ) {
    assetSettings.maxLoanAmount = BigInt.fromUnsignedBytes(value);
    assetSettings.blockNumber = event.block.number;
    assetSettings.timestamp = event.block.timestamp;
    assetSettings.save();
    return;
  }
}

export function platformSettingCreated(event: PlatformSettingCreated): void {
  let settingName = event.params.settingName;
  let minValue = event.params.minValue;
  let maxValue = event.params.maxValue;
  let value = event.params.value;
  let platformSettingStatus = new PlatformSettingStatus(
    settingName.toHexString()
  );
  platformSettingStatus.settingName = settingName.toHexString();
  platformSettingStatus.max = maxValue;
  platformSettingStatus.min = minValue;
  platformSettingStatus.value = value;
  platformSettingStatus.timestamp = event.block.timestamp;
  platformSettingStatus.blockNumber = event.block.number;
  platformSettingStatus.save();

  let platformSettingChange = new PlatformSettingChange(
    `${settingName.toHexString()}-${event.transaction.hash.toHexString()}`
  );
  platformSettingChange.transaction = event.transaction.hash.toHexString();
  platformSettingChange.timestamp = event.block.timestamp;
  platformSettingChange.blockNumber = event.block.number;
  platformSettingChange.from = event.transaction.from;
  platformSettingChange.settingName = settingName.toHexString();
  platformSettingChange.oldValue = BigInt.fromI32(0);
  platformSettingChange.newValue = value;
  platformSettingChange.save();
}
export function platformSettingUpdated(event: PlatformSettingUpdated): void {
  let settingName = event.params.settingName;
  let newValue = event.params.newValue;
  let oldValue = event.params.oldValue;
  let platformSettingStatus = PlatformSettingStatus.load(
    settingName.toHexString()
  )!;
  platformSettingStatus.settingName = settingName.toHexString();
  platformSettingStatus.value = newValue;
  platformSettingStatus.timestamp = event.block.timestamp;
  platformSettingStatus.blockNumber = event.block.number;
  platformSettingStatus.save();

  let platformSettingChange = new PlatformSettingChange(
    `${settingName.toHexString()}-${event.transaction.hash.toHexString()}`
  );
  platformSettingChange.transaction = event.transaction.hash.toHexString();
  platformSettingChange.timestamp = event.block.timestamp;
  platformSettingChange.blockNumber = event.block.number;
  platformSettingChange.from = event.transaction.from;
  platformSettingChange.settingName = settingName.toHexString();
  platformSettingChange.oldValue = oldValue;
  platformSettingChange.newValue = newValue;
  platformSettingChange.save();
}
