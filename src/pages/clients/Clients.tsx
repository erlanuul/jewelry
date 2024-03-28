import React, {FormEvent, useEffect, useState} from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ClientService} from "../../services/ClientService";
import {checkModalResponse, convertImageUrlToFile, ImageImport, ImageImportButton} from "../../helpers/helpers";
import {DataGrid} from "@mui/x-data-grid";
import {LoadingButton, Pagination} from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import InputMask from "react-input-mask";
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate} from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const modalInitialValues = {
    values: {
        id: '',
        full_name: '',
        phone: '',
        address: '',
        solvency: '',
        inn: '',
        note: '',
        images:[
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
    validation: {
        error: {
            full_name: false,
            phone: false,
            address: false,
            solvency: false,
            inn: false,
            note: false,
        },
        message: {
            full_name: '',
            phone: '',
            address: '',
            solvency: '',
            inn: '',
            note: '',
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
        size: 20,
        total_pages: 1,
    },
    selectedRows: [],
};


export default function Clients() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'full_name', headerName: 'ФИО', flex: 1},
            {field: 'address', headerName: 'Адрес', flex: 1},
            {field: 'phone', headerName: 'Номер телефона', flex: 1},
            {field: 'image', headerName: 'Фото', flex: 1, renderCell:(params: any)=>(
                params.row.images.length > 0 &&
                    <div className='w-[90px] h-[50px] bg-cover bg-center my-[10px] rounded-[4px] cursor-pointer'
                         style={{backgroundImage: `url(${params.row.images[0].image})`}}
                         onClick={()=>{
                             setModal({
                                 ...modalInitialValues,
                                 open: true,
                                 action: 'viewImages',
                                 requested: true,
                                 values:{
                                     ...modalInitialValues.values,
                                     images: params.row.images
                                 }
                             });
                         }}
                    >

                    </div>
                )
            },
            {field: 'note', headerName: 'Примечание', flex: 1},
            {field: 'solvency', headerName: 'Платежеспособность', flex: 1, renderCell: (params:  any)=>
                    params.row.solvency ? 'Да' : 'Нет'
            },
            {field: 'inn', headerName: 'ИНН', flex: 1},
            {
                field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
                    <div className='w-full flex items-center justify-center'>
                        <IconButton color="secondary" onClick={() => {
                            navigate({
                                pathname: `/clients/${params.row.id}`
                            })
                        }}>
                            <VisibilityIcon style={{color: "#B9B9B9"}}/>
                        </IconButton>
                        <IconButton color="secondary" onClick={() => {
                            setModal({
                                ...modalInitialValues,
                                open: true,
                                action: 'edit',
                                requested: true,
                            });
                            handleConvertClientImages(params.row).then((res)=>{
                                setModal({
                                    ...modalInitialValues,
                                    open: true,
                                    action: 'edit',
                                    values: {
                                        ...modalInitialValues.values,
                                        ...params.row,
                                        position: params.row.position?.id,
                                        images: res
                                    }
                                });
                            })
                        }}>
                            <EditIcon style={{color: "#B9B9B9"}}/>
                        </IconButton>
                        <IconButton color="secondary" onClick={() => {
                            setModal({
                                ...modalInitialValues,
                                open: true,
                                action: 'delete',
                                values: {
                                    ...modalInitialValues.values,
                                    ...params.row,
                                    position: params.row.position?.id,
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

    const tableList = ClientService.GetClientList(table.filter)

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });
        const values = {
            ...modal.values,
            images: [...modal.values.images].filter((item: any)=> item.image !== null)
        }

        const form_data = new FormData()
        for (let key in values) {
            if (Array.isArray(values[key])) {
                for (let i = 0; i < values[key].length; i++) {
                    for (let keyImg in values[key][i]) {
                        form_data.append(`${key}[${i}]${keyImg}`, values[key][i][keyImg]);
                    }
                }
            } else {
                form_data.append(key, values[key]);
            }
        }

        switch (modal.action) {
            case 'add':
                ClientService.CreateClient(form_data).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'edit':
                ClientService.EditClient(modal.values.id, form_data).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'delete':
                ClientService.DeleteClient(modal.values.id).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;
        }
    };
    const handleConvertClientImages = async (data: any) => {
        const imagesFiles = await Promise.all(data.images.map(async (item: any) => {
            return {
                image: await convertImageUrlToFile(item.image)
            };
        }));
        const remainingNullObjects = Array.from({ length: Math.max(4 - imagesFiles.length, 0) }, () => ({ image: null }));

        return imagesFiles.concat(remainingNullObjects)
    }

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
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Клиенты</h1>

                <Button
                    color='blue'
                    variant='contained'
                    type='submit'
                    startIcon={<AddIcon/>}
                    onClick={() => {
                        setModal({
                            ...modalInitialValues,
                            open: true,
                            action: 'add',
                        })
                    }}
                >
                    Добавить клиента
                </Button>
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
                                        value={table.filter.size}
                                        onChange={(event)=>{
                                            setTable({
                                                ...table,
                                                filter:{
                                                    ...table.filter,
                                                    size: event.target.value
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
                    {modal.action === 'viewImages'
                        ?
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
                        :
                        <form onSubmit={handleFormSubmit} className='mainModal'>
                            <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                                {modal.action === 'add' && 'Добавление клиента'}
                                {modal.action === 'delete' && 'Удалить клиента?'}
                                {modal.action === 'edit' && 'Редактирование клиента'}
                            </h1>
                            {modal.action !== 'delete' &&
                                <div className='w-full flex flex-col justify-start items-center gap-[30px]'>
                                    <div className='w-full grid grid-cols-2 gap-[30px]'>
                                    <TextField
                                        fullWidth
                                        label='ФИО'
                                        placeholder='ФИО'
                                        required
                                        value={modal.values.full_name}
                                        error={modal.validation.error.full_name}
                                        helperText={modal.validation.message.full_name}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    full_name: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <InputMask
                                        mask="9(999)-999-999"
                                        value={modal.values.phone}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    phone: event.target.value.replace(/\D/g, '')
                                                }
                                            });
                                        }}
                                    >
                                        <TextField
                                            label="Номер телефона"
                                            placeholder='Номер телефона'
                                            variant="outlined"
                                            type='text'
                                            fullWidth
                                            error={modal.validation.error.phone}
                                            helperText={modal.validation.message.phone}
                                            required
                                        />
                                    </InputMask>
                                    <TextField
                                        fullWidth
                                        label='Адрес'
                                        placeholder='Адрес'
                                        type='text'
                                        required
                                        value={modal.values.address}
                                        error={modal.validation.error.address}
                                        helperText={modal.validation.message.address}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    address: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <FormControl fullWidth required>
                                        <InputLabel>Платежеспособность</InputLabel>
                                        <Select
                                            label="Платежеспособность"
                                            placeholder='Платежеспособность'
                                            required
                                            value={modal.values.solvency === '' ? '' : modal.values.solvency ? 'true' : 'false'}
                                            error={modal.validation.error.solvency}
                                            onChange={(event) => {
                                                setModal({
                                                    ...modal,
                                                    values: {
                                                        ...modal.values,
                                                        solvency: event.target.value === 'true',
                                                    }
                                                })
                                            }}
                                        >
                                            <MenuItem value={'false'}>Нет</MenuItem>
                                            <MenuItem value={'true'}>Да</MenuItem>
                                        </Select>
                                        {modal.validation.message.solvency !== '' &&
                                            <FormHelperText>{modal.validation.message.solvency}</FormHelperText>
                                        }
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label='ИНН'
                                        placeholder='ИНН'
                                        type='number'
                                        required
                                        value={modal.values.inn}
                                        error={modal.validation.error.inn}
                                        helperText={modal.validation.message.inn}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    inn: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <TextField
                                        fullWidth
                                        label='Примечание'
                                        placeholder='Примечание'
                                        type='text'
                                        required
                                        value={modal.values.note}
                                        error={modal.validation.error.note}
                                        helperText={modal.validation.message.note}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    note: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <div className="w-full grid grid-cols-4 gap-[10px]">
                                    {modal.values.images.map((item: any, index: number) => (
                                        <div className={`w-full min-h-[76px] ${index === 0 ? 'col-start-1 col-end-3 row-start-1 row-end-3' : 'h-[76px]'}`}
                                             key={index}>
                                            <ImageImport
                                                multiple={false}
                                                onChange={(event) => {
                                                    if (event.target.files) {
                                                        const imagesArr = modal.values.images
                                                        const imagesFiles = event.target.files
                                                        imagesArr[index].image = imagesFiles[0]
                                                        setModal({
                                                            ...modal,
                                                            values: {
                                                                ...modal.values,
                                                                images: imagesArr
                                                            }
                                                        })
                                                    }
                                                }}
                                                onDelete={()=>{
                                                    const imagesArr = modal.values.images
                                                    if(imagesArr.length <= 4) {
                                                        imagesArr[index].image = null
                                                    }else {
                                                        imagesArr.splice(index, 1)
                                                    }
                                                    setModal({
                                                        ...modal,
                                                        values: {
                                                            ...modal.values,
                                                            images: imagesArr
                                                        }
                                                    })
                                                }}
                                                imgUrl={item.image !== null ? URL.createObjectURL(item.image) : null}
                                            />
                                        </div>
                                    ))}
                                    <div className='w-full min-h-[76px]'>
                                        <ImageImportButton
                                            multiple={true}
                                            onChange={(event) => {
                                                if (event.target.files) {
                                                    const imagesArr = [...modal.values.images]
                                                    const files = Array.from(event.target.files)

                                                    for (let i = 0; i < imagesArr.length && files.length > 0; i++) {
                                                        if (!imagesArr[i].image) {
                                                            imagesArr[i] = { image: files.shift() }
                                                        }
                                                    }
                                                    while (files.length > 0) {
                                                        imagesArr.push({ image: files.shift() })
                                                    }

                                                    setModal({
                                                        ...modal,
                                                        values: {
                                                            ...modal.values,
                                                            images: imagesArr
                                                        }
                                                    });
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        }

                        <div className='w-full grid grid-cols-2 gap-[30px]'>
                            <Button
                                fullWidth
                                variant='outlined'
                                onClick={() => setModal(modalInitialValues)}
                            >
                                Отменить
                            </Button>
                            <LoadingButton
                                fullWidth
                                variant='contained'
                                loading={modal.requested}
                                disabled={modal.requested}
                                type='submit'
                            >
                                Готово
                            </LoadingButton>
                        </div>
                    </form>
                    }
            </Modal>
        </>
    );
}
