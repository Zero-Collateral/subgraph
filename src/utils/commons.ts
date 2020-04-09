import { log, BigInt } from '@graphprotocol/graph-ts'
import { Borrower, DaiPoolAction } from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";

export function getOrCreateBorrower (address:Address): Borrower {
    let borrower = Borrower.load(address.toHexString())
    if (borrower == null){
      borrower = new Borrower(address.toHexString())
      borrower.address = address
      borrower.loans = [];
      borrower.save()
    }
    return borrower as Borrower;
}

export function createDaiPoolAction (id:string, action:string, address:Address, amount:BigInt): void {
  log.info("Creating DAI pool action {} for address / amount {} / {}", [action, address.toHexString(), amount.toString()])
  let daiPoolAction = new DaiPoolAction(id)
  daiPoolAction.action = action
  daiPoolAction.address = address
  daiPoolAction.amount = amount
  daiPoolAction.save()
}