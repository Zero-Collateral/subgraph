import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts";
import { buildId, createEthTransaction, getTimestampInMillis } from "./commons";
import {
  ETH_TX_ACCRUED_INTEREST_WITHDRAWN,
  ETH_TX_ACCRUED_INTEREST_UPDATED,
} from "./consts";
import {
  AccruedInterestWithdrawalChange,
  AccruedInterestChange,
} from "../../generated/schema";

export function internalHandleAccruedInterestWithdrawn(
    token: string,
    recipient: Address,
    amount: BigInt,
    event: ethereum.Event
): void {
  let id = buildId(event);
  log.info("Creating new accrued interest withdrawn id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_ACCRUED_INTEREST_WITHDRAWN
  );
  let entity = new AccruedInterestWithdrawalChange(id);
  entity.transaction = ethTransaction.id;
  entity.token = token
  entity.recipient = recipient;
  entity.amount = amount;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
}

export function internalHandleAccruedInterestUpdated(
    token: string,
    lender: Address,
    totalNotWithdrawn: BigInt,
    totalAccruedInterest: BigInt,
    event: ethereum.Event
): void {
  let id = buildId(event);
  log.info("Creating new accrued interest updated with id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_ACCRUED_INTEREST_UPDATED
  );
  let entity = new AccruedInterestChange(id);
  entity.transaction = ethTransaction.id;
  entity.token = token
  entity.lender = lender;
  entity.totalNotWithdrawn = totalNotWithdrawn;
  entity.totalAccruedInterest = totalAccruedInterest;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
}
