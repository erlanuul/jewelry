import React, {useEffect, useState} from 'react';
import {Button, InputLabel, MenuItem, Pagination} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {DataGrid} from "@mui/x-data-grid";
import {useNavigate} from "react-router-dom";
import {BoxOfficeService} from "../../services/BoxOfficeService";
import moment from "moment/moment";
import {CustomFormControl, CustomTextField, CustomSelect} from "../../helpers/muiCustomization";

const tableInitialValues = {
    rows: [],
    filter: {
        page: 1,
        limit: 20,
        total_pages: 1,
        operation_type: '',
        operation: '',
    },
};


export default function BoxOffice() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: '№ операции', flex: 1},
            {field: 'operation_type', headerName: 'Тип операции', flex: 1, renderCell: (params: any)=> params.row.operation_type?.name},
            {field: 'created_at', headerName: 'Дата', flex: 1, renderCell: (params: any)=> moment(params.row.created_at).format('DD.MM.YY hh:mm')},
            {field: 'operation', headerName: 'Операция', flex: 1, renderCell: (params: any)=> params.row.operation?.name},
            {field: 'total_sum', headerName: 'Сумма', flex: 1},
            {field: 'payment_type', headerName: 'Оплата', flex: 1, renderCell: (params: any)=> params.row.operation?.name},
            {field: 'note', headerName: 'Примечание', flex: 1},
        ],
    });

    const tableList = BoxOfficeService.GetBoxOfficeList(table.filter)
    const operationTypes = BoxOfficeService.GetBoxOfficeOperationTypes()
    const operations = BoxOfficeService.GetBoxOfficeOperations({
        operation_type__slug: table.filter.operation_type
    })

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
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Касса</h1>

                <div className='flex items-center gap-[20px]'>
                    {!operationTypes.loading && !operationTypes.error &&
                        operationTypes.result?.data.map((item: any, index: number) => (
                            <Button
                                key={index}
                                color='blue'
                                variant='contained'
                                type='submit'
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    navigate({
                                        pathname: `/box_office/${item.slug}`
                                    })
                                }}
                            >
                                {item.name}
                            </Button>
                        ))
                    }
                </div>
            </div>

            <div className='w-full flex justify-between items-center mb-[20px]'>
                <div className='w-full flex items-center gap-[20px]'>
                    <CustomFormControl sx={{minWidth: '120px'}}>
                        <InputLabel>Тип операции</InputLabel>
                        <CustomSelect
                            label="Тип операции"
                            placeholder='Тип операции'
                            required
                            value={table.filter.operation_type}
                            onChange={(event) => {
                                setTable({
                                    ...table,
                                    filter: {
                                        ...table.filter,
                                        operation_type: event.target.value,
                                    }
                                })
                            }}
                        >
                            {!operationTypes.loading && !operationTypes.error &&
                                operationTypes.result?.data.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.slug}>{item.name}</MenuItem>
                                ))
                            }
                        </CustomSelect>
                    </CustomFormControl>
                    <CustomFormControl sx={{minWidth: '120px'}}>
                        <InputLabel>Операции</InputLabel>
                        <CustomSelect
                            label="Операции"
                            placeholder='Операции'
                            required
                            value={table.filter.operation}
                            onChange={(event) => {
                                setTable({
                                    ...table,
                                    filter: {
                                        ...table.filter,
                                        operation: event.target.value,
                                    }
                                })
                            }}
                        >
                            {!operations.loading && !operations.error &&
                                operations.result?.data.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.slug}>{item.name}</MenuItem>
                                ))
                            }
                        </CustomSelect>
                    </CustomFormControl>
                </div>

                <CustomTextField
                    sx={{minWidth: '120px'}}
                    placeholder='Поиск'
                    required
                    value={table.filter.search}
                    onChange={(event) => {
                        setTable({
                            ...table,
                            filter: {
                                ...table.filter,
                                search: event.target.value,
                            }
                        })
                    }}
                />
            </div>

            <div className='w-full rounded-[10px]'>
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
        </>
    );
}
