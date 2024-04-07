import React, {useEffect, useState} from 'react';
import {Pagination, Skeleton} from "@mui/material";
import {ClientService} from "../../services/ClientService";
import {DataGrid} from "@mui/x-data-grid";
import {useParams} from "react-router-dom";
import moment from "moment/moment";
import ClientCard2 from "../../components/ClientCard2";

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
            {field: 'product', headerName: 'Наименование', flex: 1, renderCell: (params: any)=> params.row.product.title},
            {field: 'created_at', headerName: 'Дата', flex: 1, renderCell: (params: any)=> moment(params.row.created_at).format('DD/MM/YY')},
            {field: 'price', headerName: 'Цена', flex: 1, renderCell: (params: any)=> `${params.row.price} сом`},
        ],
        columns1: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'product', headerName: 'Наименование', flex: 1, renderCell: (params: any)=> params.row.product.title},
            {field: 'category', headerName: 'Категория', flex: 1, renderCell: (params: any)=> params.row.product.category?.name},
            {field: 'sample_number', headerName: 'Проба', flex: 1, renderCell: (params: any)=> params.row.product.sample_number},
            {field: 'price', headerName: 'Цена', flex: 1, renderCell: (params: any)=> `${params.row.price} сом`},
            {field: 'created_at', headerName: 'Дата покупки', flex: 1, renderCell: (params: any)=> moment(params.row.created_at).format('DD/MM/YY')},
            {field: 'end_date', headerName: 'Дата окончания', flex: 1, renderCell: (params: any)=> moment(params.row.end_date).format('DD/MM/YY')},
        ],
    });

    const client = ClientService.GetClient(id)

    const tableList = ClientService.GetPurchasesList(id, table.filter)
    const tableList1 = ClientService.GetDefersList(id, table.filter1)

    useEffect(() => {
        if (!tableList.loading && !tableList.error) {
            const data = tableList.result?.data;

            setTable((prevState: any) => ({
                ...prevState,
                rows: [].concat(...data.results.map((item: any)=> item.products.map((product: any)=> {
                    const obj = {...product, ...item}
                    delete obj.products
                    return obj
                }))),
                filter: {
                    ...prevState.filter,
                    page: data.current_page,
                    total_pages: data.total_pages,
                },
                selectedRows: []
            }));
        }
    }, [tableList.loading, tableList.error, tableList.result?.data]);
    useEffect(() => {
        if (!tableList1.loading && !tableList1.error) {
            const data = tableList1.result?.data;
            setTable((prevState: any) => ({
                ...prevState,
                rows1: [].concat(...data.results.map((item: any)=> item.products.map((product: any)=> {
                    const obj = {...product, ...item}
                    delete obj.products
                    return obj
                }))),
                filter1: {
                    ...prevState.filter,
                    page: data.current_page,
                    total_pages: data.total_pages,
                },
                selectedRows: []
            }));
        }
    }, [tableList1.loading, tableList1.error, tableList1.result?.data]);


    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр информации клиента</h1>
            </div>

            {client.loading
                ?
                <>
                    <div className="w-full flex flex-col justify-start items-start gap-[80px]">
                        <Skeleton variant='rectangular' width={'100%'} height={'253px'}/>
                        <Skeleton variant='rectangular' width={'100%'} height={'453px'}/>
                        <Skeleton variant='rectangular' width={'100%'} height={'453px'}/>
                    </div>
                </>
                : client.error
                    ? client.error.message
                    :
                    <>
                        <div className="w-full mb-[20px]">
                            <ClientCard2 clientInfo={client.result?.data}/>
                        </div>
                        <div className="px-[30px] py-[20px] bg-white rounded-[10px] flex justify-start items-start gap-[30px] mb-[60px] shadow-md">
                            <div className='flex flex-col justify-center items-start gap-[10px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Примечание:</p>
                                <p className='text-[#2A2826] text-[16px] font-[500]'>{client.result?.data.note}</p>
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
                                                <p className='text-[#2A2826] text-[10px] font-[500]'>Показать в
                                                    таблице</p>
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
                                                <p className='text-[#2A2826] text-[10px] font-[500]'>Показать в
                                                    таблице</p>
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
                    </>
            }
        </>
    );
}
