import {
  TokenDeposited as TokenDepositedEvent,
  TokenWithdrawn as TokenWithdrawnEvent,
  TokenRepaid as TokenRepaidEvent,
  InterestWithdrawn as InterestWithdrawnEvent,
} from "../../../generated/DAI_ETH_LendingPool/DAILendingPool";
import {
  LENDING_POOL_DEPOSITED,
  LENDING_POOL_WITHDRAWN,
  LENDING_POOL_REPAID,
  LENDING_POOL_LIQUIDATED,
  LENDING_POOL_INTEREST_WITHDRAWN,
  ETH_TX_TOKEN_DEPOSITED,
  ETH_TX_TOKEN_WITHDRAWN,
  ETH_TX_TOKEN_REPAID,
  ETH_TX_PAYMENT_LIQUIDATED,
  ETH_TX_INTEREST_WITHDRAWN,
  TOKEN_DAI,
  TTOKEN_TDAI,
  COLLATERAL_TOKEN_ETH,
} from "../../utils/consts";
import { internalHandleLendingPoolChange } from "../../utils/lendingpool-commons";

export function handleInterestWithdrawn(event: InterestWithdrawnEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_INTEREST_WITHDRAWN,
    TTOKEN_TDAI,
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_INTEREST_WITHDRAWN,
    event.params.lender,
    event.params.amount,
    event
  )
}

export function handleTokenDeposited(event: TokenDepositedEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_TOKEN_DEPOSITED,
    TTOKEN_TDAI,
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_DEPOSITED,
    event.params.sender,
    event.params.amount,
    event
  )
}

export function handleTokenWithdrawn(event: TokenWithdrawnEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_TOKEN_WITHDRAWN,
    TTOKEN_TDAI,
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_WITHDRAWN,
    event.params.sender,
    event.params.amount,
    event
  )
}

export function handleDaiRepaid(event: TokenRepaidEvent): void {
  internalHandleLendingPoolChange(
    ETH_TX_TOKEN_REPAID,
    TTOKEN_TDAI,
    TOKEN_DAI,
    COLLATERAL_TOKEN_ETH,
    LENDING_POOL_REPAID,
    event.params.borrower,
    event.params.amount,
    event
  )
}