import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { ICondition } from '@/module/interface';

interface IProps {
  onFinish: (value: string) => void;
}

export type TConditionModal = {
  addNew: () => void;
};

const ConditionModal = forwardRef<TConditionModal, IProps>(
  ({ onFinish }, ref) => {
    const [formRef] = Form.useForm<ICondition>();
    const [loading,setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false);

    const afterClose = () => {
      formRef.resetFields();
    };

    const handleFinish = (value: ICondition) => {
      setLoading(true)

      setTimeout(()=>{
        setLoading(false)
        onFinish(value.condition);
        setOpen(false);
      },1000)
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
        okButtonProps={{size: 'small'}}
        cancelButtonProps={{size: 'small'}}
        okText={'Submit'}
      >
        <Form
          onFinish={handleFinish}
          form={formRef}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item
            label={"Condition"}
            name="condition"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
);

ConditionModal.displayName = 'ConditionModal'

export default ConditionModal;
