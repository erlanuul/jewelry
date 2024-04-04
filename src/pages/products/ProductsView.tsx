import React, {FormEvent, useState} from 'react';
import {FormHelperText, InputLabel, MenuItem, Modal, Select, Skeleton} from "@mui/material";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import {useNavigate, useParams} from "react-router-dom";
import {ProductService} from "../../services/ProductService";
import {checkModalResponse, convertImageUrlToFile, ImageImport, ImageImportButton} from "../../helpers/helpers";
import {CategoryService} from "../../services/CategoryService";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LabelIcon from '@mui/icons-material/Label';
import Slider from "react-slick";
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

export default function ProductsView() {
    const {id} = useParams()
    const navigate = useNavigate()

    const [modal, setModal] = useState<any>(modalInitialValues)

    const product = ProductService.GetProductInfo(id)
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
            case 'edit':
                ProductService.EditProduct(modal.values.id, form_data).then(() => {
                    product.execute()
                    setModal(modalInitialValues)
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'delete':
                ProductService.DeleteProduct(modal.values.id).then(() => {
                    navigate(-1)
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


    const [nav1, setNav1] = useState<Slider | null>(null);
    const [nav2, setNav2] = useState<Slider | null>(null);

    const vertical__settings = {
        arrows: false,
        infinite: false,
        vertical: true,
        verticalSwiping: true,
        swipeToSlide: true,
        slidesToScroll: 1,
        slidesToShow: 1
    };

    const settings = {
        arrows: false,
        infinite: true,
        waitForAnimate: false,
        speed: 800,
        slidesToShow: 1,
        adaptiveHeight: true,
        variableWidth: true
    };

    const goToMainSlide = (index: number) => {
        if (nav2) {
            nav2.slickGoTo(index);
        }
    };
    return (
        <>

            {product.loading
                ?
                <>
                    <div className='w-full flex justify-between items-center mb-[57px]'>
                        <Skeleton variant="rectangular" width={'40%'} height={40}/>
                        <div className='flex items-center gap-[10px]'>
                            <Skeleton variant="rectangular" width={200} height={60}/>
                            <Skeleton variant="rectangular" width={200} height={60}/>
                        </div>
                    </div>
                    <div className='w-full flex justify-start items-start gap-[50px]'>
                        <Skeleton variant="rectangular" width={'50%'} height={400}/>
                        <Skeleton variant="rectangular" width={'50%'} height={400}/>
                    </div>
                </>
                : product.error
                    ? product.error.message
                    :
                    <>
                        <div className='w-full flex justify-between items-center mb-[57px]'>
                            <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр товара</h1>

                            <div className='flex items-center gap-[10px]'>
                                <CustomRoundedButton
                                    variant='contained'
                                    type='button'
                                    startIcon={<EditIcon/>}
                                    onClick={() => {
                                        setModal({
                                            ...modalInitialValues,
                                            open: true,
                                            action: 'edit',
                                            requested: true,
                                        });
                                        handleConvertClientImages(product.result?.data).then((res) => {
                                            setModal({
                                                ...modalInitialValues,
                                                open: true,
                                                action: 'edit',
                                                values: {
                                                    ...modalInitialValues.values,
                                                    ...product.result?.data,
                                                    category: product.result?.data.category?.id,
                                                    images: res
                                                }
                                            });
                                        })
                                    }}
                                >
                                    Редактировать
                                </CustomRoundedButton>
                                <CustomRoundedButton
                                    color='error'
                                    variant='contained'
                                    type='button'
                                    startIcon={<DeleteIcon/>}
                                    onClick={() => {
                                        setModal({
                                            ...modalInitialValues,
                                            open: true,
                                            action: 'delete',
                                            values: {
                                                ...modalInitialValues.values,
                                                ...product.result?.data,
                                                category: product.result?.data.category?.id,
                                            }
                                        })
                                    }}
                                >
                                    Удалить
                                </CustomRoundedButton>
                            </div>
                        </div>

                        <div className='w-full flex justify-start items-start gap-[50px]'>
                            <div className="flex justify-start items-start gap-[20px]">
                                <div className="product-view__vertical-slider">
                                    <Slider {...vertical__settings} {...nav2 !== null ? {asNavFor: nav2} : {}} ref={(slider) => setNav1(slider)}>
                                        {product.result?.data.images.map((item: any, i: number) => (
                                            <div key={i} onClick={() => goToMainSlide(i)}>
                                                <div
                                                    className="product-view-vertical-slider__item"
                                                    style={{backgroundImage: `url(${item.image})`}}
                                                ></div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                                <div className="product-view__main-slider">
                                    <Slider {...settings}  {...nav1 !== null ? {asNavFor: nav1} : {}} ref={(slider) => setNav2(slider)}>
                                        {product.result?.data.images.map((item: any, i: number) => (
                                            <div key={i}>
                                                <div
                                                    className="product-view-main-slider__item"
                                                    style={{backgroundImage: `url(${item.image})`}}
                                                ></div>
                                            </div>
                                        ))}
                                    </Slider>
                                </div>
                            </div>
                            <div className="flex flex-col justify-start items-start">
                                <div className='flex justify-start items-end gap-[30px] mb-[40px]'>
                                    <div className='flex flex-col justify-start items-start gap-[10px]'>
                                        <p className='text-[#2A2826] text-[12px] font-[500]'>Наименование</p>
                                        <p className='text-[#2A2826] text-[24px] font-[700]'>{product.result?.data.title}</p>
                                    </div>
                                    <div
                                        className={`py-[4px] px-[10px] rounded-[10px] text-[#FFFFFF] text-[14px] font-[700] ${product.result?.data.in_stock ? 'bg-[#2A2826]' : 'bg-[#2A2826]'}`}>
                                        {product.result?.data.in_stock ? 'В наличии' : 'Нет в наличии'}
                                    </div>
                                </div>
                                <div className='flex justify-start items-end gap-[30px] mb-[40px]'>
                                    <div className='flex flex-col justify-start items-start gap-[10px]'>
                                        <p className='text-[#2A2826] text-[12px] font-[500]'>Код товара</p>
                                        <p className='text-[#2A2826] text-[20px] font-[600]'>{product.result?.data.barcode}</p>
                                    </div>
                                    <div className='flex flex-col justify-start items-start gap-[10px]'>
                                        <p className='text-[#2A2826] text-[12px] font-[500]'>Себестоимость</p>
                                        <p className='text-[#2A2826] text-[20px] font-[600]'>{product.result?.data.cost_price} сом</p>
                                    </div>
                                </div>
                                <div className='w-full flex flex-col justify-start items-start gap-[20px] mb-[50px]'>
                                    <div className="w-full product__prop">
                                        <div>Категория</div>
                                        <div>{product.result?.data.category?.name}</div>
                                    </div>
                                    <div className="w-full product__prop">
                                        <div>Проба</div>
                                        <div>{product.result?.data.sample_number}</div>
                                    </div>
                                    <div className="w-full product__prop">
                                        <div>Размер</div>
                                        <div>{product.result?.data.size} мм</div>
                                    </div>
                                    <div className="w-full product__prop">
                                        <div>Вес</div>
                                        <div>{product.result?.data.weight} гр</div>
                                    </div>
                                    <div className="w-full product__prop">
                                        <div>Б/У</div>
                                        <div>{product.result?.data.used ? 'Да' : 'Нет'}</div>
                                    </div>
                                </div>
                                <CustomRoundedButton
                                    variant='contained'
                                    type='button'
                                    startIcon={<LabelIcon/>}
                                    onClick={() => {
                                        window.open(product.result?.data.barcode_file, '_blank')
                                    }}
                                >
                                    Распечатать наклейку
                                </CustomRoundedButton>
                            </div>
                        </div>
                    </>
            }

            <Modal open={modal.open} onClose={() => setModal({
                ...modal,
                open: false
            })}>
                <form onSubmit={handleFormSubmit} className='mainModal'>
                    <h1 className='text-[#2A2826] text-[24px] font-[700]'>
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
            </Modal>
        </>
    );
}
