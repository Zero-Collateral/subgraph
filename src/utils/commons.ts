import { log, BigInt, EthereumEvent, Bytes } from '@graphprotocol/graph-ts'
import { Borrower, DaiPoolAction, EthTransaction } from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

export function createEthTransaction (event:EthereumEvent, action:string): EthTransaction {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  log.info("Creating EthTransaction with id {}", [id])
  let entity = new EthTransaction(id)
  entity.event = action
  entity.from = event.transaction.from
  entity.gasPrice = event.transaction.gasPrice
  entity.gasUsed = event.transaction.gasUsed
  entity.hash = event.transaction.hash
  entity.index = event.transaction.index
  entity.to = event.transaction.to as Bytes
  entity.value = event.transaction.value
  entity.contract = event.address
  entity.timestamp = event.block.timestamp.times(BigInt.fromI32(1000))
  entity.gasLimit = event.block.gasLimit
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

export function createDaiPoolAction (id:string, action:string, address:Address, amount:BigInt, transaction:EthTransaction): void {
  log.info("Creating DAI pool action {} for address / amount {} / {}", [action.toString(), address.toHexString(), amount.toString()])
  let daiPoolAction = new DaiPoolAction(id)
  daiPoolAction.action = action
  daiPoolAction.address = address
  daiPoolAction.amount = amount
  daiPoolAction.transaction = transaction.id
  daiPoolAction.save()
}