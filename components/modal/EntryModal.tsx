'use client';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { DatePicker, Form, Input, InputNumber, Modal, Select } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { assign, upperCase, values } from 'lodash';
import { orderColor } from '@/module/constants';
import { IDataType, ORDER_ENUM, PAIR_ENUM } from '@/module/interface';
import dayjs from 'dayjs';
import stringToHexColor from '@/lib/stringToHexColor';

export type TAddNewRef = {
  addNew: () => void;
  edit: (record: IDataType) => void;
};

interface IProps {
  data: IDataType[];
  onFinish: (value: IDataType) => void;
}

const EntryModal = forwardRef<TAddNewRef, IProps>(({ onFinish, data }, ref) => {
  const [formRef] = Form.useForm<IDataType>();
  const [loading,setLoading] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false);

  const afterClose = () => {
    formRef.resetFields();
  };

  const handleFinish = (value: IDataType) => {
    setLoading(true)

    setTimeout(()=>{
      setLoading(false)
      onFinish(value);
      setOpen(false);
    },1000)
  };

  useImperativeHandle(ref, () => ({
    addNew: () => {
      setOpen(true);
      formRef.setFieldsValue({
        id: uuidv4(),
      });
    },
    edit: (record) => {
      setOpen(true);

      formRef.setFieldsValue({
        ...record,
        ...assign({ date: dayjs(record.date) }),
      });
    },
  }));
  
  useEffect(() => {
    if (formRef.getFieldValue('id')) return;

    formRef.setFieldValue('date', data[0].date ? dayjs(data[0].date) : dayjs())
  }, [open]);



  return (
    <Modal
      forceRender
      destroyOnClose={true}
      title={"Entry"}
      open={open}
      onCancel={() => setOpen(false)}
      onOk={formRef.submit}
      afterClose={afterClose}
      confirmLoading={loading}
      okText={'Submit'}
      okButtonProps={{size: 'small'}}
      cancelButtonProps={{size: 'small'}}
    >
      <Form
        onFinish={handleFinish}
        form={formRef}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item hidden={true} name="id">
          <Input />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "This field is required" }]}
          label={"Pair"}
          name={"pair"}
        >
          <Select
            options={values(PAIR_ENUM).map((item) => ({
              label: (
                <span
                  className={
                    "items-center inline-flex rounded-md  px-2 py-1 text-xs font-medium text-white"
                  }
                  style={{
                    backgroundColor: stringToHexColor(item) as string,
                  }}
                >
                  {item.toLocaleUpperCase()}
                </span>
              ),
              value: item,
            }))}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "This field is required" }]}
          label={"Order"}
          name={"order"}
        >
          <Select
            options={values(ORDER_ENUM).map((item) => ({
              label: (
                <span
                  className={`items-center inline-flex  rounded-md px-2 py-1 text-xs font-medium ${
                    orderColor[item as ORDER_ENUM]
                  }`}
                >
                  {upperCase(item)}
                </span>
              ),
              value: item,
            }))}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "This field is required" }]}
          label={"Date"}
          name={"date"}
        >
          <DatePicker
            showTime={{ format: "HH:mm", minuteStep: 5 }}
            format="DD/MM/YYYY HH:mm"
            className={"w-full"}
          />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "This field is required" }]}
          label={"Take Profit"}
          name={"tp"}
        >
          <InputNumber className={"!w-full"} />
        </Form.Item>
        <Form.Item
          rules={[{ required: true, message: "This field is required" }]}
          label={"Rule"}
          name={"rule"}
        >
          <Select
            options={[
              {
                label: (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700`}
                  >
                    True
                  </span>
                ),
                value: true,
              },
              {
                label: (
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-rose-100 text-rose-700`}
                  >
                    False
                  </span>
                ),
                value: false,
              },
            ]}
          />
        </Form.Item>
        <Form.Item label={"Image"} name={"img"}>
          <Input />
        </Form.Item>
        <Form.Item label={"Note"} name={"note"}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label={"Advantage"} name={"advantage"}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item label={"Disadvantage"} name={"disadvantage"}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
});

EntryModal.displayName = "EntryModal";

export default EntryModal;
