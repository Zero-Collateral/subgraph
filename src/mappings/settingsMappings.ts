import { log } from "@graphprotocol/graph-ts";
import {
  SettingUpdated as SettingUpdatedEvent,
  LendingPoolPaused as LendingPoolPausedEvent,
  LendingPoolUnpaused as LendingPoolUnpausedEvent,
} from "../../generated/SettingsInterface/SettingsInterface";
import {
  Setting,
  SettingsStatus,
  LendingPoolPauseStatus,
} from "../../generated/schema";
import { createEthTransaction, buildId, getTimestampInMillis, updateOrCreateLendingPoolPause } from "../utils/commons";
import {
  ETH_TX_SETTINGS_UPDATED,
  ETH_TX_LENDING_POOL_PAUSED,
  ETH_TX_LENDING_POOL_UNPAUSED,
} from "../utils/consts";

export function handleSettingUpdated(
  event: SettingUpdatedEvent
): void {
  let id = buildId(event);
  log.info("Creating new settings status with id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_SETTINGS_UPDATED
  )
  let entity = new SettingsStatus(id)
  entity.transaction = ethTransaction.id;
  entity.oldValue = event.params.oldValue
  entity.newValue = event.params.newValue
  entity.from = event.params.sender
  entity.settingName = event.params.settingName.toString()
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()

  let settingsId = event.params.settingName.toString()
  let settingsEntity = Setting.load(settingsId)
  if (settingsEntity == null) {
    settingsEntity = new Setting(settingsId);
    settingsEntity.settingName = event.params.settingName.toString()
  }
  settingsEntity.value = event.params.newValue
  settingsEntity.lastBlockNumber = event.block.number
  settingsEntity.lastTimestamp = getTimestampInMillis(event)
  settingsEntity.save()
}

export function handleLendingPoolPaused(
  event: LendingPoolPausedEvent
): void {
  let id = event.params.lendingPoolAddress.toHexString();
  log.info("Creating new lending pool pause status with id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_LENDING_POOL_PAUSED
  )
  let entity = new LendingPoolPauseStatus(id)
  entity.transaction = ethTransaction.id
  entity.paused = true
  entity.lendingPool = event.params.lendingPoolAddress
  entity.from = event.params.account
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()

  updateOrCreateLendingPoolPause(
    id,
    true,
    event.params.lendingPoolAddress,
    event.block.number,
    getTimestampInMillis(event),
  )
}

export function handleLendingPoolUnpaused(
  event: LendingPoolUnpausedEvent
): void {
  let id = event.params.lendingPoolAddress.toHexString();
  log.info("Creating new lending pool unpause status with id {}", [id]);
  let ethTransaction = createEthTransaction(
    event,
    ETH_TX_LENDING_POOL_UNPAUSED
  )
  let entity = new LendingPoolPauseStatus(id)
  entity.transaction = ethTransaction.id
  entity.paused = false
  entity.lendingPool = event.params.lendingPoolAddress
  entity.from = event.params.account
  entity.blockNumber = event.block.number
  entity.timestamp = getTimestampInMillis(event)
  entity.save()

  updateOrCreateLendingPoolPause(
    id,
    false,
    event.params.lendingPoolAddress,
    event.block.number,
    getTimestampInMillis(event),
  )
}