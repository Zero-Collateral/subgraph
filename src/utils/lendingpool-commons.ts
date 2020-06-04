import { log, BigInt, ethereum } from "@graphprotocol/graph-ts";
import {
  LendingPoolChange,
  EthTransaction,
  LendingPoolStatus,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import { buildId, createEthTransaction } from "./commons";
import { LENDING_POOL_DEPOSITED, LENDING_POOL_REPAID, LENDING_POOL_WITHDRAWN, LENDING_POOL_LIQUIDATED, LENDING_POOL_INTEREST_WITHDRAWN } from "./consts";

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

export function updateOrCreateLendingPoolStatus(
  zToken: string,
  lendingToken: string,
  sum: boolean,
  amount: BigInt,
  transaction: EthTransaction
): void {
  log.info(
    "Getting/Creating lending pool supply status for {} / {}",
    [
      zToken,
      lendingToken,
    ]
  );
  let id = zToken + "-" + lendingToken;
  let entity = LendingPoolStatus.load(id)
  if(entity == null) {
    entity = new LendingPoolStatus(id)
    entity.zToken = zToken
    entity.lendingToken = lendingToken
    entity.amount = BigInt.fromI32(0)
  }
  if(sum) {
    entity.amount = entity.amount.plus(amount)
  } else {
    entity.amount = entity.amount.minus(amount)
  }
  entity.blockNumber = transaction.blockNumber;
  entity.timestamp = transaction.timestamp;
  entity.save();
}

export function getActionsMap():Map<string, boolean> {
  let actionsMap = new Map<string, boolean>();
  actionsMap.set(LENDING_POOL_DEPOSITED, true);
  actionsMap.set(LENDING_POOL_REPAID, true);
  actionsMap.set(LENDING_POOL_WITHDRAWN, false);
  actionsMap.set(LENDING_POOL_LIQUIDATED, false);
  actionsMap.set(LENDING_POOL_INTEREST_WITHDRAWN, false);
  return actionsMap;
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
  let actionsMap = getActionsMap();

  updateOrCreateLendingPoolStatus(
    zToken,
    token,
    actionsMap.get(action),
    amount,
    ethTransaction
  )
}