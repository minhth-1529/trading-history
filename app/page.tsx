"use client";
import { Button, Form, Input, message, Tabs } from "antd";
import { assign, get, isEmpty, unionBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { ICondition, IDataType, TOriginDataType } from "@/module/interface";
import TradeModal, { TAddNewRef } from "@/app/components/modal/TradeModal";
import PatternModal, {
  TPatternModal,
} from "@/app/components/modal/PatternModal";
import beforeUpdateData from "@/app/lib/beforeUpdateData";
import { fetchData, handleData } from "@/app/lib/axiosData";
import { fetchTabs, handleTabs } from "@/app/lib/axiosTabs";
import LoadingComponent from "@/app/components/Loading";
import TableComponent from "@/app/components/Table";
import axios from "axios";

export default function RootPage() {
  const tradeModalRef = useRef<TAddNewRef>(null);
  const patternModalRef = useRef<TPatternModal>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [formRef] = Form.useForm<ICondition>();
  // ---------- data ----------
  const [originData, setOriginData] = useState<TOriginDataType>({});
  // const [data, setData] = useState<IDataType[]>([]);

  // ---------- tabs ----------
  const [tabsData, setTabsData] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("123BO");

  // ---------- code ----------
  const updateLayout = (originValues: TOriginDataType) => {
    setOriginData(originValues);
    handleData(originValues);
  };

  const onFinishTradeModal = (value: IDataType) => {
    const values = unionBy(
      [assign(value, { date: dayjs(value.date).format() })],
      originData[activeTab].data,
      "id",
    );

    const originValues = beforeUpdateData(activeTab, originData, values);

    updateLayout(originValues);
  };

  const onFinishPatternModal = (value: string) => {
    const values = [...tabsData, value];

    const data = {
      ...originData,
      [value]: {
        condition: "",
        data: [],
      },
    };
    setTabsData(values);
    handleData(data);
    setOriginData((prev) => ({
      ...prev,
      ...data,
    }));

    handleTabs(values);
  };

  const onDelete = (id: string) => {
    const value = originData[activeTab].data.filter((item) => item.id !== id);

    if (isEmpty(value)) {
      return message.error("Can not delete the last one!").then();
    }

    updateLayout(beforeUpdateData(activeTab, originData));
  };

  const onEdit = (record: IDataType) => {
    if (tradeModalRef.current) tradeModalRef.current.edit(record);
  };

  const onAddCondition = (value: any) => {
    formRef.setFieldValue("condition", value.condition);
    setOriginData(
      beforeUpdateData(activeTab, originData, undefined, value.condition),
    );
    handleData(
      beforeUpdateData(activeTab, originData, undefined, value.condition),
    );
  };

  useEffect(() => {
    if (loading) {
      axios.all([fetchData(), fetchTabs()]).then(
        axios.spread((data, tabData) => {
          const originData = get(data, "data.record", {});
          const tabsData = get(tabData, "data.record", []);

          setOriginData(originData);
          setTabsData(tabsData);

          setActiveTab(tabsData.at(0));
          formRef.setFieldValue(
            "condition",
            originData[tabsData.at(0)].condition,
          );
          setLoading(false);
        }),
      );
    }
  }, [loading]);

  // useEffect(() => {
  //   if (!loading) {
  //     setData(originData[activeTab].data);
  //
  //     if (conditionRef.current) {
  //       conditionRef.current.value = originData[activeTab].condition;
  //     }
  //   }
  // }, [loading]);

  return !loading ? (
    <main className="relative mx-auto max-w-screen-xl px-4 py-10  md:py-10">
      <section className={"flex justify-end mb-5"}>
        <Button
          type={"dashed"}
          onClick={() =>
            patternModalRef.current && patternModalRef.current.addNew()
          }
        >
          Add Pattern
        </Button>
        <Button
          onClick={() =>
            tradeModalRef.current && tradeModalRef.current.addNew()
          }
          type={"primary"}
        >
          Add
        </Button>
      </section>
      <section>
        <Form form={formRef} onFinish={onAddCondition}>
          <Form.Item name={"condition"}>
            <Input.TextArea
              autoSize
              rows={4}
              placeholder="Borderless"
              bordered={true}
              onBlur={formRef.submit}
            />
          </Form.Item>
        </Form>
      </section>
      <section className={"w-full"}>
        <div>
          <Tabs
            type="editable-card"
            defaultActiveKey={activeTab}
            accessKey={activeTab}
            onChange={(value) => {
              setActiveTab(value);
              formRef.setFieldValue("condition", originData[value].condition);
            }}
            //tabPosition={"left"}
            items={tabsData.map((item) => ({ label: item, key: item }))}
          />
        </div>
        <div className={"w-full"}>
          <TableComponent
            onEdit={onEdit}
            onDelete={onDelete}
            data={originData[activeTab].data}
          />
        </div>
      </section>
      <PatternModal ref={patternModalRef} onFinish={onFinishPatternModal} />
      <TradeModal ref={tradeModalRef} onFinish={onFinishTradeModal} />
    </main>
  ) : (
    <LoadingComponent />
  );
}
