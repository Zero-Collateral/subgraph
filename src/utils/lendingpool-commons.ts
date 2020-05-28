import { log, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  LendingPoolChange,
  EthTransaction,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import { buildId, createEthTransaction } from "./commons";

export function createLendingPoolChange(
  id: string,
  zToken: string,
  lendingToken: string,
  action: string,
  address: Address,
  amount: BigInt,
  transaction: EthTransaction
): void {
  log.info(
    "Creating lending pool change {} ({}/{}) for address / amount {} / {}",
    [
      action.toString(),
      zToken,
      lendingToken,
      address.toHexString(),
      amount.toString(),
    ]
  );
  let daiPoolAction = new LendingPoolChange(id);
  daiPoolAction.zToken = zToken;
  daiPoolAction.lendingToken = lendingToken;
  daiPoolAction.action = action;
  daiPoolAction.address = address;
  daiPoolAction.amount = amount;
  daiPoolAction.transaction = transaction.id;
  daiPoolAction.blockNumber = transaction.blockNumber;
  daiPoolAction.timestamp = transaction.timestamp;
  daiPoolAction.save();
}

export function internalHandleLendingPoolChange(
  transactionType: string,
  zToken: string,
  token: string,
  action: string,
  account: Address,
  amount: BigInt,
  event: ethereum.Event
): void {
  let id = buildId(event)
  let ethTransaction = createEthTransaction(event, transactionType)

  createLendingPoolChange(
    id,
    zToken,
    token,
    action,
    account,
    amount,
    ethTransaction
  )
}