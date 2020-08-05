import { log, BigInt } from "@graphprotocol/graph-ts";
import {
  SettingUpdated as SettingUpdatedEvent,
  LendingPoolPaused as LendingPoolPausedEvent,
  LendingPoolUnpaused as LendingPoolUnpausedEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent,
  PauserAdded as PauserAddedEvent,
  PauserRemoved as PauserRemovedEvent,
  AssetSettingsCreated as AssetSettingsCreatedEvent,
  AssetSettingsUpdated as AssetSettingsUpdatedEvent,
} from "../../generated/SettingsInterface/SettingsInterface";

import { getTimestampInMillis } from "../utils/commons";
import {
  ETH_TX_PLATFORM_PAUSER_ADDED,
  ETH_TX_PLATFORM_PAUSER_REMOVED,
} from "../utils/consts";
import {
  creatingLendingPoolPauseChange,
  updateOrCreateLendingPoolPauseStatus,
  internalHandleSettingUpdated,
  createPauserChange,
  updateOrCreatePauserStatus,
} from "../utils/settings-commons";
import { createAssetSettingsChange, getOrCreateAssetSettingsStatus } from "../utils/common-settings";

export function handleSettingUpdated(event: SettingUpdatedEvent): void {
  internalHandleSettingUpdated(
    event.params.oldValue,
    event.params.newValue,
    event.params.sender,
    event.params.settingName.toString(),
    event
  );
}

export function handleLendingPoolPaused(event: LendingPoolPausedEvent): void {
  creatingLendingPoolPauseChange(
    true,
    event.params.lendingPoolAddress,
    event.params.account,
    event
  );

  updateOrCreateLendingPoolPauseStatus(
    true,
    event.params.lendingPoolAddress,
    event.block.number,
    getTimestampInMillis(event)
  );
}

export function handleLendingPoolUnpaused(
  event: LendingPoolUnpausedEvent
): void {
  let id = event.params.lendingPoolAddress.toHexString();
  log.info("Creating new lending pool unpause status with id {}", [id]);

  creatingLendingPoolPauseChange(
    false,
    event.params.lendingPoolAddress,
    event.params.account,
    event
  );

  updateOrCreateLendingPoolPauseStatus(
    false,
    event.params.lendingPoolAddress,
    event.block.number,
    getTimestampInMillis(event)
  );
}
export function handlePaused(event: PausedEvent): void {
  internalHandleSettingUpdated(
    BigInt.fromI32(0),
    BigInt.fromI32(1),
    event.params.account,
    "PausePlatform",
    event
  );
}

export function handleUnpaused(event: UnpausedEvent): void {
  internalHandleSettingUpdated(
    BigInt.fromI32(1),
    BigInt.fromI32(0),
    event.params.account,
    "UnpausePlatform",
    event
  );
}

export function handlePauserAdded(event: PauserAddedEvent): void {
  createPauserChange(
    ETH_TX_PLATFORM_PAUSER_ADDED,
    event.params.account,
    true,
    event
  );
  updateOrCreatePauserStatus(event.params.account, true, event);
}

export function handlePauserRemoved(event: PauserRemovedEvent): void {
  createPauserChange(
    ETH_TX_PLATFORM_PAUSER_REMOVED,
    event.params.account,
    false,
    event
  );
  updateOrCreatePauserStatus(event.params.account, false, event);
}

export function handleAssetSettingsCreated(event: AssetSettingsCreatedEvent): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.lendingToken,
    event.params.cToken,
    event.params.maxLendingAmount,
    event
  )
  getOrCreateAssetSettingsStatus(
    event.params.lendingToken,
    event.params.cToken,
    event.params.maxLendingAmount,
    event
  )
}

export function handleAssetSettingsUpdated(event: AssetSettingsUpdatedEvent): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.lendingToken,
    event.params.cToken,
    event.params.newMaxLendingAmount,
    event
  )
  getOrCreateAssetSettingsStatus(
    event.params.lendingToken,
    event.params.cToken,
    event.params.newMaxLendingAmount,
    event
  )
}
