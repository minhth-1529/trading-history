const MASTER_KEY =
  "$2a$10$Rd9ABgmUvpzCCwSfjzxR6ukTEBj4b/bJZGs6ctH71iQIuD.ab9HUa";
const ACCESS_KEY =
  "$2a$10$JKp2TKlikrln7C6stCJ4d.OdA0EiPUOP.JgLng2KzwBtXGw0X7BLq";

export const headers = {
  "Content-Type": "application/json",
  "X-Master-Key": MASTER_KEY,
  "X-ACCESS-KEY": ACCESS_KEY,
};

export enum PAIR_ENUM {
  "EUR/USD" = "eur/usd",
  "USD/CHF" = "usd/chf",
  "EUR/JPY" = "eur/jpy",
  "XAU/USD" = "xau/usd",
}

export enum ORDER_ENUM {
  "SELL" = "sell",
  "BUY" = "buy",
  "SELL_LIMIT" = "sell_limit",
  "BUY_LIMIT" = "buy_limit",
}

export const orderColor = {
  [ORDER_ENUM.SELL]: "bg-red-100 text-red-700",
  [ORDER_ENUM.BUY]: "bg-green-100 text-green-700",
  [ORDER_ENUM.BUY_LIMIT]: "bg-blue-100 text-blue-700",
  [ORDER_ENUM.SELL_LIMIT]: "bg-red-100 text-red-700",
};
