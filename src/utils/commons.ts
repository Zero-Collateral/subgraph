import { log, BigInt, ethereum, Bytes } from "@graphprotocol/graph-ts";
import {
  Borrower,
  EthTransaction,
  TTokenHolderActionsChange,
  TTokenHolderBalancesStatus,
  TTokenTotalValuesStatus,
  TTokenHolderBalancesChange,
  TTokenTotalValuesChange,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import {
  EMPTY_ADDRESS_STRING,
} from "./consts";

export function getTimestampInMillis(event: ethereum.Event): BigInt {
  return event.block.timestamp.times(BigInt.fromI32(1000));
}

export function getTimeInMillis(time: BigInt): BigInt {
  return time.times(BigInt.fromI32(1000));
}

export function createEthTransaction(
  event: ethereum.Event,
  action: string
): EthTransaction {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  log.info("Creating EthTransaction with id {}", [id]);
  let entity = new EthTransaction(id);
  entity.event = action;
  entity.from = event.transaction.from;
  entity.gasPrice = event.transaction.gasPrice;
  entity.gasSent = event.transaction.gasUsed;
  entity.hash = event.transaction.hash;
  entity.index = event.transaction.index;
  entity.to = event.transaction.to as Bytes;
  entity.value = event.transaction.value;
  entity.contract = event.address;
  entity.timestamp = getTimestampInMillis(event);
  entity.gasLimit = event.block.gasLimit;
  entity.blockNumber = event.block.number;
  entity.save();
  return entity;
}

export function getOrCreateBorrower(address: Address): Borrower {
  log.info("Trying to load borrower by address {}", [address.toHexString()]);
  let borrower = Borrower.load(address.toHexString());
  if (borrower == null) {
    log.info("Creating borrower with address {}", [address.toHexString()]);
    borrower = new Borrower(address.toHexString());
    borrower.address = address;
    borrower.loans = [];
    borrower.save();
  }
  return borrower as Borrower;
}

export function buildLoanIdBigInt(token: string, collateralToken: string, loanID: BigInt): string {
  return buildLoanId(token, collateralToken, loanID.toString());
}

export function buildLoanId(token: string, collateralToken: string, loanID: string): string {
  return token + "-" + collateralToken + "-" + loanID;
}

export function buildId(event: ethereum.Event): string {
  return event.transaction.hash.toHex() + "-" + event.logIndex.toString();
}

export function buildBlockId(block: ethereum.Block): string {
  return block.hash.toHex() + "-" + block.number.toString() + "-" + block.timestamp.toString();
}

export function buildSignerId(token: string, contract: string, account: Address): string {
  return token + "-" + contract + "-" + account.toHexString();
}

export function createTTokenHolderBalancesChange(
  amount: BigInt,
  balance: BigInt,
  tokenName: string,
  token: Address,
  holder: Address,
  ethTransaction: EthTransaction
): void {
  let id = ethTransaction.id;
  let entity = new TTokenHolderBalancesChange(id);
  entity.transaction = ethTransaction.id;
  entity.amount = amount;
  entity.balance = balance;
  entity.tokenName = tokenName;
  entity.token = token;
  entity.holder = holder;
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();
}

export function processTTokenHolderBalancesChangeFor(
  token: Address,
  tokenName: string,
  from: Address,
  value: BigInt,
  to: Address,
  balanceOfFrom: BigInt,
  balanceOfTo: BigInt,
  ethTransaction: EthTransaction,
): void {
  if (to.toHexString() != EMPTY_ADDRESS_STRING) {
    createTTokenHolderBalancesChange(
      value,
      balanceOfTo,
      tokenName,
      token,
      to,
      ethTransaction,
    );
  }
  if (from.toHexString() != EMPTY_ADDRESS_STRING) {
    createTTokenHolderBalancesChange(
      value.times(BigInt.fromI32(-1)),
      balanceOfFrom,
      tokenName,
      token,
      from,
      ethTransaction,
    );
  }
}

export function createTTokenHolderActionsChange(
  id: string,
  amount: BigInt,
  platformToken: string,
  from: Address,
  to: Address,
  action: string,
  ethTransaction: EthTransaction
): void {
  let entity = new TTokenHolderActionsChange(id);
  entity.transaction = ethTransaction.id;
  entity.amount = amount;
  entity.platformToken = platformToken;
  entity.from = from;
  entity.to = to;
  entity.action = action;
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();
}

export function getOrCreateTTokenHolderBalancesStatus(platformToken: string, holder: Address): TTokenHolderBalancesStatus {
  let id = platformToken + "_" + holder.toHexString()
  log.info("Loading tToken {} balance status for holder {}", [platformToken, holder.toHexString()])
  let entity = TTokenHolderBalancesStatus.load(id)
  if (entity == null) {
    log.info("Creating new tToken {} balances status for holder {}", [platformToken, holder.toHexString()])
    entity = new TTokenHolderBalancesStatus(id)
    entity.balance = BigInt.fromI32(0)
    entity.holder = holder
    entity.platformToken = platformToken
    entity.blockNumber = BigInt.fromI32(0)
    entity.updatedAt = BigInt.fromI32(0)
  }
  return entity as TTokenHolderBalancesStatus;
}

export function updateTTokenHolderBalancesFor(
  token: Address,
  tokenName: string,
  from: Address,
  value: BigInt,
  to: Address,
  balanceOfFrom: BigInt,
  balanceOfTo: BigInt,
  event: ethereum.Event,
  ethTransaction: EthTransaction,
): void {
  log.info("Updating tToken balance for holders {} / {} ", [
    from.toHexString(),
    to.toHexString(),
  ]);
  // Processing TToken Holder Balance Changes
  processTTokenHolderBalancesChangeFor(
    token,
    tokenName,
    from,
    value,
    to,
    balanceOfFrom,
    balanceOfTo,
    ethTransaction,
  );
  if (from.toHexString() != EMPTY_ADDRESS_STRING) {
    // Update Holder Balances Status
    let fromEntity = getOrCreateTTokenHolderBalancesStatus(tokenName, from);
    log.info(
      "Updating tToken balance for holder {} (from). Current balance {} {}",
      [from.toHexString(), fromEntity.balance.toString(), tokenName]
    );
    fromEntity.balance = fromEntity.balance.minus(value);
    fromEntity.blockNumber = event.block.number;
    fromEntity.updatedAt = getTimestampInMillis(event);
    fromEntity.save();
  }
  if (to.toHexString() != EMPTY_ADDRESS_STRING) {
    let toEntity = getOrCreateTTokenHolderBalancesStatus(tokenName, to);
    log.info(
      "Updating tToken balance for holder {} (to). Current balance {} {}",
      [to.toHexString(), toEntity.balance.toString(), tokenName]
    );
    toEntity.balance = toEntity.balance.plus(value);
    toEntity.blockNumber = event.block.number;
    toEntity.updatedAt = getTimestampInMillis(event);
    toEntity.save();
  }
}

export function getOrCreateTTokenTotalValuesStatusFor(tToken: Address, ethTransaction: EthTransaction): TTokenTotalValuesStatus {
  let id = tToken.toHexString();
  let entity = TTokenTotalValuesStatus.load(id);
  if (entity == null) {
    entity = new TTokenTotalValuesStatus(id);
    entity.ttoken = tToken;
    entity.totalSupply = BigInt.fromI32(0);
    entity.totalLent = BigInt.fromI32(0);
    entity.totalRepaid = BigInt.fromI32(0);
    entity.blockNumber = ethTransaction.blockNumber;
    entity.timestamp = ethTransaction.timestamp;
    entity.save();
  }
  return entity as TTokenTotalValuesStatus;
}

export function updateTTokenTotalSupplyFor(
  tToken: Address,
  from: Address,
  to: Address,
  amount: BigInt,
  ethTransaction: EthTransaction,
): TTokenTotalValuesStatus {
  let entity = getOrCreateTTokenTotalValuesStatusFor(tToken, ethTransaction);
  let isMinting = from.toHexString() == EMPTY_ADDRESS_STRING
  let isBurning = to.toHexString() == EMPTY_ADDRESS_STRING
  if (isBurning && isMinting) {
    // TODO Once the Alert entities, add a new alert. Both addresses 'from' and 'to' are empty.
  }
  if (isMinting) {
    entity.totalSupply = entity.totalSupply.plus(amount);
  }
  if (isBurning) {
    entity.totalSupply = entity.totalSupply.minus(amount);
  }
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();

  createTTokenTotalValuesChange(
    ethTransaction,
    ethTransaction.from as Address,
    tToken,
    entity.totalSupply,
    entity.totalLent,
    entity.totalRepaid,
  )
  return entity as TTokenTotalValuesStatus
}

export function updateTTokenTotalLentFor(
  tToken: Address,
  amount: BigInt,
  ethTransaction: EthTransaction,
): TTokenTotalValuesStatus {
  let entity = getOrCreateTTokenTotalValuesStatusFor(tToken, ethTransaction);
  log.info("Updating ttoken {} total lent with amount {} ({})", [tToken.toHexString(), amount.toString(), ethTransaction.event])
  entity.totalLent = entity.totalLent.plus(amount);
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();

  createTTokenTotalValuesChange(
    ethTransaction,
    ethTransaction.from as Address,
    tToken,
    entity.totalSupply,
    entity.totalLent,
    entity.totalRepaid,
  )
  return entity as TTokenTotalValuesStatus
}

export function updateTTokenTotalRepaidFor(
  tToken: Address,
  amount: BigInt,
  ethTransaction: EthTransaction,
): TTokenTotalValuesStatus {
  let entity = getOrCreateTTokenTotalValuesStatusFor(tToken, ethTransaction);
  log.info("Updating ttoken {} total repaid with amount {} ({})", [tToken.toHexString(), amount.toString(), ethTransaction.event])
  entity.totalRepaid = entity.totalRepaid.plus(amount);
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();
  createTTokenTotalValuesChange(
    ethTransaction,
    ethTransaction.from as Address,
    tToken,
    entity.totalSupply,
    entity.totalLent,
    entity.totalRepaid,
  )
  return entity as TTokenTotalValuesStatus
}

export function createTTokenTotalValuesChange(
  ethTransaction: EthTransaction,
  sender: Address,
  ttoken: Address,
  totalSupply: BigInt,
  totalLent: BigInt,
  totalRepaid: BigInt,
): TTokenTotalValuesChange {
  let id = ethTransaction.id;
  let entity = new TTokenTotalValuesChange(id);
  
  entity.transaction = ethTransaction.id;
  entity.sender = sender;
  entity.ttoken = ttoken;
  entity.totalSupply = totalSupply;
  entity.totalLent = totalLent;
  entity.totalRepaid = totalRepaid;
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();
  return entity;
}

