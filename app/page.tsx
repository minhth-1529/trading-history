"use client";
import { Button, Dropdown, Image, message, Table } from "antd";
import { assign, get, isEmpty, unionBy, upperCase } from "lodash";
import { ORDER_ENUM, orderColor } from "@/module/constants";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import cls from "classnames";
import stringToHexColor from "@/app/util/stringToHexColor";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { IDataType } from "@/module/interface";
import AddNewModal, { TAddNewRef } from "@/app/component/AddNewModal";

const ID = "650979ed205af66dd4a181ec";
const MASTER_KEY =
  "$2a$10$Rd9ABgmUvpzCCwSfjzxR6ukTEBj4b/bJZGs6ctH71iQIuD.ab9HUa";
const ACCESS_KEY =
  "$2a$10$JKp2TKlikrln7C6stCJ4d.OdA0EiPUOP.JgLng2KzwBtXGw0X7BLq";

const headers = {
  "Content-Type": "application/json",
  "X-Master-Key": MASTER_KEY,
  "X-ACCESS-KEY": ACCESS_KEY,
};

const fetchData = async () => {
  return axios.get(`https://api.jsonbin.io/v3/b/${ID}`, { headers });
};

const updateData = async (data: IDataType[]) => {
  await axios
    .put(`https://api.jsonbin.io/v3/b/${ID}`, data, {
      headers,
    })
    .then(() => message.success("Added/Deleted successfully!"))
    .catch((err) => console.log(err));
};

const handleUpdate = (data: IDataType[]) => {
  updateData(data).then();
};

export default function Home() {
  const modalRef = useRef<TAddNewRef>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<IDataType[]>([]);

  const onFinish = (value: IDataType) => {
    const values = unionBy(
      [assign(value, { date: dayjs(value.date).format() })],
      data,
      "id",
    );

    setData(values);
    handleUpdate(values);
  };

  const handleDelete = (id: string) => {
    const value = data.filter((item) => item.id !== id);

    if (isEmpty(value)) {
      return message.error("Can not delete the last one!").then();
    }

    setData(value);
    handleUpdate(value);
  };

  const handleEdit = (record: IDataType) => {
    if (modalRef.current) modalRef.current.edit(record);
  };

  useEffect(() => {
    fetchData().then((res) => {
      setData(get(res, "data.record", []));
      setLoading(false);
    });
  }, []);

  return !loading ? (
    <main className="p-5">
      <div className={"flex justify-end mb-5"}>
        <Button
          onClick={() => modalRef.current && modalRef.current.addNew()}
          type={"primary"}
        >
          Add
        </Button>
      </div>
      <Table
        columns={[
          {
            title: "Pair",
            dataIndex: "pair",
            key: "pair",
            width: 100,
            render: (value) => (
              <span
                className={
                  "inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium text-white"
                }
                style={{ backgroundColor: stringToHexColor(value) as string }}
              >
                {value.toLocaleUpperCase()}
              </span>
            ),
          },
          {
            title: "Order",
            dataIndex: "order",
            key: "order",
            width: 150,
            render: (value) => (
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ${
                  orderColor[value as ORDER_ENUM]
                }`}
              >
                {upperCase(value)}
              </span>
            ),
          },
          {
            title: "Date",
            dataIndex: "date",
            key: "date",
            width: 150,
            render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
          },
          {
            title: "TP",
            dataIndex: "tp",
            key: "tp",
            width: 100,
            render: (value) => (
              <span
                className={cls(
                  "inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium",
                  { "bg-green-100 text-green-700": value > 0 },
                  { "bg-red-100 text-red-700": value < 0 },
                )}
              >
                {value}
              </span>
            ),
          },
          {
            title: "Rule",
            dataIndex: "rule",
            key: "rule",
            width: 100,
            render: (value) => (
              <span
                className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                  value
                    ? "bg-blue-100 text-blue-700"
                    : "bg-rose-100 text-rose-700"
                }`}
              >
                {value ? "True" : "False"}
              </span>
            ),
          },
          {
            title: "Image",
            dataIndex: "img",
            key: "image",
            width: 100,
            render: (value) =>
              value ? (
                <Image height={100} width={100} preview={true} src={value} />
              ) : null,
          },
          {
            title: "Note",
            dataIndex: "note",
            key: "note",
            width: 250,
            render: (value) =>
              value ? (
                <div className={"whitespace-pre-line"}>{value}</div>
              ) : null,
          },
          {
            title: "Action",
            key: "action",
            width: 80,
            render: (_, record) => {
              return (
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: "Edit",
                        icon: <EditOutlined />,
                        onClick: () => handleEdit(record),
                      },
                      {
                        key: "delete",
                        label: "Delete",
                        icon: <DeleteOutlined />,
                        onClick: () => handleDelete(record.id),
                        danger: true,
                      },
                    ],
                  }}
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                >
                  <span
                    className={
                      "inline-flex w-8 h-8 items-center justify-center cursor-pointer"
                    }
                  >
                    <EllipsisOutlined />
                  </span>
                </Dropdown>
              );
            },
          },
        ]}
        rowKey={"id"}
        dataSource={data}
      />
      <AddNewModal ref={modalRef} onFinish={onFinish} />
    </main>
  ) : (
    <div className={"w-full h-full flex items-center justify-center"}>
      <span className="w-8 h-8 inline-block border-4 border-dashed rounded-full animate-spin-slow dark:border-violet-400"></span>
    </div>
  );
}
