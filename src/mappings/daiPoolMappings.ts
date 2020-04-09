import {
  DaiDeposited as DaiDepositedEvent,
  DaiWithdrawn as DaiWithdrawnEvent,
  PaymentLiquidated as PaymentLiquidatedEvent,
  DaiRepaid as DaiRepaidEvent,
} from "../../generated/DAIPoolInterface/DAIPoolInterface"
import { createDaiPoolAction } from "../utils/commons"

export function handleDaiDeposited(event: DaiDepositedEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  createDaiPoolAction(
    id,
    'Deposit',
    event.params.sender,
    event.params.amount
  )
}

export function handleDaiWithdrawn(event: DaiWithdrawnEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  createDaiPoolAction(
    id,
    'Withdraw',
    event.params.sender,
    event.params.amount
  )
}

export function handleDaiRepaid(event: DaiRepaidEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  createDaiPoolAction(
    id,
    'Repay',
    event.params.borrower,
    event.params.amount
  )
}

export function handlePaymentLiquidated(event: PaymentLiquidatedEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  createDaiPoolAction(
    id,
    'Liquidate',
    event.params.liquidator,
    event.params.amount
  )
}
