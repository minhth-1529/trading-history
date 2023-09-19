import { ORDER_ENUM, PAIR_ENUM } from "@/module/constants";
import { Dayjs } from "dayjs";

export interface IDataType {
  id: string;
  pair: PAIR_ENUM;
  order: ORDER_ENUM;
  date: string | Dayjs;
  tp: number;
  rule: boolean;
  img: string;
}
