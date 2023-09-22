import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Modal } from "antd";
import { IPattern } from "@/module/interface";

export type TPatternModal = {
  addNew: () => void;
};

interface IProps {
  onFinish: (value: string) => void;
}

const PatternModal = forwardRef<TPatternModal, IProps>(({ onFinish }, ref) => {
  const [formRef] = Form.useForm<IPattern>();
  const [open, setOpen] = useState<boolean>(false);

  const afterClose = () => {
    formRef.resetFields();
  };

  const handleFinish = (value: IPattern) => {
    onFinish(value.name);
    setOpen(false);
  };

  useImperativeHandle(ref, () => ({
    addNew: () => {
      setOpen(true);
    },
  }));

  return (
    <Modal
      forceRender
      destroyOnClose={true}
      title={"Add New"}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={formRef.submit}
      afterClose={afterClose}
    >
      <Form
        onFinish={handleFinish}
        form={formRef}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label={"Name"}
          name="name"
          rules={[{ required: true, message: "This field is required" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
});

export default PatternModal;
