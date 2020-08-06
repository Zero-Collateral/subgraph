import { log, BigInt, Bytes } from "@graphprotocol/graph-ts";
import {
  SettingUpdated as SettingUpdatedEvent,
  LendingPoolPaused as LendingPoolPausedEvent,
  LendingPoolUnpaused as LendingPoolUnpausedEvent,
  Paused as PausedEvent,
  Unpaused as UnpausedEvent,
  PauserAdded as PauserAddedEvent,
  PauserRemoved as PauserRemovedEvent,
  AssetSettingsCreated as AssetSettingsCreatedEvent,
  AssetSettingsUintUpdated as AssetSettingsUintUpdatedEvent,
  AssetSettingsAddressUpdated as AssetSettingsAddressUpdatedEvent,
  AssetSettingsRemoved as AssetSettingsRemovedEvent,
} from "../../generated/SettingsInterface/SettingsInterface";

import { getTimestampInMillis } from "../utils/commons";
import {
  ETH_TX_PLATFORM_PAUSER_ADDED,
  ETH_TX_PLATFORM_PAUSER_REMOVED,
  ASSET_SETTINGS_CTOKEN_ADDRESS,
  ASSET_SETTINGS_MAX_LOAN_AMOUNT,
  ASSET_SETTINGS_REMOVED,
} from "../utils/consts";
import {
  creatingLendingPoolPauseChange,
  updateOrCreateLendingPoolPauseStatus,
  internalHandleSettingUpdated,
  createPauserChange,
  updateOrCreatePauserStatus,
} from "../utils/settings-commons";
import { createAssetSettingsChange, getOrCreateAssetSettingsStatus, updateBigIntAssetSettingsStatus, updateAddressAssetSettingsStatus } from "../utils/common-settings";

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
    event.params.assetAddress,
    Bytes.fromUTF8(ASSET_SETTINGS_CTOKEN_ADDRESS) as Bytes,
    '',
    event.params.cTokenAddress.toHexString(),
    event
  )

  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    Bytes.fromUTF8(ASSET_SETTINGS_MAX_LOAN_AMOUNT) as Bytes,
    '0',
    event.params.maxLoanAmount.toString(),
    event
  )
  getOrCreateAssetSettingsStatus(
    event.params.assetAddress,
    event.params.cTokenAddress,
    event.params.maxLoanAmount,
    event
  )
}

export function handleAssetSettingsUintUpdated(event: AssetSettingsUintUpdatedEvent): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    event.params.assetSettingName,
    event.params.oldValue.toString(),
    event.params.newValue.toString(),
    event
  )
  updateBigIntAssetSettingsStatus(
    event.params.assetAddress,
    event.params.assetSettingName.toString(),
    event.params.newValue,
    event
  )
}

export function handleAssetSettingsAddressUpdated(event: AssetSettingsAddressUpdatedEvent): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    event.params.assetSettingName,
    event.params.oldValue.toHexString(),
    event.params.newValue.toHexString(),
    event
  )
  updateAddressAssetSettingsStatus(
    event.params.assetAddress,
    event.params.assetSettingName.toString(),
    event.params.newValue,
    event
  )
}

export function handleAssetSettingsRemoved(event: AssetSettingsRemovedEvent): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    Bytes.fromUTF8(ASSET_SETTINGS_REMOVED) as Bytes,
    'false',
    'true',
    event
  )
  updateBigIntAssetSettingsStatus(
    event.params.assetAddress,
    ASSET_SETTINGS_REMOVED,
    BigInt.fromI32(0),
    event
  )
}
