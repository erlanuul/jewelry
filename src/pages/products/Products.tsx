import React, {FormEvent, useEffect, useState} from 'react';
import {
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Modal,
    Pagination,
    Select,
    TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {ProductService} from "../../services/ProductService";
import {checkModalResponse, convertImageUrlToFile, ImageImport, ImageImportButton} from "../../helpers/helpers";
import {DataGrid} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate} from "react-router-dom";
import {CategoryService} from "../../services/CategoryService";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    CustomFormControl,
    CustomRoundedButton,
    CustomRoundedLoadingButton,
    CustomTextField
} from "../../helpers/muiCustomization";

const modalInitialValues = {
    values: {
        id: '',
        category: '',
        barcode: '',
        title: '',
        sample_number: '',
        weight: '',
        size: '',
        cost_price: '',
        used: '',
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
    validation: {
        error: {
            category: false,
            barcode: false,
            title: false,
            sample_number: false,
            weight: false,
            size: false,
            cost_price: false,
            used: false,
        },
        message: {
            category: '',
            barcode: '',
            title: '',
            sample_number: '',
            weight: '',
            size: '',
            cost_price: '',
            used: '',
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
        category: '',
        in_stock: '',
        search: '',
    },
};

export default function Products() {
    const navigate = useNavigate()
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'barcode', headerName: 'Код', flex: 1},
            {field: 'title', headerName: 'Наименование', flex: 1},
            {
                field: 'category',
                headerName: 'Категория',
                flex: 1,
                renderCell: (params: any) => params.row.category?.name
            },
            {field: 'sample_number', headerName: 'Проба', flex: 1},
            {
                field: 'image', headerName: 'Фото', flex: 1, renderCell: (params: any) => (
                    params.row.images.length > 0 &&
                    <div className='w-[90px] h-[50px] bg-cover bg-center my-[10px] rounded-[4px] cursor-pointer'
                         style={{backgroundImage: `url(${params.row.images[0].image})`}}
                         onClick={() => {
                             setModal({
                                 ...modalInitialValues,
                                 open: true,
                                 action: 'viewImages',
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
            {field: 'weight', headerName: 'Вес', flex: 1},
            {field: 'size', headerName: 'Размер', flex: 1},
            {field: 'cost_price', headerName: 'Себестоимость', flex: 1},
            {
                field: 'used', headerName: 'Б/У', flex: 1, renderCell: (params: any) =>
                    params.row.used ? 'Да' : 'Нет'
            },
            {
                field: 'in_stock', headerName: 'В наличии', flex: 1, renderCell: (params: any) =>
                    params.row.in_stock ? 'Да' : 'Нет'
            },
            {
                field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
                    <div className='w-full flex items-center justify-center'>
                        <IconButton color="secondary" onClick={() => {
                            navigate({
                                pathname: `/products/${params.row.id}`
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
                            handleConvertClientImages(params.row).then((res) => {
                                setModal({
                                    ...modalInitialValues,
                                    open: true,
                                    action: 'edit',
                                    values: {
                                        ...modalInitialValues.values,
                                        ...params.row,
                                        category: params.row.category?.id,
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
                                    category: params.row.category?.id,
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

    const tableList = ProductService.GetProductList(table.filter)
    const categoriesList = CategoryService.GetCategoryList()

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });
        const values = {
            ...modal.values,
            images: [...modal.values.images].filter((item: any) => item.image !== null)
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
                ProductService.CreateProduct(form_data).then(() => {
                    const images = modalInitialValues.values.images
                    setModal({
                        ...modalInitialValues,
                        values: {
                            ...modalInitialValues.values,
                            images: images
                        }
                    });
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'edit':
                ProductService.EditProduct(modal.values.id, form_data).then(() => {
                    const images = modalInitialValues.values.images
                    setModal({
                        ...modalInitialValues,
                        values: {
                            ...modalInitialValues.values,
                            images: images
                        }
                    });
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'delete':
                ProductService.DeleteProduct(modal.values.id).then(() => {
                    const images = modalInitialValues.values.images
                    setModal({
                        ...modalInitialValues,
                        values: {
                            ...modalInitialValues.values,
                            images: images
                        }
                    });
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
        const remainingNullObjects = Array.from({length: Math.max(4 - imagesFiles.length, 0)}, () => ({image: null}));

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
            <div className='w-full flex justify-between items-end mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Товары</h1>

                <CustomRoundedButton
                    size='large'
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
                    Добавить товар
                </CustomRoundedButton>
            </div>

            <div className='w-full flex justify-between items-center mb-[20px]'>
                <div className='flex items-center gap-[20px]'>
                    <FormControl size='small' sx={{minWidth: '120px'}}>
                        <InputLabel>Категория</InputLabel>
                        <Select
                            sx={{borderRadius: 100}}
                            label="Категория"
                            placeholder='Категория'
                            required
                            value={table.filter.category}
                            onChange={(event) => {
                                setTable({
                                    ...table,
                                    filter: {
                                        ...table.filter,
                                        category: event.target.value,
                                    }
                                })
                            }}
                        >
                            <MenuItem value={''}><em><b>очистить</b></em></MenuItem>
                            {!categoriesList.loading && !categoriesList.error &&
                                categoriesList.result?.data.map((item: any, index: number) => (
                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl size='small' sx={{minWidth: '120px'}}>
                        <InputLabel>Наличие</InputLabel>
                        <Select
                            sx={{borderRadius: 100}}
                            label="Наличие"
                            placeholder='Наличие'
                            required
                            value={table.filter.in_stock === '' ? '' : table.filter.in_stock ? 'true' : 'false'}
                            onChange={(event) => {
                                setTable({
                                    ...table,
                                    filter: {
                                        ...table.filter,
                                        in_stock: event.target.value === 'true',
                                    }
                                })
                            }}
                        >
                            <MenuItem value={''}><em><b>очистить</b></em></MenuItem>
                            <MenuItem value={'false'}>Отсутствует</MenuItem>
                            <MenuItem value={'true'}>В наличии</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <TextField
                    InputProps={{
                        sx: {
                            minWidth: '250px',
                            borderRadius: '100px',
                        },
                    }}
                    size='small'
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
                            {modal.action === 'add' && 'Добавление товара'}
                            {modal.action === 'delete' && 'Удалить товара?'}
                            {modal.action === 'edit' && 'Редактирование товара'}
                        </h1>
                        {modal.action !== 'delete' &&
                            <div className='w-full flex flex-col justify-start items-center gap-[30px]'>
                                <div className='w-full grid grid-cols-2 gap-[30px]'>
                                    <CustomTextField
                                        fullWidth
                                        label='Наименование'
                                        placeholder='Наименование'
                                        required
                                        value={modal.values.title}
                                        error={modal.validation.error.title}
                                        helperText={modal.validation.message.title}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    title: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <CustomTextField
                                        fullWidth
                                        label='Себестоимость'
                                        placeholder='Себестоимость'
                                        type='number'
                                        required
                                        value={modal.values.cost_price}
                                        error={modal.validation.error.cost_price}
                                        helperText={modal.validation.message.cost_price}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    cost_price: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <CustomFormControl fullWidth required>
                                        <InputLabel>Категория</InputLabel>
                                        <Select
                                            label="Категория"
                                            placeholder='Категория'
                                            required
                                            value={modal.values.category}
                                            error={modal.validation.error.category}
                                            onChange={(event) => {
                                                setModal({
                                                    ...modal,
                                                    values: {
                                                        ...modal.values,
                                                        category: event.target.value,
                                                    }
                                                })
                                            }}
                                        >
                                            {!categoriesList.loading && !categoriesList.error &&
                                                categoriesList.result?.data.map((item: any, index: number) => (
                                                    <MenuItem key={index} value={item.id}>{item.name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                        {modal.validation.message.category !== '' &&
                                            <FormHelperText>{modal.validation.message.category}</FormHelperText>
                                        }
                                    </CustomFormControl>
                                    <CustomTextField
                                        fullWidth
                                        label='Размер'
                                        placeholder='Размер'
                                        type='text'
                                        required
                                        value={modal.values.size}
                                        error={modal.validation.error.size}
                                        helperText={modal.validation.message.size}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    size: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <CustomTextField
                                        fullWidth
                                        label='Вес'
                                        placeholder='Вес'
                                        type='number'
                                        required
                                        value={modal.values.weight}
                                        error={modal.validation.error.weight}
                                        helperText={modal.validation.message.weight}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    weight: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <CustomTextField
                                        fullWidth
                                        label='Проба'
                                        placeholder='Проба'
                                        type='text'
                                        required
                                        value={modal.values.sample_number}
                                        error={modal.validation.error.sample_number}
                                        helperText={modal.validation.message.sample_number}
                                        onChange={(event) => {
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    sample_number: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <CustomFormControl fullWidth required>
                                        <InputLabel>Б/У</InputLabel>
                                        <Select
                                            label="Б/У"
                                            placeholder='Б/У'
                                            required
                                            value={modal.values.used === '' ? '' : modal.values.used ? 'true' : 'false'}
                                            error={modal.validation.error.used}
                                            onChange={(event) => {
                                                setModal({
                                                    ...modal,
                                                    values: {
                                                        ...modal.values,
                                                        used: event.target.value === 'true',
                                                    }
                                                })
                                            }}
                                        >
                                            <MenuItem value={'false'}>Нет</MenuItem>
                                            <MenuItem value={'true'}>Да</MenuItem>
                                        </Select>
                                        {modal.validation.message.used !== '' &&
                                            <FormHelperText>{modal.validation.message.used}</FormHelperText>
                                        }
                                    </CustomFormControl>
                                </div>
                                <div className="w-full grid grid-cols-4 gap-[10px]">
                                    {modal.values.images.map((item: any, index: number) => (
                                        <div
                                            className={`w-full min-h-[76px] ${index === 0 ? 'col-start-1 col-end-3 row-start-1 row-end-3' : 'h-[76px]'}`}
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
                                                onDelete={() => {
                                                    const imagesArr = modal.values.images
                                                    if (imagesArr.length <= 4) {
                                                        imagesArr[index].image = null
                                                    } else {
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
                                                            imagesArr[i] = {image: files.shift()}
                                                        }
                                                    }
                                                    while (files.length > 0) {
                                                        imagesArr.push({image: files.shift()})
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
                }
            </Modal>
        </>
    );
}
