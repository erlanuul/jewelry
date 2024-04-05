import React, {useEffect, useState} from 'react';
import {Modal, Pagination} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {MetalService} from "../../services/MetalService";
import moment from "moment/moment";
import {CustomRoundedDatePicker} from "../../helpers/muiCustomization";

const modalInitialValues = {
    values: {
        id: '',
        images: [
            {
                image: null,
            },
            {
                image: null
            },
            {
                image: null
            },
            {
                image: null
            },
        ]
    },
    open: false,
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

export default function Metals() {
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {
                field: 'created_at', headerName: 'Дата', flex: 1,
                renderCell: (params: any) => moment(params.row.cash?.created_at).format('DD.MM.YY')
            },
            {field: 'sample_number', headerName: 'Проба', flex: 1},
            {
                field: 'total_sum',
                headerName: 'Сумма',
                flex: 1,
                renderCell: (params: any) => params.row.cash?.total_sum
            },
            {field: 'weight', headerName: 'Вес', flex: 1},
            {
                field: 'manager',
                headerName: 'Менеджер',
                flex: 1,
                renderCell: (params: any) => params.row.cash?.manager?.full_name
            },
            {
                field: 'image', headerName: 'Фото', flex: 1, renderCell: (params: any) => (
                    params.row.images.length > 0 &&
                    <div className='w-[90px] h-[50px] bg-cover bg-center my-[10px] rounded-[4px] cursor-pointer'
                         style={{backgroundImage: `url(${params.row.images[0].image})`}}
                         onClick={() => {
                             setModal({
                                 ...modalInitialValues,
                                 open: true,
                                 requested: true,
                                 values: {
                                     ...modalInitialValues.values,
                                     images: params.row.images
                                 }
                             });
                         }}
                    >
                    </div>
                )
            },
        ],
    });
    const [modal, setModal] = useState<any>(modalInitialValues)

    const tableList = MetalService.GetMetalList({
        ...table.filter,
        ...table.filter.date_from !== null ? {date_from: moment(table.filter.date_from.$d).format('YYYY-MM-DD')} : {},
        ...table.filter.date_to !== null ? {date_to: moment(table.filter.date_to.$d).format('YYYY-MM-DD')} : {},
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
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Металл</h1>
            </div>

            <div className='w-full flex justify-start items-center gap-[20px] mb-[20px]'>
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
                    slotProps={{ textField: { size: 'small' } }}
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
                    slotProps={{ textField: { size: 'small' } }}
                    sx={{width: 170}}
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
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                            },
                        },
                    }}
                />
            </div>

            <Modal open={modal.open} onClose={() => setModal(modalInitialValues)}>
                <div className='modalSlider'>
                    <Slider {...settings}>
                        {modal.values.images.map((item: any, index: number) => (
                            <div key={index}>
                                <div className='max-w-[756px] h-[420px] bg-center bg-cover rounded-[10px]'
                                     style={{backgroundImage: `url(${item.image})`}}
                                >
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Modal>
        </>
    );
}
