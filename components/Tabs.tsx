import React from 'react';
import { Tabs } from 'antd';

export type TargetKey = React.MouseEvent | React.KeyboardEvent | string;

interface IProps {
  data: string[];
  activePattern: string;
  onPatternChange: (value: string) => void;
  onPatternEdit: (targetKey: TargetKey, action: "add" | "remove") => void;
}

const PatternComponent: React.FC<IProps> = ({
  activePattern,
  onPatternChange,
  data,
  onPatternEdit,
}) => {
  return (
    <Tabs
      type="editable-card"
      defaultActiveKey={activePattern}
      accessKey={activePattern}
      onChange={onPatternChange}
      onEdit={onPatternEdit}
      items={data.map((item) => ({ label: item, key: item }))}
    />
  );
};

export default PatternComponent;
