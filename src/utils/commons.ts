import { log, BigInt, EthereumEvent, Bytes } from '@graphprotocol/graph-ts'
import { Borrower, LendingPoolStatus, EthTransaction } from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

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
  entity.timestamp = event.block.timestamp.times(BigInt.fromI32(1000))
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
  daiPoolAction.save()
}

export function buildId(event:EthereumEvent): string {
  return event.transaction.hash.toHex() + "-" + event.logIndex.toString();
}