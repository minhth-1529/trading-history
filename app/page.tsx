'use client';
import React, { useEffect, useRef, useState } from "react";
import { fetchData, handlePutData } from "@/lib/axiosData";
import EntryModal, { TAddNewRef } from "@/components/modal/EntryModal";
import PatternModal, { TPatternModal } from "@/components/modal/PatternModal";
import { FloatButton, Form, Input, message, Tabs } from "antd";
import { ICondition, IDataType, SUMMARY_ENUM, TOriginDataType } from "@/module/interface";
import { assign, get, head, isNil, orderBy, startCase, sumBy, unionBy, values } from "lodash";
import dayjs from "dayjs";
import { fetchPattern, handlePutPattern } from "@/lib/axiosTabs";
import PatternComponent, { TargetKey } from "@/components/Tabs";
import axios from "axios";
import TableComponent from "@/components/Table";
import { produce } from "immer";
import { PlusOutlined } from "@ant-design/icons";
import LoadingComponent from "@/components/Loading";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "qs";

export default function RootPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryPattern = searchParams.get('pattern');
  const querySummary = searchParams.get('summary');
  // ---------- ref ----------
  const tradeModalRef = useRef<TAddNewRef>(null);
  const patternModalRef = useRef<TPatternModal>(null);
  const [formRef] = Form.useForm<ICondition>();

  // ---------- state ----------
  const [apiLoading, setApiLoading] = useState<boolean>(true);
  const [queryLoading, setQueryLoading] = useState<boolean>(true);
  // ---------- data ----------
  const [originData, setOriginData] = useState<TOriginDataType>({});

  // ---------- pattern ----------
  const [patternData, setPatternData] = useState<string[]>([]);
  const [activePattern, setActivePattern] = useState<string>('123BO');

  // ---------- summary ----------
  const [activeSummary, setActiveSummary] = useState<SUMMARY_ENUM>(SUMMARY_ENUM.STATISTICAL);

  // ---------- code ----------

  const axiosPutData = (originData: TOriginDataType) => {
    setOriginData(originData);
    handlePutData(originData)
      .then()
      .catch((err) => console.log(err));
  };

  const axiosPutPattern = (value: string[]) => {
    setPatternData(value);
    handlePutPattern(value)
      .then()
      .catch((err) => console.log(err));
  };

  const onFinishTradeModal = (value: IDataType) => {
    const values = unionBy([assign(value, { date: dayjs(value.date).format() })], originData[activePattern][activeSummary], 'id');

    const originValues = produce(originData, (draft) => {
      draft[activePattern][activeSummary] = values;
    });

    axiosPutData(originValues);
  };

  const onFinishPatternModal = (value: string) => {
    if (patternData.includes(value)) {
      return message.error('Can not the some already Pattern').then();
    }

    const values = [...patternData, value];

    const data = {
      ...originData,
      [value]: {
        condition: '',
        [SUMMARY_ENUM.STATISTICAL]: [],
        [SUMMARY_ENUM.BACK_TEST]: []
      }
    };

    axiosPutData({ ...originData, ...data });
    axiosPutPattern(values);
  };

  const removePattern = (targetKey: TargetKey) => {
    if (patternData.length === 1) {
      message.error('Can not delete the last one!').then();
    }

    let newActiveKey = activePattern;
    let lastIndex = -1;

    patternData.forEach((item, i) => {
      if (item === targetKey) {
        lastIndex = i - 1;
      }
    });

    const newTabsData = patternData.filter((item) => item !== targetKey);

    if (newTabsData.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newTabsData[lastIndex];
      } else {
        newActiveKey = newTabsData[0];
      }
    }

    const data = { ...originData };

    delete data[targetKey as string];

    axiosPutData(data);
    axiosPutPattern(newTabsData);

    setActivePattern(newActiveKey);
    formRef.setFieldValue('condition', data[newActiveKey].condition);
  };

  const onTableDelete = (id: string) => {
    const data = produce(originData, (draft) => {
      draft[activePattern][activeSummary] = draft[activePattern][activeSummary].filter((item) => item.id !== id);
    });

    axiosPutData(data);
  };

  const onTableEdit = (record: IDataType) => {
    if (tradeModalRef.current) tradeModalRef.current.edit(record);
  };

  const onAddCondition = (value: ICondition) => {
    const { condition } = value;
    formRef.setFieldValue('condition', condition);

    const data = produce(originData, (draft) => {
      draft[activePattern].condition = condition;
    });

    axiosPutData(data);
  };

  const onReplaceQueryParams = (pattern: string | null, summary: string | null) => {
    const query = qs.stringify({
      pattern: pattern ?? activePattern,
      summary: summary ?? activeSummary
    });

    router.replace(`?${query}`);
  };

  const onPatternChange = (value: string) => {
    setActivePattern(value);
    onReplaceQueryParams(value, null);
    formRef.setFieldValue('condition', originData[value].condition);
  };

  const onPatternEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
    if (action === 'add') {
      patternModalRef.current && patternModalRef.current.addNew();
    } else {
      removePattern(targetKey);
    }
  };

  // fetch data
  useEffect(() => {
    axios.all([fetchData(), fetchPattern()]).then(
      axios.spread((data, tabData) => {
        const originData = get(data, 'data.record', {});
        const tabsData = get(tabData, 'data.record', []);

        setOriginData(originData);
        setPatternData(tabsData);

        formRef.setFieldValue('condition', originData[tabsData.at(0)].condition);

        setApiLoading(false);
      })
    );
  }, []);

  useEffect(() => {
    if (isNil(queryPattern) || isNil(querySummary)) {
      router.replace(`?${qs.stringify({ pattern: '123BO', summary: SUMMARY_ENUM.STATISTICAL })}`);
    } else {
      setActivePattern(queryPattern);
      setActiveSummary(querySummary as SUMMARY_ENUM);
    }

    setQueryLoading(false);
  }, [queryPattern, querySummary]);

  return !apiLoading && !queryLoading ? (
    <main className="max-w-screen-3xl relative mx-auto px-4 py-10  md:py-10">
      <section>
        <FloatButton
          onClick={() =>
            tradeModalRef.current &&
            tradeModalRef.current.addNew(
              dayjs(
                get(
                  head(orderBy(originData[activePattern][activeSummary], [(item) => new Date(dayjs(item.date).toISOString())], ['desc'])),
                  'date',
                  dayjs()
                )
              )
            )
          }
          icon={<PlusOutlined />}
          type="primary"
          style={{ right: 20, bottom: 20 }}
        />
      </section>
      <section>
        <Form form={formRef} onFinish={onAddCondition}>
          <Form.Item name={'condition'}>
            <Input.TextArea autoSize rows={4} placeholder="Enter Condition" bordered={true} onBlur={formRef.submit} />
          </Form.Item>
        </Form>
      </section>
      <section className={'flex w-full'}>
        <Tabs
          activeKey={activeSummary}
          className={'pt-[50px]'}
          onChange={(value) => {
            onReplaceQueryParams(null, value);
            setActiveSummary(value as SUMMARY_ENUM);
          }}
          tabPosition={'left'}
          items={values(SUMMARY_ENUM).map((item) => ({
            label: startCase(item),
            key: item
          }))}
        />
        <div className={'w-full'}>
          <div>
            <PatternComponent data={patternData} activePattern={activePattern} onPatternChange={onPatternChange} onPatternEdit={onPatternEdit} />
          </div>
          <div className={'rounded-2 mb-5 bg-gray-100'}>
            <div className={'mx-auto p-4'}>
              <div>
                <dl className="mb-0 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
                    <dt className="truncate text-sm font-medium text-gray-500">Total</dt>
                    <dd className="mb-0 mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                      {sumBy(originData[activePattern][activeSummary], 'tp')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
          <div className={'w-full'}>
            <TableComponent onEdit={onTableEdit} onDelete={onTableDelete} data={originData[activePattern][activeSummary]} />
          </div>
        </div>
      </section>
      <PatternModal ref={patternModalRef} onFinish={onFinishPatternModal} />
      <EntryModal ref={tradeModalRef} onFinish={onFinishTradeModal} />
    </main>
  ) : (
    <LoadingComponent />
  );
}
