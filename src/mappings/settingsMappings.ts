import { log, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  PlatformSettingCreated as PlatformSettingCreatedEvent,
  PlatformSettingRemoved as PlatformSettingRemovedEvent,
  PlatformSettingUpdated as PlatformSettingUpdatedEvent,
  LendingPoolPaused as LendingPoolPausedEvent,
  LendingPoolUnpaused as LendingPoolUnpausedEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent,
  PauserAdded as PauserAddedEvent,
  PauserRemoved as PauserRemovedEvent,
} from "../../generated/SettingsInterface/SettingsInterface";

import { getTimestampInMillis } from "../utils/commons";
import {
  ETH_TX_PLATFORM_PAUSER_ADDED,
  ETH_TX_PLATFORM_PAUSER_REMOVED,
  ASSET_SETTINGS_CTOKEN_ADDRESS,
  ASSET_SETTINGS_MAX_LOAN_AMOUNT,
  ASSET_SETTINGS_REMOVED,
  ETH_TX_PLATFORM_SETTING_CREATED,
  ETH_TX_PLATFORM_PAUSED,
  ETH_TX_PLATFORM_UNPAUSED,
  ETH_TX_PLATFORM_SETTING_UPDATED,
  ETH_TX_PLATFORM_SETTING_REMOVED,
} from "../utils/consts";
import {
  creatingLendingPoolPauseChange,
  updateOrCreateLendingPoolPauseStatus,
  createPauserChange,
  updateOrCreatePauserStatus,
  createPlatformSettingChange,
  updateOrCreatePlatformSettingsStatus,
} from "../utils/settings-commons";

export function handlePlatformSettingCreated(
  event: PlatformSettingCreatedEvent
): void {
  createPlatformSettingChange(
    BigInt.fromI32(0),
    event.params.value,
    event.params.sender,
    event.params.settingName.toString(),
    ETH_TX_PLATFORM_SETTING_CREATED,
    event
  );
  updateOrCreatePlatformSettingsStatus(
    event.params.settingName.toString(),
    event.params.minValue,
    event.params.maxValue,
    false,
    event.params.value,
    event
  );
}

export function handlePlatformSettingUpdated(
  event: PlatformSettingUpdatedEvent
): void {
  createPlatformSettingChange(
    event.params.oldValue,
    event.params.newValue,
    event.params.sender,
    event.params.settingName.toString(),
    ETH_TX_PLATFORM_SETTING_UPDATED,
    event
  );
  updateOrCreatePlatformSettingsStatus(
    event.params.settingName.toString(),
    event.params.newValue, // We haven't got the min/max value at this point. So we pass the newValue, but it only modify the new value internally.
    event.params.newValue, // We haven't got the min/max value at this point. So we pass the newValue, but it only modify the new value internally.
    false,
    event.params.newValue,
    event
  );
}

export function handlePlatformSettingRemoved(
  event: PlatformSettingRemovedEvent
): void {
  createPlatformSettingChange(
    event.params.lastValue,
    BigInt.fromI32(0),
    event.params.sender,
    event.params.settingName.toString(),
    ETH_TX_PLATFORM_SETTING_REMOVED,
    event
  );
  updateOrCreatePlatformSettingsStatus(
    event.params.settingName.toString(),
    BigInt.fromI32(0), // We haven't got the min/max value at this point. So we pass the newValue, but it only modify the new value internally.
    BigInt.fromI32(0), // We haven't got the min/max value at this point. So we pass the newValue, but it only modify the new value internally.
    true,
    event.params.lastValue,
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
  createPlatformSettingChange(
    BigInt.fromI32(0),
    BigInt.fromI32(1),
    event.params.account,
    "PausePlatform",
    ETH_TX_PLATFORM_PAUSED,
    event
  );
  updateOrCreatePlatformSettingsStatus(
    "PausePlatform",
    BigInt.fromI32(0),
    BigInt.fromI32(1),
    false,
    BigInt.fromI32(1),
    event
  );
}

export function handleUnpaused(event: UnpausedEvent): void {
  createPlatformSettingChange(
    BigInt.fromI32(1),
    BigInt.fromI32(0),
    event.params.account,
    "PausePlatform",
    ETH_TX_PLATFORM_UNPAUSED,
    event
  );
  updateOrCreatePlatformSettingsStatus(
    "PausePlatform",
    BigInt.fromI32(0),
    BigInt.fromI32(1),
    false,
    BigInt.fromI32(0),
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
