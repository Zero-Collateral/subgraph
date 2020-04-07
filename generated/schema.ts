// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Borrower extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Borrower entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Borrower entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Borrower", id.toString(), this);
  }

  static load(id: string): Borrower | null {
    return store.get("Borrower", id) as Borrower | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get address(): Bytes {
    let value = this.get("address");
    return value.toBytes();
  }

  set address(value: Bytes) {
    this.set("address", Value.fromBytes(value));
  }

  get loans(): Array<string> {
    let value = this.get("loans");
    return value.toStringArray();
  }

  set loans(value: Array<string>) {
    this.set("loans", Value.fromStringArray(value));
  }
}

export class Loan extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Loan entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Loan entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Loan", id.toString(), this);
  }

  static load(id: string): Loan | null {
    return store.get("Loan", id) as Loan | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get borrower(): string {
    let value = this.get("borrower");
    return value.toString();
  }

  set borrower(value: string) {
    this.set("borrower", Value.fromString(value));
  }

  get startDate(): BigInt {
    let value = this.get("startDate");
    return value.toBigInt();
  }

  set startDate(value: BigInt) {
    this.set("startDate", Value.fromBigInt(value));
  }

  get interestRate(): BigInt {
    let value = this.get("interestRate");
    return value.toBigInt();
  }

  set interestRate(value: BigInt) {
    this.set("interestRate", Value.fromBigInt(value));
  }

  get collateralRatio(): BigInt {
    let value = this.get("collateralRatio");
    return value.toBigInt();
  }

  set collateralRatio(value: BigInt) {
    this.set("collateralRatio", Value.fromBigInt(value));
  }

  get maxLoanAmount(): BigInt {
    let value = this.get("maxLoanAmount");
    return value.toBigInt();
  }

  set maxLoanAmount(value: BigInt) {
    this.set("maxLoanAmount", Value.fromBigInt(value));
  }

  get numberDays(): BigInt {
    let value = this.get("numberDays");
    return value.toBigInt();
  }

  set numberDays(value: BigInt) {
    this.set("numberDays", Value.fromBigInt(value));
  }

  get amountBorrow(): BigInt {
    let value = this.get("amountBorrow");
    return value.toBigInt();
  }

  set amountBorrow(value: BigInt) {
    this.set("amountBorrow", Value.fromBigInt(value));
  }

  get collateralDeposits(): Array<string> {
    let value = this.get("collateralDeposits");
    return value.toStringArray();
  }

  set collateralDeposits(value: Array<string>) {
    this.set("collateralDeposits", Value.fromStringArray(value));
  }

  get collateralWithdrawns(): Array<string> {
    let value = this.get("collateralWithdrawns");
    return value.toStringArray();
  }

  set collateralWithdrawns(value: Array<string>) {
    this.set("collateralWithdrawns", Value.fromStringArray(value));
  }
}

export class CollateralD extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save CollateralD entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save CollateralD entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("CollateralD", id.toString(), this);
  }

  static load(id: string): CollateralD | null {
    return store.get("CollateralD", id) as CollateralD | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loan(): string {
    let value = this.get("loan");
    return value.toString();
  }

  set loan(value: string) {
    this.set("loan", Value.fromString(value));
  }

  get borrower(): string {
    let value = this.get("borrower");
    return value.toString();
  }

  set borrower(value: string) {
    this.set("borrower", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}

export class CollateralW extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save CollateralW entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save CollateralW entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("CollateralW", id.toString(), this);
  }

  static load(id: string): CollateralW | null {
    return store.get("CollateralW", id) as CollateralW | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get loan(): string {
    let value = this.get("loan");
    return value.toString();
  }

  set loan(value: string) {
    this.set("loan", Value.fromString(value));
  }

  get borrower(): string {
    let value = this.get("borrower");
    return value.toString();
  }

  set borrower(value: string) {
    this.set("borrower", Value.fromString(value));
  }

  get amount(): BigInt {
    let value = this.get("amount");
    return value.toBigInt();
  }

  set amount(value: BigInt) {
    this.set("amount", Value.fromBigInt(value));
  }
}
