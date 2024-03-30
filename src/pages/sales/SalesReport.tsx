import React, {FormEvent, useEffect, useState} from 'react';
import {Button, IconButton, Modal, Pagination, Popover} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useNavigate} from "react-router-dom";
import {SalesService} from "../../services/SalesService";
import moment from "moment/moment";
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import {LoadingButton} from "@mui/lab";
import {CustomRoundedDatePicker} from "../../helpers/muiCustomization";
import {checkModalResponse} from "../../helpers/helpers";
import DownloadIcon from '@mui/icons-material/Download';

const modalInitialValues = {
    values: {
        id: '',
        date_from: null,
        date_to: null,
        reports: [],
        file: null
    },
    validation: {
        error: {
        },
        message: {
        },
    },
    open: false,
    requested: false,
}

const tableInitialValues = {
    rows: [],
    filter: {
        page: 1,
        limit: 20,
        total_pages: 1,
    },
};

export default function SalesReport() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'Номер продажи', flex: 1},
            {field: 'manager', headerName: 'Менеджер', flex: 1, renderCell: (params: any)=>
                    params.row.manager.full_name
            },
            {field: 'client', headerName: 'Клиент', flex: 1, renderCell: (params: any)=>
                    params.row.client.full_name
            },
            {field: 'created_at', headerName: 'Дата', flex: 1, renderCell: (params: any)=>
                    moment(params.row.created_at).format('DD.MM.YY hh:mm')
            },
            {field: 'total_sum', headerName: 'Сумма', flex: 1},
            {
                field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
                    <div className='w-full flex items-center justify-center'>
                        <IconButton color="secondary" onClick={() => {
                            navigate({
                                pathname: `/sales_reports/${params.row.id}`
                            })
                        }}>
                            <VisibilityIcon style={{color: "#B9B9B9"}}/>
                        </IconButton>
                    </div>
                )
            },
        ],
    });
    const [modal, setModal] = useState<any>(modalInitialValues)

    const tableList = SalesService.GetSalesList(table.filter)

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });

        SalesService.GetAllSalesReports({
            date_from: moment(modal.values.date_from?.$d).format('YYYY-MM-DD'),
            date_to: moment(modal.values.date_to?.$d).format('YYYY-MM-DD'),
        }).then((res) => {
            setModal({
                ...modal,
                values:{
                    ...modal.values,
                    reports: res.data.result,
                    file: res.data.file
                },
                open: true,
                requested: false
            })
        }).catch((err) => {
            checkModalResponse(err.response.data, setModal, modal);
        })

    };

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
            }));
        }
    }, [tableList.loading, tableList.error, tableList.result?.data]);



    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Отчет по продажам</h1>

               <div>
                   <Button
                       aria-describedby={id}
                       color='blue'
                       variant='contained'
                       startIcon={<SimCardDownloadIcon/>}
                       onClick={handleClick}
                   >
                       Получить отчет
                   </Button>
                   <Popover
                       id={id}
                       open={open}
                       anchorEl={anchorEl}
                       onClose={handleClose}
                       anchorOrigin={{
                           vertical: 'bottom',
                           horizontal: 'right',
                       }}
                   >
                       <form onSubmit={handleFormSubmit} className='flex items-center gap-[20px] p-[20px] bg-white'>
                           <div className='flex items-center gap-[14px]'>
                               <p className='text-[#2A2826] text-[14px] font-[500]'>От</p>
                               <CustomRoundedDatePicker
                                   value={modal.values.date_from}
                                   onChange={(newValue) => {
                                       setModal({
                                           ...modal,
                                           values: {
                                               ...modal.values,
                                               date_from: newValue
                                           }
                                       })
                                   }}
                                   slotProps={{
                                       textField: {
                                           required: true,
                                           size: 'small'
                                       },
                                   }}
                               />
                           </div>
                           <div className='flex items-center gap-[14px]'>
                               <p className='text-[#2A2826] text-[14px] font-[500]'>до</p>
                               <CustomRoundedDatePicker
                                   value={modal.values.date_to}
                                   onChange={(newValue) => {
                                       setModal({
                                           ...modal,
                                           values: {
                                               ...modal.values,
                                               date_to: newValue
                                           }
                                       })
                                   }}
                                   slotProps={{
                                       textField: {
                                           required: true,
                                           size: 'small'
                                       },
                                   }}
                               />
                           </div>

                           <LoadingButton
                               sx={{minWidth: '120px'}}
                               variant='contained'
                               size='small'
                               type='submit'
                               loading={modal.requested}
                               disabled={modal.requested}
                           >
                               Готово
                           </LoadingButton>
                       </form>
                   </Popover>
               </div>
            </div>

            <div className='w-full rounded-[10px] shadow-md'>
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
                                        onChange={(event)=>{
                                            setTable({
                                                ...table,
                                                filter:{
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
                />
            </div>

            <Modal open={modal.open} onClose={() => setModal(modalInitialValues)}>
                <div className='mainModal w-full' style={{maxWidth: 'calc(100% - 100px)', padding: '50px',}}>
                    <div className='w-full flex justify-center mb-[70px]'>
                        <h1 className='text-[32px] text-[#2A2826] font-[700] text-center'>
                            Отчет за период <br/>
                            {`c ${moment(modal.values.date_from?.$d).format('DD.MM.YY')} по ${moment(modal.values.date_to?.$d).format('DD.MM.YY')}`}
                        </h1>
                    </div>

                    <div className='w-full mb-[70px] flex flex-col justify-start items-center gap-[20px]'>
                        <div className='w-full grid grid-cols-7 gap-[20px] pb-[10px] mb-[30px]'
                             style={{borderBottom: '1px solid #576ED0'}}
                        >
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Дата</p>
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Номер продажи</p>
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Наименование товара</p>
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Менеджер</p>
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Клиент</p>
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Сумма</p>
                            <p className='text-[#2A2826] text-[16px] font-[600]'>Прибыль</p>
                        </div>

                        {[...modal.values.reports].map((item: any, index: number) =>
                            <div key={index} className='w-full grid grid-cols-7 gap-[20px]'>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>
                                    {moment(item.created_at).format('DD.MM.YY')}
                                </p>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>
                                    {item.id}
                                </p>
                                <div className='text-[#2A2826] text-[16px] font-[600] flex flex-col items-start gap-[5px]'>
                                    {item.products.map((product: any, index: number) =>
                                        <p key={index} className='text-[#2A2826] text-[14px] font-[#2A2826]'>
                                            {product.product.title}
                                        </p>
                                    )}
                                </div>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>
                                    {item.manager?.full_name}
                                </p>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>
                                    {item.client?.full_name}
                                </p>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>
                                    {item.total_sum}
                                </p>
                                <p className='text-[#2A2826] text-[16px] font-[600]'>Прибыль</p>
                            </div>
                        )}
                    </div>

                    <div className='w-full flex justify-center items-center'>
                        <Button
                            sx={{minWidth: '200px'}}
                            startIcon={<DownloadIcon/>}
                            variant='contained'
                            onClick={() => {
                                window.open(modal.value.file, '_blank')
                            }}
                        >
                            Скачать
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
