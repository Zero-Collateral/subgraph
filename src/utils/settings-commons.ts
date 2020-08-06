import { log, BigInt, ethereum, Bytes } from "@graphprotocol/graph-ts";
import {
  LendingPoolPauseStatus,
  LendingPoolPauseChange,
  PlatformSettingsStatus,
  PlatformSettingsChange,
  PauserChange,
  PauserStatus,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import {
  ETH_TX_LENDING_POOL_PAUSED,
  ETH_TX_LENDING_POOL_UNPAUSED,
} from "./consts";
import { createEthTransaction, getTimestampInMillis, buildId } from "./commons";

export function updateOrCreateLendingPoolPauseStatus(
  paused: boolean,
  lendingPool: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  let id = lendingPool.toHexString();
  log.info("Getting or creating a lending pool pause status with id {}", [id]);
  let pauseEntity = LendingPoolPauseStatus.load(id);
  if (pauseEntity == null) {
    pauseEntity = new LendingPoolPauseStatus(id);
    pauseEntity.paused = paused;
  }
  pauseEntity.lendingPool = lendingPool;
  pauseEntity.blockNumber = blockNumber;
  pauseEntity.timestamp = timestamp;
  pauseEntity.save();
}

export function creatingLendingPoolPauseChange(
  paused: boolean,
  lendingPoolAddress: Address,
  account: Address,
  event: ethereum.Event
): LendingPoolPauseChange {
  let id = buildId(event);
  log.info("Creating new lending pool pause change with id {}", [id]);
  let transactionType = paused
    ? ETH_TX_LENDING_POOL_PAUSED
    : ETH_TX_LENDING_POOL_UNPAUSED;
  let ethTransaction = createEthTransaction(event, transactionType);
  let entity = new LendingPoolPauseChange(id);
  entity.transaction = ethTransaction.id;
  entity.paused = paused;
  entity.lendingPool = lendingPoolAddress;
  entity.from = account;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createPlatformSettingChange(
  oldValue: BigInt,
  newValue: BigInt,
  from: Address,
  settingName: string,
  transactionName: string,
  event: ethereum.Event
): PlatformSettingsChange {
  let id = buildId(event);
  log.info("Creating new platform setting change with id {}", [id]);
  let ethTransaction = createEthTransaction(event, transactionName);
  let entity = new PlatformSettingsChange(id);
  entity.transaction = ethTransaction.id;
  entity.oldValue = oldValue;
  entity.newValue = newValue;
  entity.from = from;
  entity.settingName = settingName.toString();
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function createPauserChange(
  transactionType: string,
  account: Address,
  active: boolean,
  event: ethereum.Event
): PauserChange {
  let id = buildId(event);
  log.info("Creating new setting change with id {}", [id]);
  let ethTransaction = createEthTransaction(event, transactionType);
  let entity = new PauserChange(id);
  entity.transaction = ethTransaction.id;
  entity.account = account;
  entity.active = active;
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
  return entity;
}

export function updateOrCreatePauserStatus(
  account: Address,
  active: boolean,
  event: ethereum.Event
): void {
  let id = account.toHexString();
  log.info("Getting or creating a pauser status with id {}", [id]);
  let pauseEntity = PauserStatus.load(id);
  if (pauseEntity == null) {
    pauseEntity = new PauserStatus(id);
  }
  pauseEntity.account = account;
  pauseEntity.active = active;
  pauseEntity.blockNumber = event.block.number;
  pauseEntity.timestamp = getTimestampInMillis(event);
  pauseEntity.save();
}

export function updateOrCreatePlatformSettingsStatus(
  settingName: string,
  minValue: BigInt,
  maxValue: BigInt,
  removed: boolean,
  value: BigInt,
  event: ethereum.Event
): void {
  log.info("Update or create new platform setting status for {}", [settingName]);

  log.info("Getting or creating a setting status with id {}", [settingName]);
  let entity = PlatformSettingsStatus.load(settingName);
  if (entity == null) {
    entity = new PlatformSettingsStatus(settingName);
    entity.settingName = settingName.toString();
    entity.min = minValue
    entity.max = maxValue
  }
  entity.removed = removed
  entity.value = value
  entity.blockNumber = event.block.number;
  entity.timestamp = getTimestampInMillis(event);
  entity.save();
}
