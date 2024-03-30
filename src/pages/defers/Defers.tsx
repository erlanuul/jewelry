import React, {useEffect, useState} from 'react';
import {IconButton, Pagination} from "@mui/material";
import {ClientService} from "../../services/ClientService";
import {DataGrid} from "@mui/x-data-grid";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {DeferService} from "../../services/DeferService";
import moment from "moment/moment";

const tableInitialValues = {
    rows: [],
    filter: {
        page: 1,
        limit: 20,
        total_pages: 1,
    },
};

export default function Defers() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'Номер рассрочки', flex: 1},
            {field: 'client', headerName: 'Клиент', flex: 1, renderCell: (params: any)=> params.row.client?.full_name},
            {field: 'address', headerName: 'Адрес', flex: 1, renderCell: (params: any)=> params.row.client?.address},
            {field: 'phone', headerName: 'Номер телефона', flex: 1, renderCell: (params: any)=> params.row.client?.phone},
            {field: 'note', headerName: 'Примечание', flex: 1, renderCell: (params: any)=> params.row.note},
            {field: 'created_at', headerName: 'Дата получения', flex: 1, renderCell: (params: any)=> moment(params.row.created_at).format('DD.MM.YY')},
            {field: 'end_date', headerName: 'Дата окончания', flex: 1, renderCell: (params: any)=> moment(params.row.end_date).format('DD.MM.YY')},
            {field: 'total_sum', headerName: 'Общая сумма долга', flex: 1},
            {field: 'total_remains', headerName: 'Остаток', flex: 1},
            {
                field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
                    <div className='w-full flex items-center justify-center'>
                        <IconButton color="secondary" onClick={() => {
                            navigate({
                                pathname: `/defers/${params.row.id}`
                            })
                        }}>
                            <VisibilityIcon style={{color: "#B9B9B9"}}/>
                        </IconButton>
                    </div>
                )
            },
        ],
    });

    const tableList = DeferService.GetDefersList(table.filter)


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

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Рассрочки</h1>
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
    );
}
