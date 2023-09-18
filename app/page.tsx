'use client'
import {Button, DatePicker, Form, Image, Input, InputNumber, Modal, Select, Table} from "antd";
import {ColumnsType} from "antd/es/table";
import {assign, upperCase, values} from "lodash";
import {ORDER_ENUM, orderColor, PAIR_ENUM} from "@/module/constants";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
import cls from 'classnames'
import {useLocalStorage} from 'react-use';
import stringToHexColor from "@/app/util/stringToHexColor";
import * as fs from 'fs';

interface DataType {
    id: string;
    pair: PAIR_ENUM;
    order: ORDER_ENUM;
    date: string,
    tp: number,
    rule: boolean,
    img: string,
}


const columns: ColumnsType<DataType> = [
    {
        title: 'Pair',
        dataIndex: 'pair',
        key: 'pair',
        width: 150,
        render: (value) => <span
            className={'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium text-white'}
            style={{backgroundColor: stringToHexColor(value) as string}}>{value.toLocaleUpperCase()}</span>,
    },
    {
        title: 'Order',
        dataIndex: 'order',
        key: 'order',
        width: 150,
        render: value => <span
            className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium  ${orderColor[value as ORDER_ENUM]}`}
        >{upperCase(value)}</span>
    },
    {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: value => dayjs(value).format('DD/MM/YYYY HH:mm')
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
        render: value => <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${value ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'}`}>{value ? 'True' : 'False'}</span>,
    },
    {
        title: 'Image',
        dataIndex: 'img',
        key: 'image',
        render: value => value ? <Image
            width={50}
            preview={true}
            src={value}
        /> : null
    }
];

export default function Home() {
    const [form] = Form.useForm<DataType>();
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useLocalStorage<string>('data', '')
    const [data, setData] = useState<DataType[]>([])


    const onFinish =  (value: DataType) => {
        const values = [assign(value, {date: dayjs(value.date).format()}),...data]
        setData(values)
        fs.writeFile(`data.json`, JSON.stringify(values), function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(`roles.constant.ts was downloaded and generated!`);
        });
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
            <div className={'flex justify-end mb-5'}><Button onClick={() => setOpen(true)} type={'primary'}>Add</Button></div>
            <Table columns={columns} rowKey={'id'} dataSource={data}/>
            <Modal
                title={'Add New'}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={form.submit}
                afterClose={afterClose}
            >
                <Form onFinish={onFinish} form={form} labelCol={{span: 6}}
                      wrapperCol={{span: 18}}>
                    <Form.Item hidden={true} name='id' initialValue={uuidv4()}>
                        <Input/>
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'This field is required'}]} label={'Pair'} name={'pair'}>
                        <Select
                            options={values(PAIR_ENUM).map(item => ({
                                label: <span
                                    className={'items-center inline-flex rounded-md  px-2 py-1 text-xs font-medium text-white'}
                                    style={{backgroundColor: stringToHexColor(item) as string}}>{item.toLocaleUpperCase()}</span>,
                                value: item
                            }))}
                        />
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'This field is required'}]} label={'Order'} name={'order'}>
                        <Select options={values(ORDER_ENUM).map(item => ({
                            label: <span
                                className={`items-center inline-flex  rounded-md px-2 py-1 text-xs font-medium ${orderColor[item as ORDER_ENUM]}`}
                            >{upperCase(item)}</span>,
                            value: item
                        }))}/>
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'This field is required'}]} label={'Date'} name={'date'}>
                        <DatePicker showTime={{ format: 'HH:mm' }}
                                    format="YYYY/MM/DD HH:mm" className={'w-full'}/>
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'This field is required'}]} label={'Take Profit'} name={'tp'}>
                        <InputNumber className={'!w-full'}/>
                    </Form.Item>
                    <Form.Item rules={[{required: true, message: 'This field is required'}]} label={'Rule'} name={'rule'}>
                        <Select options={[{label: <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700`}>True</span>, value: true}, {label: <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-rose-100 text-rose-700`}>False</span>, value: false}]}/>
                    </Form.Item>
                    <Form.Item label={'Image'} name={'img'}>
                        <Input/>
                    </Form.Item>
                </Form>
            </Modal>
        </main>
    )
}
