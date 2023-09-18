'use client'
import {Button, DatePicker, Form, Input, InputNumber, Modal, Select, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {assign, upperCase, values} from "lodash";
import {ORDER_ENUM, PAIR_ENUM} from "@/module/constants";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
import cls from 'classnames'
import {useLocalStorage} from 'react-use';
import stringToHexColor from "@/app/util/stringToHexColor";

interface DataType {
    id: string;
    pair: PAIR_ENUM;
    order: ORDER_ENUM;
    date: string,
    tp: number,
    rule: boolean
}

const columns: ColumnsType<DataType> = [
    {
        title: 'Pair',
        dataIndex: 'pair',
        key: 'pair',
        width: 100,
        render: (value) => <span
            className={'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium text-white'}
            style={{backgroundColor: stringToHexColor(value) as string}}>{value.toLocaleUpperCase()}</span>,
    },
    {
        title: 'Order',
        dataIndex: 'order',
        key: 'order',
        render: value => <span
            className={'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium text-white'}
            style={{backgroundColor: stringToHexColor(value) as string}}>{upperCase(value)}</span>
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: value => dayjs(value).format('DD/MM/YYYY')
    },
    {
        title: 'TP',
        dataIndex: 'tp',
        key: 'tp',
        render: value => <span
            className={cls('inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium', {'bg-green-100 text-green-700': value > 0}, {'bg-red-100 text-red-700': value < 0})}>{value}</span>
    },
    {
        title: 'Rule',
        dataIndex: 'rule',
        key: 'rule',
        render: value =><span>{value ? 'True' : 'False'}</span>
    }
];

export default function Home() {
    const [form] = Form.useForm<DataType>();
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useLocalStorage<string>('data', '')
    const [data, setData] = useState<DataType[]>([])


    const onFinish = (value: DataType) => {
        const values = [...data,assign(value, {date: dayjs(value.date).format()})]
        setData(values)
        setValue(JSON.stringify(values))
        setOpen(false)
    }

    useEffect(() => {
        if (value) {
            setData(JSON.parse(value))
        }
    }, [value]);


    const afterClose = () => {
        form.resetFields();
    }

    return (
        <main className="p-5">
            <Button onClick={() => setOpen(true)} type={'primary'}>Add</Button>
            <Table columns={columns} rowKey={'id'} dataSource={data}/>
            <Modal
                title={'Add New'}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={form.submit}
                afterClose={afterClose}
            >
                <Form onFinish={onFinish} form={form} labelCol={{span: 4}}
                      wrapperCol={{span: 20}}>
                    <Form.Item hidden={true} name='id' initialValue={uuidv4()}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={'Pair'} name={'pair'}>
                        <Select
                            options={values(PAIR_ENUM).map(item => ({
                                label: item.toLocaleUpperCase(),
                                value: item
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label={'Order'} name={'order'}>
                        <Select options={values(ORDER_ENUM).map(item => ({
                            label: upperCase(item),
                            value: item
                        }))}/>
                    </Form.Item>
                    <Form.Item label={'Date'} name={'date'}>
                        <DatePicker format={'DD/MM/YYYY'} className={'w-full'}/>
                    </Form.Item>
                    <Form.Item label={'Take Profit'} name={'tp'}>
                        <InputNumber className={'!w-full'}/>
                    </Form.Item>
                    <Form.Item label={'Rule'} name={'rule'}>
                        <Select options={[{label: 'True', value: true}, {label: 'False', value: false}]}/>
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    )
}
