import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
  createAssetSettingsChange,
  getOrCreateAssetSettingsStatus,
  updateAddressAssetSettingsStatus,
  updateBigIntAssetSettingsStatus,
} from "../utils/common-settings";
import {
  ASSET_SETTINGS_CTOKEN_ADDRESS,
  ASSET_SETTINGS_MAX_LOAN_AMOUNT,
  ASSET_SETTINGS_REMOVED,
} from "../utils/consts";
import {
  AssetSettingsCreated as AssetSettingsCreatedEvent,
  AssetSettingsUintUpdated as AssetSettingsUintUpdatedEvent,
  AssetSettingsAddressUpdated as AssetSettingsAddressUpdatedEvent,
  AssetSettingsRemoved as AssetSettingsRemovedEvent,
} from "../../generated/AssetSettingsInterface/AssetSettingsInterface";

export function handleAssetSettingsCreated(
  event: AssetSettingsCreatedEvent
): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    Bytes.fromUTF8(ASSET_SETTINGS_CTOKEN_ADDRESS) as Bytes,
    "",
    event.params.cTokenAddress.toHexString(),
    event
  );

  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    Bytes.fromUTF8(ASSET_SETTINGS_MAX_LOAN_AMOUNT) as Bytes,
    "0",
    event.params.maxLoanAmount.toString(),
    event
  );
  getOrCreateAssetSettingsStatus(
    event.params.assetAddress,
    event.params.cTokenAddress,
    event.params.maxLoanAmount,
    event
  );
}

export function handleAssetSettingsUintUpdated(
  event: AssetSettingsUintUpdatedEvent
): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    event.params.assetSettingName,
    event.params.oldValue.toString(),
    event.params.newValue.toString(),
    event
  );
  updateBigIntAssetSettingsStatus(
    event.params.assetAddress,
    event.params.assetSettingName.toHexString(),
    event.params.newValue,
    event
  );
}

export function handleAssetSettingsAddressUpdated(
  event: AssetSettingsAddressUpdatedEvent
): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    event.params.assetSettingName,
    event.params.oldValue.toHexString(),
    event.params.newValue.toHexString(),
    event
  );
  updateAddressAssetSettingsStatus(
    event.params.assetAddress,
    event.params.assetSettingName.toHexString(),
    event.params.newValue,
    event
  );
}

export function handleAssetSettingsRemoved(
  event: AssetSettingsRemovedEvent
): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.assetAddress,
    Bytes.fromUTF8(ASSET_SETTINGS_REMOVED) as Bytes,
    "false",
    "true",
    event
  );
  updateBigIntAssetSettingsStatus(
    event.params.assetAddress,
    ASSET_SETTINGS_REMOVED,
    BigInt.fromI32(0),
    event
  );
}
