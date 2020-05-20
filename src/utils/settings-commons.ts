import { log, BigInt, EthereumEvent, Bytes } from "@graphprotocol/graph-ts";
import {
  LendingPoolPauseStatus,
  LendingPoolPauseChange,
  SettingsStatus,
  SettingsChange,
  PauserChange,
  PauserStatus,
} from "../../generated/schema";
import { Address } from "@graphprotocol/graph-ts";
import {
  ETH_TX_LENDING_POOL_PAUSED,
  ETH_TX_LENDING_POOL_UNPAUSED,
  ETH_TX_SETTING_UPDATED,
} from "./consts";
import { createEthTransaction, getTimestampInMillis, buildId } from "./commons";

export function updateOrCreateLendingPoolPauseStatus(
  id: string,
  paused: boolean,
  lendingPool: Bytes,
  blockNumber: BigInt,
  timestamp: BigInt
): void {
  log.info("Getting or creating a lending pool pause status with id {}", [id]);
  let pauseEntity = LendingPoolPauseStatus.load(id);
  if (pauseEntity == null) {
    pauseEntity = new LendingPoolPauseStatus(id);
    pauseEntity.paused = paused;
  }
  pauseEntity.lendingPool = lendingPool;
  pauseEntity.lastBlockNumber = blockNumber;
  pauseEntity.lastTimestamp = timestamp;
  pauseEntity.save();
}

export function creatingLendingPoolPauseChange(
  paused: boolean,
  lendingPoolAddress: Address,
  account: Address,
  event: EthereumEvent
): LendingPoolPauseChange {
  let id = lendingPoolAddress.toHexString();
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

export function createSettingChange(
  oldValue: BigInt,
  newValue: BigInt,
  from: Address,
  settingName: string,
  event: EthereumEvent
): SettingsChange {
  let id = buildId(event);
  log.info("Creating new setting change with id {}", [id]);
  let ethTransaction = createEthTransaction(event, ETH_TX_SETTING_UPDATED);
  let entity = new SettingsChange(id);
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
  event: EthereumEvent
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
  event: EthereumEvent
): void {
  let id = account.toHexString();
  log.info("Getting or creating a pauser status with id {}", [id]);
  let pauseEntity = PauserStatus.load(id);
  if (pauseEntity == null) {
    pauseEntity = new PauserStatus(id);
  }
  pauseEntity.account = account;
  pauseEntity.active = active;
  pauseEntity.lastBlockNumber = event.block.number;
  pauseEntity.lastTimestamp = getTimestampInMillis(event);
  pauseEntity.save();
}

export function internalHandleSettingUpdated(
  oldValue: BigInt,
  newValue: BigInt,
  from: Address,
  settingName: string,
  event: EthereumEvent
): void {
  let id = buildId(event);
  log.info("Creating new setting change with id {}", [id]);

  let entity = createSettingChange(
    oldValue,
    newValue,
    from,
    settingName.toString(),
    event
  );

  let settingsId = entity.settingName;
  log.info("Getting or creating a setting status with id {}", [settingsId]);
  let settingsEntity = SettingsStatus.load(settingsId);
  if (settingsEntity == null) {
    settingsEntity = new SettingsStatus(settingsId);
    settingsEntity.settingName = settingName.toString();
  }
  settingsEntity.value = newValue;
  settingsEntity.lastBlockNumber = event.block.number;
  settingsEntity.lastTimestamp = getTimestampInMillis(event);
  settingsEntity.save();
}
