import React, {FormEvent, useEffect, useState} from 'react';
import {Modal, Pagination} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {checkModalResponse} from "../../helpers/helpers";
import {DataGrid} from "@mui/x-data-grid";
import {InventoryService} from "../../services/InventoryService";
import moment from "moment/moment";
import {CustomRoundedButton, CustomRoundedDatePicker, CustomRoundedLoadingButton} from "../../helpers/muiCustomization";

const modalInitialValues = {
    values: {
        id: '',
        info: [],
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
        date_from: null,
        date_to: null,
    },
};

export default function Inventory() {
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'date', headerName: 'Дата инвентаризации', flex: 1, renderCell: (params: any)=> moment(params.row.date).format('DD/MM/YY')},
            {field: 'total_quantity', headerName: 'Количество товара', flex: 1,},
            {field: 'lost_items', headerName: 'Утерянный товар', flex: 1},
        ],
    });
    const [modal, setModal] = useState<any>(modalInitialValues)

    const tableList = InventoryService.GetInventoryList({
        ...table.filter,
        ...table.filter.date_from !== null ? {date_from: moment(table.filter.date_from.$d).format('YYYY-MM-DD')} : {},
        ...table.filter.date_to !== null ? {date_to: moment(table.filter.date_to.$d).format('YYYY-MM-DD')} : {},
    })
    const inventory = InventoryService.GetInventoryInfo()

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });

        InventoryService.CreateInventory(modal.values).then(() => {
            tableList.execute();
            inventory.execute();
            setModal(modalInitialValues)
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

    useEffect(() => {
        if(!inventory.loading && !inventory.error){
            setModal((prevState: any)=>({
                ...prevState,
                values: {
                    ...prevState.values,
                    info: [...inventory.result?.data].map((item: any)=>({
                        ...item,
                        actual_quantity: item.quantity,
                        quantity_for_check: item.quantity,
                    }))
                }
            }))
        }
    }, [inventory.loading, inventory.error, inventory.result?.data]);
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Инвентаризация</h1>

                <CustomRoundedButton
                    variant='contained'
                    type='submit'
                    startIcon={<AddIcon/>}
                    onClick={() => {
                        setModal({
                            ...modal,
                            open: true,
                        })
                    }}
                >
                    Добавить инвентаризацию
                </CustomRoundedButton>
            </div>

            <div className='w-full flex justify-between items-center mb-[20px]'>
                <div className='flex items-center gap-[20px]'>
                    <CustomRoundedDatePicker
                        label="Дата от"
                        value={table.filter.date_from}
                        onChange={(newValue) => {
                            setTable({
                                ...table,
                                filter: {
                                    ...table.filter,
                                    date_from: newValue
                                }
                            })
                        }}
                        slotProps={{textField: {size: 'small'}}}
                        sx={{width: 170}}
                    />
                    <CustomRoundedDatePicker
                        label="Дата до"
                        value={table.filter.date_to}
                        onChange={(newValue) => {
                            setTable({
                                ...table,
                                filter: {
                                    ...table.filter,
                                    date_to: newValue
                                }
                            })
                        }}
                        slotProps={{textField: {size: 'small'}}}
                        sx={{width: 170}}
                    />
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

            <Modal open={modal.open} onClose={() => {
                setModal(modalInitialValues)
                inventory.execute()
            }}>
                <form onSubmit={handleFormSubmit} className='mainModal w-full'
                      style={{maxWidth: 'calc(100% - 100px)', padding: '50px',}}>
                    <h1 className='text-[#2A2826] text-[24px] font-[700] mb-[50px]'>
                        Инвентаризация
                    </h1>

                    <div className='w-full '>
                        <div className='w-full grid grid-cols-3 pb-[10px] mb-[30px]'
                             style={{borderBottom: '1px solid #576ED0'}}>
                            <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Название категории</p>
                            <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Количество товара в
                                категории</p>
                            <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Количество товаров при
                                инвентаризации</p>
                        </div>
                        <div className='w-full flex flex-col gap-[24px]'>
                            {[...modal.values.info].map((item: any, index: number) => (
                                <div key={index} className='w-full grid grid-cols-3 mb-[20px]'>
                                    <div className='flex justify-center items-center'>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>
                                            {item.name}
                                        </p>
                                    </div>
                                    <div className='flex justify-center items-center'>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>
                                            {item.quantity}
                                        </p>
                                    </div>
                                    <input
                                        type="number"
                                        required
                                        className='rounded-[100px] bg-[#F6F6F6] h-[36px] px-[20px]'
                                        value={item.actual_quantity}
                                        onChange={(event) => {
                                            const info = modal.values.info
                                            let inputValue = event.target.value
                                            let quantity_for_check = info[index].quantity_for_check
                                            let currentValue

                                            if(inputValue !== '' && inputValue < '0') {
                                                inputValue = '0'
                                            }
                                            if(inputValue > quantity_for_check){
                                                currentValue = quantity_for_check
                                            }else {
                                                currentValue = inputValue
                                            }

                                            info[index].actual_quantity = currentValue
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    info: info
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='w-full flex justify-center items-center gap-[30px]'>
                        <CustomRoundedButton
                            sx={{minWidth: '200px'}}
                            variant='outlined'
                            onClick={() => {
                                setModal(modalInitialValues)
                                inventory.execute()
                            }}
                        >
                            Отменить
                        </CustomRoundedButton>
                        <CustomRoundedLoadingButton
                            sx={{minWidth: '200px'}}
                            variant='contained'
                            loading={modal.requested}
                            disabled={modal.requested}
                            type='submit'
                        >
                            Готово
                        </CustomRoundedLoadingButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
