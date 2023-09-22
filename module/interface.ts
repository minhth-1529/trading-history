import { ORDER_ENUM, PAIR_ENUM } from "@/module/constants";
import { Dayjs } from "dayjs";

export type TOriginDataType = {
  [key: string]: {
    data: IDataType[];
    condition: string;
  };
};

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

export interface ITabsKey {
  label: string;
  key: string;
  //children: ReactNode
}
