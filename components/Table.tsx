import stringToHexColor from "@/lib/stringToHexColor";
import { orderColor } from "@/module/constants";
import { upperCase } from "lodash";
import dayjs from "dayjs";
import cls from "classnames";
import { Dropdown, Image, Table } from "antd";
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from "@ant-design/icons";
import { IDataType, ORDER_ENUM } from "@/module/interface";

interface IProps {
  data: IDataType[];
  onDelete: (id: string) => void;
  onEdit: (record: IDataType) => void;
}

export default function TableComponent({ data, onEdit, onDelete }: IProps) {
  return (
    <Table
      pagination={{
        position: ['topRight', 'bottomRight'],
        size: 'small',
        defaultPageSize: 20,
        showTotal:(total, range) => `${range[0]}-${range[1]} of ${total} items`
      }}
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
          width: 170,
          defaultSortOrder: 'descend',
          sorter: (a, b) => {
            return dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
          },
          render: (value) => dayjs(value).format("DD/MM/YYYY HH:mm"),
        },
        {
          title: "TP",
          dataIndex: "tp",
          key: "tp",
          width: 100,
          sorter: (a, b) => a.tp - b.tp,
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
          width: 130,
          render: (value) =>
            value ? (
              <Image height={100} width={100} preview={true} src={value} />
            ) : null,
        },
        {
          title: "Advantage",
          dataIndex: "advantage",
          key: "advantage",
          width: 250,
          render: (value) =>
            value ? <div className={"whitespace-pre-line"}>{value}</div> : null,
        },
        {
          title: "Disadvantage",
          dataIndex: "disadvantage",
          key: "disadvantage",
          width: 250,
          render: (value) =>
            value ? <div className={"whitespace-pre-line"}>{value}</div> : null,
        },
        {
          title: "Note",
          dataIndex: "note",
          key: "note",
          width: 250,
          render: (value) =>
            value ? <div className={"whitespace-pre-line"}>{value}</div> : null,
        },
        {
          title: "Action",
          key: "action",
          width: 80,
          fixed: 'right',
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
                      onClick: () => onEdit(record),
                    },
                    {
                      key: "delete",
                      label: "Delete",
                      icon: <DeleteOutlined />,
                      onClick: () => onDelete(record.id),
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
  );
}
