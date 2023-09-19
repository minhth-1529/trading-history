'use client'
import {Button, DatePicker, Dropdown, Form, Image, Input, InputNumber, message, Modal, Select, Table} from "antd";
import {assign, get, isEmpty, upperCase, values} from "lodash";
import {ORDER_ENUM, orderColor, PAIR_ENUM} from "@/module/constants";
import {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';
import dayjs from "dayjs";
import cls from 'classnames'
import stringToHexColor from "@/app/util/stringToHexColor";
import axios from 'axios'
import {DeleteOutlined, EllipsisOutlined} from "@ant-design/icons";

interface DataType {
    id: string;
    pair: PAIR_ENUM;
    order: ORDER_ENUM;
    date: string,
    tp: number,
    rule: boolean,
    img: string,
}

const ID = "650979ed205af66dd4a181ec"
const MASTER_KEY = "$2a$10$Rd9ABgmUvpzCCwSfjzxR6ukTEBj4b/bJZGs6ctH71iQIuD.ab9HUa"
const ACCESS_KEY = '$2a$10$JKp2TKlikrln7C6stCJ4d.OdA0EiPUOP.JgLng2KzwBtXGw0X7BLq'

const headers = {
    "Content-Type": "application/json",
    "X-Master-Key": MASTER_KEY,
    "X-ACCESS-KEY": ACCESS_KEY
}

const fetchData = async () =>{
    return axios.get(`https://api.jsonbin.io/v3/b/${ID}`, {headers})
}

const updateData = async (data: DataType[]) =>{
    await axios.put(`https://api.jsonbin.io/v3/b/${ID}`, data, {
        headers
    }).then(res=>console.log(res)).catch(err=>console.log(err))
}

const handleUpdate = (data: DataType[]) =>{
    updateData(data).then()
}

export default function Home() {
    const [form] = Form.useForm<DataType>();
    const [loading,setLoading] = useState<boolean>(true)
    const [open, setOpen] = useState<boolean>(false)
    const [data, setData] = useState<DataType[]>([])

    const onFinish =  (value: DataType) => {
        const values = [assign(value, {date: dayjs(value.date).format()}),...data]

        setData(values)
        handleUpdate(values)
        setOpen(false)
    }

    const handleDelete = (id: string)=>{
        const value = data.filter(item=>item.id !== id)

        if (isEmpty(value)){
            return message.error('Can not delete the last one!').then()
        }


        setData(value)
        handleUpdate(value)
        
    }

    const afterClose = () => {
        form.resetFields();
    }

    useEffect(() => {
        fetchData().then(res=> {
            setData(get(res,'data.record',[]))
            setLoading(false)
        });
    }, []);


    return !loading ? (
        <main className="p-5">
            <div className={'flex justify-end mb-5'}><Button onClick={() => setOpen(true)} type={'primary'}>Add</Button></div>
            <Table columns={[
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
                        width={100}
                        preview={true}
                        src={value}
                    /> : null
                },
                {
                    title: 'Action',
                    key: 'action',
                    render: (_,record)=>{
                        return <Dropdown trigger={['click']} menu={{items: [
                                {
                                    key: 'delete',
                                    label: 'Delete',
                                    icon: <DeleteOutlined />,
                                    onClick: ()=>handleDelete(record.id),
                                    danger: true
                                }
                            ]}} placement="bottomRight" arrow={{ pointAtCenter: true }}>
                            <span className={'inline-flex w-8 h-8 items-center justify-center cursor-pointer'}><EllipsisOutlined /></span>
                        </Dropdown>
                    }
                }
            ]} rowKey={'id'} dataSource={data}/>
            <Modal
                destroyOnClose={true}
                title={'Add New'}
                open={open}
                onCancel={() => setOpen(false)}
                onOk={form.submit}
                afterClose={afterClose}
            >
                <Form onFinish={onFinish} form={form} labelCol={{span: 6}}
                      wrapperCol={{span: 18}}>
                    <Form.Item hidden={true} name='id' initialValue={uuidv4()}>
                        <Input />
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
    ) : (
        <div className={'w-full h-full flex items-center justify-center'}>
        <span className="w-8 h-8 inline-block border-4 border-dashed rounded-full animate-spin-slow dark:border-violet-400"></span>
        </div>
    )
}
