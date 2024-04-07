import React, {FormEvent, useState} from 'react';
import {checkModalResponse} from "../../helpers/helpers";
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {SalaryService} from "../../services/SalaryService";
import moment from "moment/moment";
import {CustomRoundedButton, CustomRoundedDatePicker, CustomRoundedLoadingButton} from "../../helpers/muiCustomization";

const formInitialValues = {
    values: {
        date_start: null,
        date_end: null,
        reports: []
    },
    validation:{
        errors: {

        },
        messages: {

        }
    },
    requested: false,
}

const tableInitialValues = {
    rows: [],
};

export default function SalariesAdd() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'full_name', headerName: 'ФИО', flex: 1},
            {field: 'position', headerName: 'Должность', flex: 1, renderCell: (params: any)=>
                    params.row.position?.name
            },
            {field: 'salary', headerName: 'Оклад', flex: 1},
            {field: 'percentage_of_the_sale', headerName: 'Проценты за продажу', flex: 1},
            {field: 'quantity_of_sales', headerName: 'Количество продаж', flex: 1},
            {field: 'prepayment', headerName: 'Аванс', flex: 1},
            {field: 'total_sum', headerName: 'Итого', flex: 1},
            {field: 'paid', headerName: 'Выплачено', flex: 1},
        ],
    });

    const [form, setForm] = useState<any>(formInitialValues)

    const handleGetReport = (event: FormEvent) => {
        event.preventDefault();
        setForm({
            ...form,
            requested: true,
        });

        SalaryService.GetSalaryReportList({
            date_start: moment(form.values.date_start?.$d).format('YYYY-MM-DD'),
            date_end: moment(form.values.date_end?.$d).format('YYYY-MM-DD'),
        }).then((res) => {
            setTable({
                ...table,
                rows: res.data
            })
            setForm({
                ...form,
                values:{
                    ...form.values,
                    reports: [...res.data].map((item: any)=>({
                        staff: item.id,
                        wage: item.salary,
                        percent_sales: item.percentage_of_the_sale,
                        quantity_of_sales: item.quantity_of_sales,
                        prepayment: item.prepayment,
                        total_amount: item.total_sum,
                    }))
                },
                requested: false
            })
        }).catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
        })
    };

    const handleSaveReport = () => {
        setForm({
            ...form,
            requested: true,
        });
        SalaryService.CreateSalary({
            ...form.values,
            date_start: moment(form.values.date_start?.$d).format('YYYY-MM-DD'),
            date_end: moment(form.values.date_end?.$d).format('YYYY-MM-DD'),
        }).then(() => {
            navigate(-1)
        }).catch((err) => {
            checkModalResponse(err.response.data, setForm, form);
        })
    };


    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Добавление зарплатной ведомости</h1>
            </div>

            <form onSubmit={handleGetReport} className='w-full flex items-end gap-[20px] mb-[20px]'>
                <CustomRoundedDatePicker
                    label="Дата от"
                    value={form.values.date_start}
                    onChange={(newValue) => {
                        setForm({
                            ...form,
                            values: {
                                ...form.values,
                                date_start: newValue
                            }
                        })
                    }}
                    slotProps={{
                        textField: {
                            required: true,
                            size:'small'
                        },
                    }}
                />
                <CustomRoundedDatePicker
                    label="Дата до"
                    value={form.values.date_end}
                    onChange={(newValue) => {
                        setForm({
                            ...form,
                            values: {
                                ...form.values,
                                date_end: newValue
                            }
                        })
                    }}
                    slotProps={{
                        textField: {
                            required: true,
                            size:'small'
                        },
                    }}
                />
                <CustomRoundedLoadingButton
                    sx={{minWidth: '220px'}}
                    variant='contained'
                    loading={form.requested}
                    disabled={form.requested}
                    type='submit'
                >
                    Подтвердить
                </CustomRoundedLoadingButton>
            </form>

            <div className='w-full rounded-[10px] shadow-md mb-[30px]'>
                <DataGrid
                    rows={table.rows}
                    columns={table.columns}
                    disableColumnFilter
                    disableRowSelectionOnClick
                    filterMode='server'
                    autoHeight
                    rowHeight={80}
                    hideFooter
                    loading={form.loading}
                />
            </div>

            <div className='w-full flex justify-center items-center gap-[30px]'>
                <CustomRoundedButton
                    sx={{minWidth: '220px'}}
                    variant='outlined'
                    onClick={() => navigate(-1)}
                >
                    Отменить
                </CustomRoundedButton>
                <CustomRoundedLoadingButton
                    sx={{minWidth: '220px'}}
                    variant='contained'
                    loading={form.requested}
                    disabled={form.values.reports.length === 0 || form.requested}
                    type='button'
                    onClick={()=>handleSaveReport()}
                >
                    Сохранить
                </CustomRoundedLoadingButton>
            </div>
        </>
    );
}
