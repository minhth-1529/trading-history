import { Dayjs } from 'dayjs';

export type TOriginDataType = {
  [key: string]: {
    [SUMMARY_ENUM.STATISTICAL]: IDataType[];
    [SUMMARY_ENUM.BACK_TEST]: IDataType[];
    condition: string;
  };
};

export enum SUMMARY_ENUM {
  STATISTICAL = 'statistical',
  BACK_TEST = 'backTest'
}

export enum PAIR_ENUM {
  'EUR/USD' = 'eur/usd',
  'USD/CHF' = 'usd/chf',
  'EUR/JPY' = 'eur/jpy',
  'XAU/USD' = 'xau/usd'
}

export enum ORDER_ENUM {
  'SELL' = 'sell',
  'BUY' = 'buy',
  'SELL_LIMIT' = 'sell_limit',
  'BUY_LIMIT' = 'buy_limit'
}

export interface IDataType {
  id: string;
  pair: PAIR_ENUM;
  order: ORDER_ENUM;
  date: string | Dayjs;
  tp: number;
  rule: boolean;
  img: string;
  note: string;
}

export interface IPattern {
  name: string;
}

export interface ICondition {
  condition: string;
}
