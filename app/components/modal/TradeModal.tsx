"use client";
import { forwardRef, useImperativeHandle, useState } from "react";
import { DatePicker, Form, Input, InputNumber, Modal, Select } from "antd";
import { v4 as uuidv4 } from "uuid";
import { assign, upperCase, values } from "lodash";
import { ORDER_ENUM, orderColor, PAIR_ENUM } from "@/module/constants";
import { IDataType } from "@/module/interface";
import dayjs from "dayjs";
import stringToHexColor from "@/app/lib/stringToHexColor";

export type TAddNewRef = {
  addNew: () => void;
  edit: (record: IDataType) => void;
};

interface IProps {
  onFinish: (value: IDataType) => void;
}

const TradeModal = forwardRef<TAddNewRef, IProps>(({ onFinish }, ref) => {
  const [formRef] = Form.useForm<IDataType>();
  const [open, setOpen] = useState<boolean>(false);

  const afterClose = () => {
    formRef.resetFields();
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

  const handleFinish = (value: IDataType) => {
    onFinish(value);
    setOpen(false);
  };

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
            showTime={{ format: "HH:mm" }}
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
      </Form>
    </Modal>
  );
});

TradeModal.displayName = "AddNewModal";

export default TradeModal;
