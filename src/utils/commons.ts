import { log, BigInt, EthereumEvent, Bytes } from "@graphprotocol/graph-ts";
import {
  Borrower,
  EthTransaction,
  ZTokenChange,
  ZTokenStatus,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import {
  EMPTY_ADDRESS_STRING,
} from "./consts";
import { Transfer as TransferEvent,  } from "../../generated/ZDAIToken/ZToken";

export function getTimestampInMillis(event: EthereumEvent): BigInt {
  return event.block.timestamp.times(BigInt.fromI32(1000));
}

export function getTimeInMillis(time: BigInt): BigInt {
  return time.times(BigInt.fromI32(1000));
}

export function createEthTransaction(
  event: EthereumEvent,
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

export function buildLoanIdBigInt(token: string, loanID: BigInt): string {
  return buildLoanId(token, loanID.toString());
}

export function buildLoanId(token: string, loanID: string): string {
  return token + "-" + loanID;
}

export function buildId(event: EthereumEvent): string {
  return event.transaction.hash.toHex() + "-" + event.logIndex.toString();
}

export function buildSignerId(token: string, contract: string, account: Address): string {
  return token + "-" + contract + "-" + account.toHexString();
}

export function createZTokenChange(
  id: string,
  amount: BigInt,
  zToken: string,
  from: Address,
  to: Address,
  action: string,
  ethTransaction: EthTransaction
): void {
  let entity = new ZTokenChange(id);
  entity.transaction = ethTransaction.id;
  entity.amount = amount;
  entity.zToken = zToken;
  entity.from = from;
  entity.to = to;
  entity.action = action;
  entity.blockNumber = ethTransaction.blockNumber;
  entity.timestamp = ethTransaction.timestamp;
  entity.save();
}

export function getOrCreateZTokenStatus(holder: Address): ZTokenStatus {
  let id = holder.toHexString();
  log.info("Loading ztoken status for holder {}", [id]);
  let entity = ZTokenStatus.load(id);
  if (entity == null) {
    log.info("Creating new ztoken status for holder {}", [id]);
    entity = new ZTokenStatus(id);
    entity.amount = BigInt.fromI32(0);
    entity.account = holder;
    entity.blockNumber = BigInt.fromI32(0);
    entity.updatedAt = BigInt.fromI32(0);
  }
  return entity as ZTokenStatus;
}

export function updateZTokenBalancesFor(
  zToken: string,
  event: TransferEvent
): void {
  log.info("Updating ZToken balance for holders {} / {} ", [
    event.params.from.toHexString(),
    event.params.to.toHexString(),
  ]);
  if (event.params.from.toHexString() != EMPTY_ADDRESS_STRING) {
    let fromEntity = getOrCreateZTokenStatus(event.params.from);
    log.info(
      "Updating ZToken balance for holder {} (from). Current balance {} {}",
      [event.params.from.toHexString(), fromEntity.amount.toString(), zToken]
    );
    fromEntity.amount = fromEntity.amount.minus(event.params.value);
    fromEntity.zToken = zToken;
    fromEntity.blockNumber = event.block.number;
    fromEntity.updatedAt = getTimestampInMillis(event);
    fromEntity.save();
  }
  if (event.params.to.toHexString() != EMPTY_ADDRESS_STRING) {
    let toEntity = getOrCreateZTokenStatus(event.params.to);
    log.info(
      "Updating ZToken balance for holder {} (to). Current balance {} {}",
      [event.params.to.toHexString(), toEntity.amount.toString(), zToken]
    );
    toEntity.amount = toEntity.amount.plus(event.params.value);
    toEntity.zToken = zToken;
    toEntity.blockNumber = event.block.number;
    toEntity.updatedAt = getTimestampInMillis(event);
    toEntity.save();
  }
}
