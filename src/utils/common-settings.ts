import { BigInt, ethereum, Address } from "@graphprotocol/graph-ts";
import { AssetSettingsStatus, AssetSettingsChange } from "../../generated/schema";
import { getTimestampInMillis, buildId } from "./commons";

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
    lendingToken: Address,
    cToken: Address,
    maxLoanAmount: BigInt,
    event: ethereum.Event
  ): AssetSettingsChange {
    let id = buildId(event)
    let entity = new AssetSettingsChange(id)
    entity.sender = sender
    entity.tokenAddress = lendingToken
    entity.cTokenAddress = cToken
    entity.maxLoanAmount = maxLoanAmount
    entity.timestamp = getTimestampInMillis(event)
    entity.blockNumber = event.block.number
    entity.save()
    return entity
  }