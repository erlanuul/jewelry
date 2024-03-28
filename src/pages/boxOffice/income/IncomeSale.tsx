import React, {FormEvent, useEffect, useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem, Modal,
    Select,
    TextField
} from "@mui/material";
import {StaffService} from "../../../services/StaffService";
import {ClientService} from "../../../services/ClientService";
import {checkModalResponse, ImageImport, ImageImportButton} from "../../../helpers/helpers";
import AddIcon from "@mui/icons-material/Add";
import Slider from "react-slick";
import InputMask from "react-input-mask";
import {LoadingButton} from "@mui/lab";

const formInitialValues = {
    values: {
        operation_type: 'income',
        operation: 'sale',
        client: '',
        client_full_name: '',
        client_info: null,
        manager: '',
        payment_type: '',
        products: [
            {
                barcode: '',
                product: '',
                product_title: '',
                price: '',
            }
        ],
    },
    validation: {
        error: {
            operation_type: false,
            operation: false,
            client: false,
            manager: false,
            payment_type: false,
        },
        message: {
            operation_type: '',
            operation: '',
            client: '',
            manager: '',
            payment_type: '',
        }
    },
    requested: false,
}

const clientModalInitialValues = {
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
export default function IncomeSale() {
    const navigate = useNavigate()
    const [form, setForm] = useState(formInitialValues)

    const [clientModal, setClientModal] = useState<any>(clientModalInitialValues)
    const handleClientFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setClientModal({
            ...clientModal,
            requested: true,
        });
        const values = {
            ...clientModal.values,
            images: [...clientModal.values.images].filter((item: any)=> item.image !== null)
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

        switch (clientModal.action) {
            case 'add':
                ClientService.CreateClient(form_data).then(() => {
                    setClientModal(clientModalInitialValues);
                }).catch((err) => {
                    checkModalResponse(err.response.data, setClientModal, clientModal);
                })
                break;
        }
    };

    const operations = BoxOfficeService.GetBoxOfficeOperations({operation_type__slug: form.values.operation_type})
    const managersList = StaffService.GetFilteredStaffList({position__slug: 'manager'})
    const clientsList = ClientService.SearchClient({search: form.values.client_full_name})
    const paymentTypes = BoxOfficeService.GetBoxOfficePaymentTypes()

    useEffect(()=>{
        console.log(form.values)
    },[form.values])

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
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Добавить приход</h1>
            </div>

            <div className='w-full flex justify-between items-start gap-[20px]'>
                <div className='flex flex-col justify-start items-center'>
                    <div className='w-full p-[30px] bg-white rounded-[10px] flex flex-col justify-start items-start'>
                        <div className='rounded-[100px] bg-[#F4F5F7] flex items-center mb-[40px]'>
                            {!operations.loading && !operations.error && operations.result?.data.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className={`px-[20px] py-[8px] rounded-[100px] text-[12px] font-[500] cursor-pointer hover:bg-[#576ED0] hover:text-white ${item.slug === form.values.operation ? 'text-white bg-[#576ED0]' : ' text-[#292929]'}`}
                                    onClick={()=>{
                                        navigate({
                                            pathname: `/box_office/${form.values.operation_type}${item.slug === 'sale' ? '' : `/${item.slug}` }`
                                        })
                                    }}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>

                        <div className='w-full flex flex-col justify-start items-start gap-[20px] mb-[60px]'>
                            <div className="w-full flex justify-start items-end gap-[30px]">
                                <Autocomplete
                                    clearOnEscape
                                    sx={{ width: 250 }}
                                    isOptionEqualToValue={(option: any, value) => option.full_name === value.full_name}
                                    getOptionLabel={(option:any) => option.full_name}
                                    options={!clientsList.loading && !clientsList.error ? [...clientsList.result?.data] : []}
                                    onChange={(event, value) => {
                                        setForm({
                                            ...form,
                                            values:{
                                                ...form.values,
                                                client: value !== null ? value.id : '',
                                                client_full_name: value !== null ? value.full_name : '',
                                                client_info: value !== null ? value : null,
                                            }
                                        })
                                    }}
                                    onInputChange={(event, inputValue) => {
                                        if (!inputValue) {
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    client: '',
                                                    client_full_name: '',
                                                    client_info: null,
                                                }
                                            });
                                        }
                                        else {
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    client_full_name: inputValue,
                                                }
                                            })
                                        }
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            required
                                            label="Клиент"
                                        />
                                    )}
                                />
                                <FormControl sx={{minWidth: 250}} required>
                                    <InputLabel>Менеджер</InputLabel>
                                    <Select
                                        label="Менеджер"
                                        placeholder='Менеджер'
                                        required
                                        value={form.values.manager}
                                        error={form.validation.error.manager}
                                        onChange={(event) => {
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    manager: event.target.value,
                                                }
                                            })
                                        }}
                                    >
                                        {managersList.loading
                                            ? <div>loading</div>
                                            : managersList.error
                                                ? <div>Error</div>
                                                : managersList.result?.data.map((item: any) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.full_name}</MenuItem>
                                                ))
                                        }
                                    </Select>
                                    {form.validation.message.manager !== '' &&
                                        <FormHelperText>{form.validation.message.manager}</FormHelperText>
                                    }
                                </FormControl>
                            </div>

                            <Button
                                color='blue'
                                variant='contained'
                                type='submit'
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setClientModal({
                                        ...clientModalInitialValues,
                                        open: true,
                                        action: 'add',
                                    })
                                }}
                            >
                                Добавить клиента
                            </Button>
                        </div>

                        <div className="w-full flex flex-col justify-start items-start gap-[20px] mb-[30px]">
                            {form.values.products.map((items: any, index: number)=> (
                                <div key={index} className='w-full flex justify-start items-end gap-[30px]'>
                                    <TextField
                                        sx={{minWidth: 250}}
                                        fullWidth
                                        label='Код товара'
                                        placeholder='Код товара'
                                        required
                                        value={items.barcode}
                                        onChange={(event) => {
                                            const productsArr = form.values.products
                                            productsArr[index].barcode = event.target.value

                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    products: productsArr
                                                }
                                            })
                                        }}
                                    />
                                    <TextField
                                        sx={{minWidth: 250}}
                                        fullWidth
                                        label='Товар'
                                        placeholder='Товар'
                                        required
                                        disabled
                                        value={items.product_title}
                                    />
                                    <TextField
                                        sx={{minWidth: 250}}
                                        fullWidth
                                        label='Сумма'
                                        placeholder='Сумма'
                                        required
                                        disabled={items.product_title === ''}
                                        value={items.price}
                                        onChange={(event) => {
                                            const productsArr = form.values.products
                                            productsArr[index].price = event.target.value
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    products: productsArr
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            <FormControl sx={{minWidth: 250}} required>
                                <InputLabel>Способ оплаты</InputLabel>
                                <Select
                                    label="Способ оплаты"
                                    placeholder='Способ оплаты'
                                    required
                                    value={form.values.payment_type}
                                    error={form.validation.error.payment_type}
                                    onChange={(event) => {
                                        setForm({
                                            ...form,
                                            values: {
                                                ...form.values,
                                                payment_type: event.target.value,
                                            }
                                        })
                                    }}
                                >
                                    {paymentTypes.loading
                                        ? <div>loading</div>
                                        : paymentTypes.error
                                            ? <div>Error</div>
                                            : paymentTypes.result?.data.map((item: any) => (
                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                            ))
                                    }
                                </Select>
                                {form.validation.message.payment_type !== '' &&
                                    <FormHelperText>{form.validation.message.payment_type}</FormHelperText>
                                }
                            </FormControl>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={clientModal.open} onClose={() => setClientModal(clientModalInitialValues)}>
                {clientModal.action === 'viewImages'
                    ?
                    <div className='clientModalSlider'>
                        <Slider {...settings}>
                            {clientModal.values.images.map((item: any, index: number) => (
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
                    <form onSubmit={handleClientFormSubmit} className='mainModal'>
                        <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                        {clientModal.action === 'add' && 'Добавление клиента'}
                            {clientModal.action === 'delete' && 'Удалить клиента?'}
                            {clientModal.action === 'edit' && 'Редактирование клиента'}
                        </h1>
                        {clientModal.action !== 'delete' &&
                            <div className='w-full flex flex-col justify-start items-center gap-[30px]'>
                                <div className='w-full grid grid-cols-2 gap-[30px]'>
                                    <TextField
                                        fullWidth
                                        label='ФИО'
                                        placeholder='ФИО'
                                        required
                                        value={clientModal.values.full_name}
                                        error={clientModal.validation.error.full_name}
                                        helperText={clientModal.validation.message.full_name}
                                        onChange={(event) => {
                                            setClientModal({
                                                ...clientModal,
                                                values: {
                                                    ...clientModal.values,
                                                    full_name: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                    <InputMask
                                        mask="9(999)-999-999"
                                        value={clientModal.values.phone}
                                        onChange={(event) => {
                                            setClientModal({
                                                ...clientModal,
                                                values: {
                                                    ...clientModal.values,
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
                                            error={clientModal.validation.error.phone}
                                            helperText={clientModal.validation.message.phone}
                                            required
                                        />
                                    </InputMask>
                                    <TextField
                                        fullWidth
                                        label='Адрес'
                                        placeholder='Адрес'
                                        type='text'
                                        required
                                        value={clientModal.values.address}
                                        error={clientModal.validation.error.address}
                                        helperText={clientModal.validation.message.address}
                                        onChange={(event) => {
                                            setClientModal({
                                                ...clientModal,
                                                values: {
                                                    ...clientModal.values,
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
                                            value={clientModal.values.solvency === '' ? '' : clientModal.values.solvency ? 'true' : 'false'}
                                            error={clientModal.validation.error.solvency}
                                            onChange={(event) => {
                                                setClientModal({
                                                    ...clientModal,
                                                    values: {
                                                        ...clientModal.values,
                                                        solvency: event.target.value === 'true',
                                                    }
                                                })
                                            }}
                                        >
                                            <MenuItem value={'false'}>Нет</MenuItem>
                                            <MenuItem value={'true'}>Да</MenuItem>
                                        </Select>
                                        {clientModal.validation.message.solvency !== '' &&
                                            <FormHelperText>{clientModal.validation.message.solvency}</FormHelperText>
                                        }
                                    </FormControl>
                                    <TextField
                                        fullWidth
                                        label='ИНН'
                                        placeholder='ИНН'
                                        type='number'
                                        required
                                        value={clientModal.values.inn}
                                        error={clientModal.validation.error.inn}
                                        helperText={clientModal.validation.message.inn}
                                        onChange={(event) => {
                                            setClientModal({
                                                ...clientModal,
                                                values: {
                                                    ...clientModal.values,
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
                                        value={clientModal.values.note}
                                        error={clientModal.validation.error.note}
                                        helperText={clientModal.validation.message.note}
                                        onChange={(event) => {
                                            setClientModal({
                                                ...clientModal,
                                                values: {
                                                    ...clientModal.values,
                                                    note: event.target.value,
                                                }
                                            })
                                        }}
                                    />
                                </div>
                                <div className="w-full grid grid-cols-4 gap-[10px]">
                                    {clientModal.values.images.map((item: any, index: number) => (
                                        <div className={`w-full min-h-[76px] ${index === 0 ? 'col-start-1 col-end-3 row-start-1 row-end-3' : 'h-[76px]'}`}
                                             key={index}>
                                            <ImageImport
                                                multiple={false}
                                                onChange={(event) => {
                                                    if (event.target.files) {
                                                        const imagesArr = clientModal.values.images
                                                        const imagesFiles = event.target.files
                                                        imagesArr[index].image = imagesFiles[0]
                                                        setClientModal({
                                                            ...clientModal,
                                                            values: {
                                                                ...clientModal.values,
                                                                images: imagesArr
                                                            }
                                                        })
                                                    }
                                                }}
                                                onDelete={()=>{
                                                    const imagesArr = clientModal.values.images
                                                    if(imagesArr.length <= 4) {
                                                        imagesArr[index].image = null
                                                    }else {
                                                        imagesArr.splice(index, 1)
                                                    }
                                                    setClientModal({
                                                        ...clientModal,
                                                        values: {
                                                            ...clientModal.values,
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
                                                    const imagesArr = [...clientModal.values.images]
                                                    const files = Array.from(event.target.files)

                                                    for (let i = 0; i < imagesArr.length && files.length > 0; i++) {
                                                        if (!imagesArr[i].image) {
                                                            imagesArr[i] = { image: files.shift() }
                                                        }
                                                    }
                                                    while (files.length > 0) {
                                                        imagesArr.push({ image: files.shift() })
                                                    }

                                                    setClientModal({
                                                        ...clientModal,
                                                        values: {
                                                            ...clientModal.values,
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
                                onClick={() => setClientModal(clientModalInitialValues)}
                            >
                                Отменить
                            </Button>
                            <LoadingButton
                                fullWidth
                                variant='contained'
                                loading={clientModal.requested}
                                disabled={clientModal.requested}
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
