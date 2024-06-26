import React, {FormEvent, useEffect, useState} from 'react';
import {IconButton, Modal, Pagination} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {checkModalResponse} from "../../helpers/helpers";
import {DataGrid} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {useNavigate} from "react-router-dom";
import {SalaryService} from "../../services/SalaryService";
import {CustomRoundedButton, CustomRoundedDatePicker, CustomRoundedLoadingButton} from "../../helpers/muiCustomization";
import moment from "moment";

const modalInitialValues = {
    values: {
        id: '',
    },
    validation: {
        error: {
        },
        message: {
        },
    },
    open: false,
    requested: false,
    action: '',
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


export default function Salaries() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'date_start', headerName: 'Дата от', flex: 1, renderCell: (params: any)=> moment(params.row.date_start).format('DD/MM/YY')},
            {field: 'date_end', headerName: 'Дата до', flex: 1, renderCell: (params: any)=> moment(params.row.date_end).format('DD/MM/YY')},
            {
                field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
                    <div className='w-full flex items-center justify-center'>
                        <IconButton color="secondary" onClick={() => {
                            navigate({
                                pathname: `/salaries/${params.row.id}`
                            })
                        }}>
                            <VisibilityIcon style={{color: "#B9B9B9"}}/>
                        </IconButton>
                        <IconButton color="secondary" onClick={() => {
                            setModal({
                                ...modalInitialValues,
                                open: true,
                                action: 'delete',
                                values: {
                                    ...modalInitialValues.values,
                                    ...params.row,
                                }
                            })
                        }}>
                            <DeleteIcon style={{color: "#B9B9B9"}}/>
                        </IconButton>
                    </div>
                )
            },
        ],
    });
    const [modal, setModal] = useState<any>(modalInitialValues)

    const tableList = SalaryService.GetSalaryList({
        ...table.filter,
        ...table.filter.date_from !== null ? {date_from: moment(table.filter.date_from.$d).format('YYYY-MM-DD')} : {},
        ...table.filter.date_to !== null ? {date_to: moment(table.filter.date_to.$d).format('YYYY-MM-DD')} : {},
    })

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });

        switch (modal.action) {
            case 'delete':
                SalaryService.DeleteSalary(modal.values.id).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;
        }
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
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Зарплатная ведомость</h1>

                <CustomRoundedButton
                    variant='contained'
                    type='submit'
                    startIcon={<AddIcon/>}
                    onClick={() => {
                        navigate({
                            pathname: `/salaries/add`
                        })
                    }}
                >
                    Добавить зарплатную ведомость
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
                />
            </div>

            <Modal open={modal.open} onClose={() => setModal(modalInitialValues)}>
                <form onSubmit={handleFormSubmit} className='mainModal'>
                    <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                        {modal.action === 'delete' && 'Удалить ведомость?'}
                    </h1>

                    <div className='w-full grid grid-cols-2 gap-[30px]'>
                        <CustomRoundedButton
                            fullWidth
                            variant='outlined'
                            onClick={() => setModal(modalInitialValues)}
                        >
                            Отменить
                        </CustomRoundedButton>
                        <CustomRoundedLoadingButton
                            fullWidth
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
