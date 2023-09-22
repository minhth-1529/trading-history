import { IDataType, TOriginDataType } from "@/module/interface";

const beforeUpdateData = (
  activeKey: string,
  originData: TOriginDataType,
  data?: IDataType[],
  condition?: string,
): TOriginDataType => {
  return {
    ...originData,
    [activeKey]: {
      data: data ?? originData[activeKey].data,
      condition: condition ?? originData[activeKey].condition,
    },
  };
};

export default beforeUpdateData;
