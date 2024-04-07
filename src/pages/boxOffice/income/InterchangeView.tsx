import React from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate, useParams} from "react-router-dom";
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {IconButton, Skeleton} from "@mui/material";
import ClientCard2 from "../../../components/ClientCard2";
import {DataGrid} from "@mui/x-data-grid";
import moment from "moment";
import VisibilityIcon from "@mui/icons-material/Visibility";


export default function InterchangeView() {
    const navigate = useNavigate()
    const {id} = useParams()

    const interchange = BoxOfficeService.GetBoxOfficeInterchange(id)
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр информации обмена</h1>
            </div>

            {interchange.loading
                ?
                <>
                    <div className="w-full flex justify-between items-start gap-[20px] mb-[80px]">
                        <Skeleton variant='rectangular' width={'50%'} height={'253px'}/>
                        <Skeleton variant='rectangular' width={'50%'} height={'253px'}/>
                    </div>
                    <div className="w-full flex justify-between items-start gap-[20px] mb-[50px]">
                        <Skeleton variant='rectangular' width={'50%'} height={'453px'}/>
                        <Skeleton variant='rectangular' width={'50%'} height={'453px'}/>
                    </div>
                    <Skeleton variant='rectangular' width={'100%'} height={'203px'}/>
                </>
                : interchange.error
                    ? interchange.error.message
                    :
                    <>
                        <div className="w-full flex justify-between items-start gap-[20px] mb-[80px]">
                            <div className='w-full flex flex-col justify-start items-start'>
                                <h3 className="text-[24px] text-[#2A2826] font-[700] mb-[30px]">Информация клиента</h3>
                                <ClientCard2 clientInfo={interchange.result?.data.client}/>
                            </div>
                            <div className='flex flex-col justify-start items-start shrink-0'>
                                <h3 className="text-[24px] text-[#2A2826] font-[700] mb-[30px]">Менеджер</h3>
                                <div className='p-[20px] bg-white rounded-[10px] shadow-md min-h-[190px]'>
                                    <div className="flex flex-col justify-start items-start gap-[10px] mt-[40px]">
                                        <p className="text-[#6E6C6A] text-[12px] font-[500]">ФИО</p>
                                        <p className="text-[#2A2826] text-[16px] font-[900]">{interchange.result?.data.manager?.full_name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex justify-between items-start gap-[20px] mb-[50px]">
                            <div className='w-full flex flex-col justify-start items-start'>
                                <h3 className="text-[24px] text-[#2A2826] font-[700] mb-[30px]">Товары клиента</h3>
                                <div className='w-full rounded-[10px]'>
                                    <DataGrid
                                        rows={[...interchange.result?.data.exchange_products]}
                                        columns={[
                                            {field: 'id', headerName: 'ID', flex: 1},
                                            {
                                                field: 'title',
                                                headerName: 'Наименование',
                                                flex: 1,
                                            },
                                            {
                                                field: 'cost_price',
                                                headerName: 'Себестоимость',
                                                flex: 1,
                                            },

                                        ]}
                                        disableColumnFilter
                                        disableRowSelectionOnClick
                                        filterMode='server'
                                        autoHeight
                                        rowHeight={80}
                                        initialState={{
                                            columns: {
                                                columnVisibilityModel: {
                                                    id: false,
                                                },
                                            },
                                        }}
                                        slots={{
                                            footer: () =>
                                                <div
                                                    className='w-full flex justify-between items-center py-[20px] px-[20px]'>
                                                    <p className='text-[#6E6C6A] text-[14px] font-[600]'>
                                                        Количество товаров: {interchange.result?.data.exchange_products.length}
                                                    </p>
                                                    <p className='text-[#2A2826] text-[16px] font-[700]'>
                                                        Итого: {[...interchange.result?.data.exchange_products].reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.cost_price), 0)} сом
                                                    </p>
                                                </div>
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='w-full flex flex-col justify-start items-start'>
                                <h3 className="text-[24px] text-[#2A2826] font-[700] mb-[30px]">Товары магазина</h3>
                                <div className='w-full rounded-[10px]'>
                                    <DataGrid
                                        rows={[...interchange.result?.data.products]}
                                        columns={[
                                            {field: 'id', headerName: 'ID', flex: 1},
                                            {
                                                field: 'barcode',
                                                headerName: 'Код товара',
                                                flex: 1,
                                                renderCell: (params: any)=> params.row.product?.barcode
                                            },
                                            {
                                                field: 'price',
                                                headerName: 'Цена',
                                                flex: 1,
                                            },
                                            {
                                                field: 'actions',
                                                headerName: 'Действия',
                                                width: 120,
                                                renderCell: (params: any) => (
                                                    <div className='w-full flex items-center justify-center'>
                                                        <IconButton color="secondary" onClick={() => {
                                                            navigate({
                                                                pathname: `/products/${params.row.product?.id}`
                                                            })
                                                        }}>
                                                            <VisibilityIcon style={{color: "#B9B9B9"}}/>
                                                        </IconButton>
                                                    </div>
                                                )
                                            },
                                        ]}
                                        disableColumnFilter
                                        disableRowSelectionOnClick
                                        filterMode='server'
                                        autoHeight
                                        rowHeight={80}
                                        initialState={{
                                            columns: {
                                                columnVisibilityModel: {
                                                    id: false,
                                                },
                                            },
                                        }}
                                        slots={{
                                            footer: () =>
                                                <div
                                                    className='w-full flex justify-between items-center py-[20px] px-[20px]'>
                                                    <p className='text-[#6E6C6A] text-[14px] font-[600]'>
                                                        Количество
                                                        товаров: {interchange.result?.data.products.length}
                                                    </p>
                                                    <p className='text-[#2A2826] text-[16px] font-[700]'>
                                                        Итого: {[...interchange.result?.data.products].reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.price), 0)} сом
                                                    </p>
                                                </div>
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-between items-start pt-[24px]"
                             style={{borderTop: '4px solid #576ED0'}}>
                            <div className="flex flex-col justify-start items-start gap-[20px]">
                                <p className='text-[#2A2826] text-[18px] font-[400]'>
                                    <b>Дата:</b> {moment(interchange.result?.data.created_at).format('DD/MM/YY')}</p>
                                <p className='text-[#2A2826] text-[18px] font-[400]'><b>Тип
                                    оплаты:</b> {interchange.result?.data.payment_type?.name}</p>
                            </div>
                            <p className='text-[#2A2826] text-[24px] font-[700]'><b>Итого:</b> {interchange.result?.data.total_sum}</p>
                        </div>
                    </>
            }
        </>
    );
}
