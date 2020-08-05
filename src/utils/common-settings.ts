import { BigInt, ethereum, Address, log, Bytes, ByteArray } from "@graphprotocol/graph-ts";
import { AssetSettingsStatus, AssetSettingsChange } from "../../generated/schema";
import { getTimestampInMillis, buildId } from "./commons";
import { ASSET_SETTINGS_MAX_LOAN_AMOUNT, ASSET_SETTINGS_CTOKEN_ADDRESS, ASSET_SETTINGS_REMOVED } from "./consts";

// As TheGraph doesn't support convertion string > BigInt, we created two similar functions.
export function updateAddressAssetSettingsStatus(
  lendingToken: Address,
  propertyChanged: string,
  newValue: Address,
  event: ethereum.Event
): void {
  let id = lendingToken.toHexString()
  let entity = AssetSettingsStatus.load(id)
  log.info('Getting asset settings status instance with id {}', [id]);
  log.info('Updating asset settings status (address). Property: {}', [propertyChanged]);
  
  if(propertyChanged == ASSET_SETTINGS_CTOKEN_ADDRESS) {
    entity.cTokenAddress = newValue
  }
  entity.timestamp = getTimestampInMillis(event)
  entity.blockNumber = event.block.number
  entity.save()
}

export function updateBigIntAssetSettingsStatus(
  lendingToken: Address,
  propertyChanged: string,
  newValue: BigInt,
  event: ethereum.Event
): void {
  let id = lendingToken.toHexString()
  let entity = AssetSettingsStatus.load(id)
  log.info('Getting asset settings status (BigInt) instance with id {}', [id]);
  log.info('Updating asset settings status. Property: {}', [propertyChanged]);

  if(propertyChanged == ASSET_SETTINGS_MAX_LOAN_AMOUNT) {
    entity.maxLoanAmount = newValue
  }
  if(propertyChanged == ASSET_SETTINGS_REMOVED) {
    entity.removed = true
  }
  entity.timestamp = getTimestampInMillis(event)
  entity.blockNumber = event.block.number
  entity.save()
}

export function getOrCreateAssetSettingsStatus(
    lendingToken: Address,
    cToken: Address,
    maxLoanAmount: BigInt,
    event: ethereum.Event
  ): AssetSettingsStatus {
    let id = lendingToken.toHexString()
    let entity = AssetSettingsStatus.load(id)
    if(entity === null) {
      entity = new AssetSettingsStatus(id)
    }
    entity.removed = false
    entity.tokenAddress = lendingToken
    entity.cTokenAddress = cToken
    entity.maxLoanAmount = maxLoanAmount
    entity.timestamp = getTimestampInMillis(event)
    entity.blockNumber = event.block.number
    entity.save()
    return entity as AssetSettingsStatus
  }
  
  export function createAssetSettingsChange(
    sender: Address,
    assetAddress: Address,
    propertyChanged: Bytes,
    oldValue: string,
    newValue: string,
    event: ethereum.Event
  ): AssetSettingsChange {
    let id = buildId(event)
    log.info("Creating new asset settings change with id {}", [id]);
    let entity = new AssetSettingsChange(id)
    entity.sender = sender
    entity.tokenAddress = assetAddress
    entity.propertyChanged = propertyChanged.toString()
    entity.oldValue = oldValue
    entity.newValue = newValue
    entity.timestamp = getTimestampInMillis(event)
    entity.blockNumber = event.block.number
    entity.save()
    return entity
  }