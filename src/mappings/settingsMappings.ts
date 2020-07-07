import { log, BigInt, ethereum, Address, dataSource } from "@graphprotocol/graph-ts";
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

import {CErc20Interface} from "../../generated/SettingsInterface/CErc20Interface";

import { SettingsInterface } from "../../generated/SettingsInterface/SettingsInterface";

import { getTimestampInMillis, buildBlockId } from "../utils/commons";
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
import { CTokenExchangeRateChange, AssetSettingsChange, AssetSettingsStatus } from "../../generated/schema";
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
  let entity = creatingLendingPoolPauseChange(
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

  let entity = creatingLendingPoolPauseChange(
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
    event.params.rateProcessFrequency,
    event.params.maxLendingAmount,
    event
  )
  getOrCreateAssetSettingsStatus(
    event.params.lendingToken,
    event.params.cToken,
    event.params.rateProcessFrequency,
    event.params.maxLendingAmount,
    event
  )
}

export function handleAssetSettingsUpdated(event: AssetSettingsUpdatedEvent): void {
  createAssetSettingsChange(
    event.params.sender,
    event.params.lendingToken,
    event.params.cToken,
    event.params.newRateProcessFrequency,
    event.params.newMaxLendingAmount,
    event
  )
  getOrCreateAssetSettingsStatus(
    event.params.lendingToken,
    event.params.cToken,
    event.params.newRateProcessFrequency,
    event.params.newMaxLendingAmount,
    event
  )
}

export function handleCTokenExchangeRateProcessBlock(block: ethereum.Block): void {
  let blockNumber = block.number

  log.info("Getting Settings config in network {}.", [dataSource.network()])

  // 86400 seconds per day
  // 3600 seconds per hour
  // 15 seconds per block
  // => 5760 blocks per day
  // => 240 blocks per hour

  log.info("Getting Settings contract address {}.", [dataSource.address().toHexString()])

  let settings = SettingsInterface.bind(dataSource.address())
  let assetsTry = settings.try_getAssets()
  if (assetsTry.reverted) {
    log.info("try_getAssets failed.", [])
    return
  }
  let assets = assetsTry.value

  log.info("Found {} asset settings to process.", [BigInt.fromI32(assets.length).toString()])

  for(let index = 0; index < assets.length; index++) {
    let assetAddress = assets[index];
    let assetSettings = settings.getAssetSettings(assetAddress)

    let remainder = blockNumber.mod(assetSettings.rateProcessFrequency)
    let processExchangeRate = remainder.equals(BigInt.fromI32(0))

    log.info(
      "Getting asset settings {}. BN: {} - RPF: {} - Remainder: {}",
      [
        assetAddress.toHexString(),
        blockNumber.toString(),
        assetSettings.rateProcessFrequency.toString(),
        remainder.toString()
      ]
    )
    if (processExchangeRate) {
      log.info(
        "Processing exchange rate in block #{}.",
        [blockNumber.toString()]
      )
      let cErc20 = CErc20Interface.bind(assetSettings.cTokenAddress)
      let cTokenSymbol = cErc20.symbol();
      let exchangeRateCurrent = cErc20.exchangeRateCurrent();

      let id = block.number.toString() + '_' + cTokenSymbol
      log.info("Exchange rate for cToken {} is {}. ID: {}", [cTokenSymbol, exchangeRateCurrent.toString(), id])

      let entity = new CTokenExchangeRateChange(id)
      entity.cToken = cTokenSymbol
      entity.exchangeRate = exchangeRateCurrent
      entity.blockNumber = blockNumber
      entity.timestamp = block.timestamp
      entity.save()
    }
  }
}