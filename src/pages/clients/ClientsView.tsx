import React, {useEffect, useState} from 'react';
import {Modal, Pagination} from "@mui/material";
import {ClientService} from "../../services/ClientService";
import {DataGrid} from "@mui/x-data-grid";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useParams} from "react-router-dom";

const modalInitialValues= {
    values: {
        id: '',
        full_name: '',
        phone: '',
        address: '',
        solvency: '',
        inn: '',
        note: '',
        images:[
            {
                image: null,
            },
            {
                image: null
            },
            {
                image: null
            },
            {
                image: null
            },
        ]
    },
    validation: {
        error: {
            full_name: false,
            phone: false,
            address: false,
            solvency: false,
            inn: false,
            note: false,
        },
        message: {
            full_name: '',
            phone: '',
            address: '',
            solvency: '',
            inn: '',
            note: '',
        },
    },
    open: false,
}

const tableInitialValues = {
    rows: [],
    rows1: [],
    filter: {
        page: 1,
        limit: 20,
        total_pages: 1,
    },
    filter1: {
        page: 1,
        limit: 20,
        total_pages: 1,
    },
};


export default function ClientsView() {
    const {id} = useParams()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'full_name', headerName: 'ФИО', flex: 1},
            {field: 'address', headerName: 'Адрес', flex: 1},
            {field: 'phone', headerName: 'Номер телефона', flex: 1},
        ],
        columns1: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'full_name', headerName: 'ФИО', flex: 1},
            {field: 'address', headerName: 'Адрес', flex: 1},
            {field: 'phone', headerName: 'Номер телефона', flex: 1},
        ],
    });
    const [modal, setModal] = useState<any>(modalInitialValues)

    const tableList = ClientService.GetClientList(table.filter)

    useEffect(() => {
        if (!tableList.loading && !tableList.error) {
            const data = tableList.result?.data;
            setTable((prevState: any) => ({
                ...prevState,
                rows: data.results,
                filter: {
                    ...prevState.filter,
                    page: data.current_page,
                    total_pages: data.total_pages,
                },
                selectedRows: []
            }));
        }
    }, [tableList.loading, tableList.error, tableList.result?.data]);


    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false
    };

    useEffect(() => {
        if(id){
            ClientService.GetClient(id).then((res: any)=>{
                setModal({
                    ...modal,
                    values:{
                        ...modal.values,
                        ...res.data
                    }
                })
            })
        }
    }, [id]);
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр информации клиента</h1>
            </div>
            <div
                className='w-full px-[30px] py-[20px] bg-white rounded-[10px] flex justify-start items-start gap-[30px] mb-[30px]'>
                <div className='w-[150px] h-[150px] bg-center bg-cover rounded-[10px] cursor-pointer'
                     style={{backgroundImage: `url(${modal.values.images.length > 0 ? modal.values.images[0].image : ''})`}}
                     onClick={() => {
                         setModal({
                             ...modal,
                             open: true
                         })
                     }}
                >
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>ФИО:</p>
                    <p className='text-[#2A2826] text-[16px] font-[900]'>{modal.values.full_name}</p>
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Платежеспособность:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{modal.values.solvency ? 'Да' : 'Нет'}</p>
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>ИНН:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{modal.values.inn}</p>
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Номер телефона:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{modal.values.phone}</p>
                </div>
                <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Адрес:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{modal.values.address}</p>
                </div>
            </div>
            <div
                className=" px-[30px] py-[20px] bg-white rounded-[10px] flex justify-start items-start gap-[30px] mb-[60px]">
                <div className='flex flex-col justify-center items-start gap-[10px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>ФИО:</p>
                    <p className='text-[#2A2826] text-[16px] font-[500]'>{modal.values.note}</p>
                </div>
            </div>

            <h1 className="text-[#2A2826] text-[24px] font-[700] mb-[30px]">История покупок</h1>

            <div className='w-full rounded-[10px] mb-[90px]'>
                <DataGrid
                    rows={table.rows}
                    columns={table.columns}
                    disableColumnFilter
                    disableRowSelectionOnClick
                    filterMode='server'
                    autoHeight
                    rowHeight={80}
                    loading={tableList.loading}
                    slots={{
                        footer: () => (
                            <div className='w-full flex justify-between items-center py-[20px] px-[20px]'>
                                <Pagination
                                    count={table.filter.total_pages}
                                    page={table.filter.page}
                                    onChange={(event, value: number) => {
                                        setTable({
                                            ...table,
                                            filter: {
                                                ...table.filter,
                                                page: value,
                                            },
                                        });
                                    }}
                                />

                                <div className='flex flex-col justify-start items-center gap-[5px]'>
                                    <p className='text-[#2A2826] text-[10px] font-[500]'>Показать в таблице</p>
                                    <input
                                        type="number"
                                        className='w-[60px] px-[10px] py-[4px] rounded-[4px] bg-transparent'
                                        style={{border: '1px solid black'}}
                                        value={table.filter.limit}
                                        onChange={(event) => {
                                            setTable({
                                                ...table,
                                                filter: {
                                                    ...table.filter,
                                                    limit: event.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    }}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                />
            </div>

            <h1 className="text-[#2A2826] text-[24px] font-[700] mb-[30px]">История покупок в рассрочку</h1>

            <div className='w-full rounded-[10px] mb-[90px]'>
                <DataGrid
                    rows={table.rows1}
                    columns={table.columns1}
                    disableColumnFilter
                    disableRowSelectionOnClick
                    filterMode='server'
                    autoHeight
                    rowHeight={80}
                    loading={tableList.loading}
                    slots={{
                        footer: () => (
                            <div className='w-full flex justify-between items-center py-[20px] px-[20px]'>
                                <Pagination
                                    count={table.filter1.total_pages}
                                    page={table.filter1.page}
                                    onChange={(event, value: number) => {
                                        setTable({
                                            ...table,
                                            filter1: {
                                                ...table.filter1,
                                                page: value,
                                            },
                                        });
                                    }}
                                />

                                <div className='flex flex-col justify-start items-center gap-[5px]'>
                                    <p className='text-[#2A2826] text-[10px] font-[500]'>Показать в таблице</p>
                                    <input
                                        type="number"
                                        className='w-[60px] px-[10px] py-[4px] rounded-[4px] bg-transparent'
                                        style={{border: '1px solid black'}}
                                        value={table.filter1.limit}
                                        onChange={(event) => {
                                            setTable({
                                                ...table,
                                                filter1: {
                                                    ...table.filter1,
                                                    limit: event.target.value
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    }}
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                />
            </div>

            <Modal open={modal.open} onClose={() => setModal({
                ...modal,
                open: false
            })}>
                <div className='modalSlider'>
                    <Slider {...settings}>
                        {modal.values.images.map((item: any, index: number) => (
                            <div key={index}>
                                <div className='max-w-[756px] h-[420px] bg-center bg-cover rounded-[10px]'
                                     style={{backgroundImage: `url(${item.image})`}}
                                >
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Modal>
        </>
    );
}
