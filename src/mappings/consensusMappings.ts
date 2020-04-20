import { log } from '@graphprotocol/graph-ts'
import { BigInt } from "@graphprotocol/graph-ts"
import {
  InterestAccepted as InterestAcceptedEvent,
  InterestSubmitted as InterestSubmittedEvent,
} from "../../generated/ConsensusInterface/ConsensusInterface"
import { InterestAccepted, InterestSubmitted } from "../../generated/schema"
import { createEthTransaction, buildId } from "../utils/commons"
import { ETH_TX_INTEREST_ACCEPTED, ETH_TX_INTEREST_SUBMITTED } from '../utils/consts'

export function handleInterestSubmitted(event: InterestSubmittedEvent): void {
  let id = buildId(event)
  log.info('Creating new interest submitted with id {}', [id])
  let ethTransaction = createEthTransaction(event, ETH_TX_INTEREST_SUBMITTED)
  let entity = new InterestSubmitted(id)
  entity.transaction = ethTransaction.id
  entity.interest = event.params.interest
  entity.lender = event.params.lender
  entity.signer = event.params.signer
  entity.blockNumber = event.params.blockNumber
  entity.save()
}

export function handleInterestAccepted(event: InterestAcceptedEvent): void {
  let id = buildId(event)
  log.info('Creating new interest accepted with id {}', [id])
  let ethTransaction = createEthTransaction(event, ETH_TX_INTEREST_ACCEPTED)
  let entity = new InterestAccepted(id)
  entity.transaction = ethTransaction.id
  entity.interest = event.params.interest
  entity.lender = event.params.lender
  entity.acceptedAt = event.block.timestamp.times(BigInt.fromI32(1000))
  entity.blockNumber = event.params.blockNumber
  entity.save()
}
