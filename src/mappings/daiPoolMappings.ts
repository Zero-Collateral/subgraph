import {
  DaiDeposited as DaiDepositedEvent,
  DaiWithdrawn as DaiWithdrawnEvent,
  PaymentLiquidated as PaymentLiquidatedEvent,
  DaiRepaid as DaiRepaidEvent,
} from "../../generated/DAIPoolInterface/DAIPoolInterface"
import { createDaiPoolAction, createEthTransaction } from "../utils/commons"
import {
  Dai_Pool_Deposit, Dai_Pool_Withdraw, Dai_Pool_Repay, Dai_Pool_Liquidate
} from '../utils/consts/daiPoolActions'
import { Eth_Tx_DaiDeposited, Eth_Tx_DaiWithdrawn, Eth_Tx_DaiRepaid, Eth_Tx_PaymentLiquidated } from '../utils/consts/ethTransactionEvents'

export function handleDaiDeposited(event: DaiDepositedEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let ethTransaction = createEthTransaction(event, Eth_Tx_DaiDeposited)
  createDaiPoolAction(
    id,
    Dai_Pool_Deposit,
    event.params.sender,
    event.params.amount,
    ethTransaction,
  )
}

export function handleDaiWithdrawn(event: DaiWithdrawnEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let ethTransaction = createEthTransaction(event, Eth_Tx_DaiWithdrawn)
  createDaiPoolAction(
    id,
    Dai_Pool_Withdraw,
    event.params.sender,
    event.params.amount,
    ethTransaction,
  )
}

export function handleDaiRepaid(event: DaiRepaidEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let ethTransaction = createEthTransaction(event, Eth_Tx_DaiRepaid)
  createDaiPoolAction(
    id,
    Dai_Pool_Repay,
    event.params.borrower,
    event.params.amount,
    ethTransaction,
  )
}

export function handlePaymentLiquidated(event: PaymentLiquidatedEvent): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let ethTransaction = createEthTransaction(event, Eth_Tx_PaymentLiquidated)
  createDaiPoolAction(
    id,
    Dai_Pool_Liquidate,
    event.params.liquidator,
    event.params.amount,
    ethTransaction,
  )
}
