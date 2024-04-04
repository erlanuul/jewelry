import React, {useState} from 'react';
import {IconButton, Modal, Skeleton} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate, useParams} from "react-router-dom";
import {DeferService} from "../../services/DeferService";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment/moment";
import RestoreIcon from '@mui/icons-material/Restore';
import {CustomRoundedButton} from "../../helpers/muiCustomization";

const modalInitialValues = {
    open: false,
}


export default function DeferView() {
    const navigate = useNavigate()
    const {id} = useParams()
    const [modal, setModal] = useState<any>(modalInitialValues)

    const defer = DeferService.GetDefer(id)

    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false
    };

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр информации о рассрочке</h1>
            </div>
            {defer.loading
                ?
                <>
                    <div className='w-full flex justify-start items-start mb-[45px]'>
                        <Skeleton variant="rectangular" width={'100%'} height={213}/>
                    </div>
                    <Skeleton variant="rectangular" width={'100%'} height={500}/>
                </>
                : defer.error
                    ? defer.error.message
                    :
                    <>
                        <div
                            className='w-full px-[30px] py-[20px] bg-white rounded-[10px] flex justify-start items-start gap-[30px] mb-[30px]'>
                            <div className='w-[150px] h-[150px] bg-center bg-cover rounded-[10px] cursor-pointer'
                                 style={{backgroundImage: `url(${defer.result?.data.client?.images.length > 0 ? defer.result?.data.client?.images[0].image : ''})`}}
                                 onClick={() => {
                                     setModal({
                                         ...modal,
                                         open: true,
                                         action: 'viewSlider'
                                     })
                                 }}
                            >
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>ФИО:</p>
                                <p className='text-[#2A2826] text-[16px] font-[900]'>{defer.result?.data.client?.full_name}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Платежеспособность:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{defer.result?.data.client?.solvency ? 'Да' : 'Нет'}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>ИНН:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{defer.result?.data.client?.inn}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Номер телефона:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{defer.result?.data.client?.phone}</p>
                            </div>
                            <div className='flex flex-col justify-center items-start gap-[10px] mt-[40px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Адрес:</p>
                                <p className='text-[#2A2826] text-[16px] font-[400]'>{defer.result?.data.client?.address}</p>
                            </div>
                        </div>
                        <div
                            className=" px-[30px] py-[20px] bg-white rounded-[10px] flex justify-start items-start gap-[30px] mb-[60px]">
                            <div className='flex flex-col justify-center items-start gap-[10px]'>
                                <p className='text-[#6E6C6A] text-[12px] font-[500]'>Примечание:</p>
                                <p className='text-[#2A2826] text-[16px] font-[500]'>{defer.result?.data.client?.note}</p>
                            </div>
                        </div>

                        <div className='w-full flex justify-between items-center mb-[30px]'>
                            <h1 className="text-[#2A2826] text-[24px] font-[700]">Товары</h1>

                            <CustomRoundedButton
                                variant='contained'
                                startIcon={<RestoreIcon/>}
                                onClick={() => {
                                    setModal({
                                        ...modalInitialValues,
                                        open: true,
                                        action: 'viewPayments',
                                    })
                                }}
                            >
                                История выплат
                            </CustomRoundedButton>
                        </div>

                        <div className='w-full rounded-[10px] mb-[90px]'>
                            <DataGrid
                                rows={[...defer.result?.data.products]}
                                columns={[
                                    {field: 'id', headerName: 'ID', flex: 1},
                                    {
                                        field: 'title',
                                        headerName: 'Наименование',
                                        flex: 1,
                                        renderCell: (params: any) => params.row.product?.title
                                    },
                                    {
                                        field: 'created_at',
                                        headerName: 'Дата покупки',
                                        flex: 1,
                                        renderCell: (params: any) => moment(defer.result?.data.created_at).format('DD.MM.YY')
                                    },
                                    {
                                        field: 'end_date',
                                        headerName: 'Дата окончания',
                                        flex: 1,
                                        renderCell: (params: any) => moment(defer.result?.data.end_date).format('DD.MM.YY')
                                    },
                                    {field: 'price', headerName: 'Сумма', flex: 1},
                                    {
                                        field: 'remains',
                                        headerName: 'Остаток',
                                        flex: 1,
                                        renderCell: (params: any) => params.row.product?.remains
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
                                        <div className='w-full flex justify-end items-center py-[20px] px-[20px]'>


                                            <div className='flex flex-col justify-start items-end gap-[5px]'>
                                                <p className='text-[#2A2826] text-[14px] font-[500]'>
                                                    Общая сумма долга
                                                </p>
                                                <p className='text-[#2A2826] text-[30px] font-[800]'>
                                                    {defer.result?.data.total_remains} сом
                                                </p>
                                            </div>
                                        </div>
                                }}
                            />
                        </div>

                        <Modal open={modal.open} onClose={() => setModal({
                            ...modal,
                            open: false
                        })}>
                            {modal.action === 'viewPayments'
                                ?
                                <div className='mainModal w-full' style={{maxWidth: 'calc(100% - 100px)', padding: '50px',}}>
                                    <h1 className='text-[#2A2826] text-[24px] font-[700] mb-[30px]'>
                                        Выплаты
                                    </h1>
                                    <div className='w-full rounded-[10px] mb-[90px]'>
                                        <DataGrid
                                            rows={[...defer.result?.data.payments.results]}
                                            columns={[
                                                {field: 'id', headerName: 'ID', flex: 1},
                                                {
                                                    field: 'title',
                                                    headerName: 'Наименование',
                                                    flex: 1,
                                                    renderCell: (params: any) => params.row.product?.title
                                                },
                                                {
                                                    field: 'created_at',
                                                    headerName: 'Дата выплаты',
                                                    flex: 1,
                                                    renderCell: (params: any) => moment(defer.result?.data.created_at).format('DD.MM.YY')
                                                },
                                                {
                                                    field: 'amount',
                                                    headerName: 'Сумма',
                                                    flex: 1,
                                                },
                                                {field: 'payment_type', headerName: 'Тип оплаты', flex: 1},
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
                                                        className='w-full flex justify-end items-center py-[20px] px-[20px]'>


                                                        <div
                                                            className='flex flex-col justify-start items-end gap-[5px]'>
                                                            <p className='text-[#2A2826] text-[14px] font-[500]'>
                                                                Общая  сумма выплат
                                                            </p>
                                                            <p className='text-[#2A2826] text-[30px] font-[800]'>
                                                                {defer.result?.data.payments.total_amount} сом
                                                            </p>
                                                        </div>
                                                    </div>
                                            }}
                                        />
                                    </div>
                                </div>
                                :
                                <div className='modalSlider'>
                                    <Slider {...settings}>
                                        {defer.result?.data.client?.images.map((item: any, index: number) => (
                                            <div key={index}>
                                                <div
                                                    className='max-w-[756px] h-[420px] bg-center bg-cover rounded-[10px]'
                                                    style={{backgroundImage: `url(${item.image})`}}
                                                >
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            }
                        </Modal>
                    </>
            }
        </>
    );
}
