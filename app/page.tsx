'use client';
import React, { useEffect, useRef, useState } from 'react';
import { fetchData, handlePutData } from '@/lib/axiosData';
import TradeModal, { TAddNewRef } from '@/components/modal/TradeModal';
import PatternModal, { TPatternModal } from '@/components/modal/PatternModal';
import { FloatButton, Form, Input, message, Tabs } from 'antd';
import { ICondition, IDataType, SUMMARY_ENUM, TOriginDataType } from '@/module/interface';
import { assign, get, startCase, unionBy, values } from 'lodash';
import dayjs from 'dayjs';
import { fetchPattern, handlePutPattern } from '@/lib/axiosTabs';
import PatternComponent, { TargetKey } from '@/components/Tabs';
import axios from 'axios';
import TableComponent from '@/components/Table';
import { PlusOutlined } from '@ant-design/icons';
import { produce } from 'immer';
import LoadingComponent from '@/components/Loading';

export default function RootPage() {
  // ---------- ref ----------
  const tradeModalRef = useRef<TAddNewRef>(null);
  const patternModalRef = useRef<TPatternModal>(null);
  const [formRef] = Form.useForm<ICondition>();

  // ---------- state ----------
  const [loading, setLoading] = useState<boolean>(true);

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
      return message.error('Can not delete the last one!');
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

  const onTabChange = (value: string) => {
    setActivePattern(value);
    formRef.setFieldValue('condition', originData[value].condition);
  };

  const onTabEdit = (targetKey: TargetKey, action: 'add' | 'remove') => {
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

        setActivePattern(tabsData.at(0));
        formRef.setFieldValue('condition', originData[tabsData.at(0)].condition);

        setLoading(false);
      })
    );
  }, []);

  return !loading ? (
    <main className="relative mx-auto max-w-screen-xl px-4 py-10  md:py-10">
      <section>
        <FloatButton
          onClick={() => tradeModalRef.current && tradeModalRef.current.addNew()}
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
          className={'pt-[50px]'}
          onChange={(value) => setActiveSummary(value as SUMMARY_ENUM)}
          tabPosition={'left'}
          items={values(SUMMARY_ENUM).map((item) => ({
            label: startCase(item),
            key: item
          }))}
        />
        <div className={'w-full'}>
          <div>
            <PatternComponent data={patternData} activePattern={activePattern} onPatternChange={onTabChange} onPatternEdit={onTabEdit} />
          </div>
          <div className={'w-full'}>
            <TableComponent onEdit={onTableEdit} onDelete={onTableDelete} data={originData[activePattern][activeSummary]} />
          </div>
        </div>
      </section>
      <PatternModal ref={patternModalRef} onFinish={onFinishPatternModal} />
      <TradeModal ref={tradeModalRef} onFinish={onFinishTradeModal} />
    </main>
  ) : (
    <LoadingComponent />
  );
}
