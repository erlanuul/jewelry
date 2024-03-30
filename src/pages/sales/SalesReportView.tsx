import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {IconButton, Skeleton} from "@mui/material";
import moment from "moment/moment";
import {SalesService} from "../../services/SalesService";
import {DataGrid} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";


export default function SalesReportView() {
    const navigate = useNavigate()
    const {id} = useParams()

    const sales_report = SalesService.GetSale(id)

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр информации о продаже</h1>
            </div>


            {sales_report.loading
                ?
                <>
                    <div className='w-full flex justify-start items-start mb-[45px]'>
                        <Skeleton variant="rectangular" width={'70%'} height={113}/>
                    </div>
                    <Skeleton variant="rectangular" width={'100%'} height={500}/>
                </>
                : sales_report.error
                    ? sales_report.error.message
                    :
                    <>
                        <div
                            className=' px-[30px] py-[20px] bg-white rounded-[10px] flex justify-start items-end gap-[30px] mb-[30px]'>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>Номер продажи:</p>
                                <p className='text-[#2A2826] text-[30px] font-[700]'>{sales_report.result?.data.id}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Менеджер:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{sales_report.result?.data.manager?.full_name}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Клиент:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{sales_report.result?.data.client?.full_name}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Сумма:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{sales_report.result?.data.total_sum}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Дата:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{moment(sales_report.result?.data.created_at).format('DD.MM.YY')}</p>
                            </div>
                        </div>

                        <div className='w-full rounded-[10px] shadow-md'>
                            <DataGrid
                                rows={[...sales_report.result?.data.products]}
                                columns={[
                                    {field: 'id', headerName: 'ID', flex: 1},
                                    {field: 'product', headerName: 'Наименование', flex: 1, renderCell: (params: any)=> params.row.product.title},
                                    {field: 'price', headerName: 'Цена', flex: 1},
                                    {
                                        field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
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
                                hideFooter
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
                            />
                        </div>
                    </>
            }
        </>
    );
}
