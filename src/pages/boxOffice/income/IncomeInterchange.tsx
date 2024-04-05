import React, {FormEvent, useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {
    Autocomplete,
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputLabel,
    MenuItem,
    Select
} from "@mui/material";
import {StaffService} from "../../../services/StaffService";
import {ClientService} from "../../../services/ClientService";
import {checkModalResponse} from "../../../helpers/helpers";
import AddIcon from "@mui/icons-material/Add";
import {ProductService} from "../../../services/ProductService";
import DeleteIcon from '@mui/icons-material/Delete';
import ClientCard from "../../../components/ClientCard";
import ClientAddModalButton from "../../../components/ClientAddModalButton";
import {CustomFormControl, CustomRoundedLoadingButton, CustomTextField} from "../../../helpers/muiCustomization";
import BoxOfficeFilterButtons from "../../../components/BoxOfficeFilterButtons";

const formInitialValues = {
    values: {
        operation_type: 'income',
        operation: 'interchange',
        client: '',
        client_full_name: '',
        client_info: null,
        manager: '',
        payment_type: '',
        store_products: [
            {
                barcode: '',
                product: '',
                product_title: '',
                price: '0',
            }
        ],
        customer_products: [
            {
                title: '',
                cost_price: '0',
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

export default function IncomeSale() {
    const navigate = useNavigate()
    const [form, setForm] = useState<any>(formInitialValues)

    const operations = BoxOfficeService.GetBoxOfficeOperations({operation_type__slug: form.values.operation_type})
    const managersList = StaffService.GetFilteredStaffList({position__slug: 'manager'})
    const clientsList = ClientService.SearchClient({search: form.values.client_full_name})
    const paymentTypes = BoxOfficeService.GetBoxOfficePaymentTypes()

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault()
        setForm({
            ...form,
            requested: true,
        })
        BoxOfficeService.CreateTransaction(form.values).then(()=>{
            navigate('/box_office')
        }).catch((err)=>{
            checkModalResponse(err.response.data, setForm, form);
        })
    }
    const handleSearchProduct = (barcode: any, index: number) => {
        const productsArr = form.values.store_products
        productsArr[index].barcode = barcode

        setForm({
            ...form,
            values: {
                ...form.values,
                store_products: productsArr
            }
        })
        ProductService.SearchProduct({barcode: barcode}).then((res: any)=>{
            if(Object.entries(res.data).length === 0){
                const productsArr = form.values.store_products
                productsArr[index].product_title = ''
                productsArr[index].product = ''

                setForm({
                    ...form,
                    values: {
                        ...form.values,
                        store_products: productsArr
                    }
                })
            }else{
                const productsArr = form.values.store_products
                productsArr[index].barcode = barcode
                productsArr[index].product_title = res.data.title
                productsArr[index].product = res.data.id

                setForm({
                    ...form,
                    values: {
                        ...form.values,
                        store_products: productsArr
                    }
                })
            }
        })
    }

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Добавить приход</h1>
            </div>

            <div className='w-full flex justify-between items-start gap-[20px]'>
                <form onSubmit={handleFormSubmit} className='w-full flex flex-col justify-start items-center'>
                    <div
                        className='w-full p-[20px] bg-white rounded-[10px] shadow-md flex flex-col justify-start items-start mb-[40px]'>

                        <BoxOfficeFilterButtons
                            operationsArr={operations}
                            operationType={form.values.operation_type}
                            operation={form.values.operation}
                            initialPage={'sale'}
                        />

                        <div className='w-full flex flex-col justify-start items-start gap-[20px] mb-[60px]'>
                            <div className="w-full grid grid-cols-2 gap-[20px]">
                                <Autocomplete
                                    clearOnEscape
                                    isOptionEqualToValue={(option: any, value) => option.full_name === value.full_name}
                                    getOptionLabel={(option: any) => option.full_name}
                                    options={!clientsList.loading && !clientsList.error ? [...clientsList.result?.data] : []}
                                    onChange={(event, value) => {
                                        setForm({
                                            ...form,
                                            values: {
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
                                        } else {
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
                                        <CustomTextField
                                            {...params}
                                            required
                                            label="Клиент"
                                        />
                                    )}
                                />
                                <CustomFormControl required>
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
                                </CustomFormControl>
                            </div>

                            <ClientAddModalButton/>
                        </div>

                        <div className="w-full mb-[30px] text-[#2A2826] text-[18px] font-[700]">Товар клиента</div>
                        <div className="w-full flex flex-col justify-start items-start gap-[20px] mb-[60px]">
                            {form.values.customer_products.map((items: any, index: number) => (
                                <div key={index} className='w-full grid grid-cols-3 gap-[20px]'>
                                    <CustomTextField
                                        fullWidth
                                        label='Наименование'
                                        placeholder='Наименование'
                                        required
                                        value={items.title}
                                        onChange={(event) => {
                                            const productsArr = form.values.customer_products
                                            productsArr[index].title = event.target.value
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    customer_products: productsArr
                                                }
                                            })
                                        }}
                                    />
                                    <div className='w-full flex items-end gap-[20px]'>
                                        <CustomTextField
                                            fullWidth
                                            label='Себестоимость'
                                            placeholder='Себестоимость'
                                            required
                                            value={items.cost_price}
                                            onChange={(event) => {
                                                const productsArr = form.values.customer_products
                                                productsArr[index].cost_price = event.target.value
                                                setForm({
                                                    ...form,
                                                    values: {
                                                        ...form.values,
                                                        customer_products: productsArr
                                                    }
                                                })
                                            }}
                                        />
                                        {form.values.customer_products.length > 1 &&
                                            <IconButton
                                                size='large'
                                                sx={{padding: '16px'}}
                                                onClick={() => {
                                                    const productsArr = form.values.customer_products
                                                    productsArr.splice(index, 1)

                                                    setForm({
                                                        ...form,
                                                        values: {
                                                            ...form.values,
                                                            customer_products: productsArr
                                                        }
                                                    })
                                                }}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        }
                                    </div>

                                </div>
                            ))}
                        </div>
                        <div className='w-full flex justify-end items-center'>
                            <Button
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setForm({
                                        ...form,
                                        values: {
                                            ...form.values,
                                            customer_products: [...form.values.customer_products, {
                                                title: '',
                                                cost_price: '0',
                                            }]
                                        }
                                    })
                                }}
                            >
                                Добавить
                            </Button>
                        </div>

                        <div className="w-full mb-[30px] text-[#2A2826] text-[18px] font-[700]">Товар магазина</div>
                        <div className="w-full flex flex-col justify-start items-start gap-[20px] mb-[30px]">
                            {form.values.store_products.map((items: any, index: number) => (
                                <div key={index} className='w-full grid grid-cols-3 gap-[20px]'>
                                    <CustomTextField
                                        fullWidth
                                        label='Код товара'
                                        placeholder='Код товара'
                                        required
                                        value={items.barcode}
                                        onChange={(event) => handleSearchProduct(event.target.value, index)}
                                    />
                                    <CustomTextField
                                        fullWidth
                                        label='Товар'
                                        placeholder='Товар'
                                        required
                                        disabled
                                        value={items.product_title}
                                    />
                                    <div className='w-full flex items-end gap-[20px]'>
                                        <CustomTextField
                                            fullWidth
                                            label='Сумма'
                                            placeholder='Сумма'
                                            required
                                            disabled={items.product_title === ''}
                                            value={items.price}
                                            onChange={(event) => {
                                                const productsArr = form.values.store_products
                                                productsArr[index].price = event.target.value
                                                setForm({
                                                    ...form,
                                                    values: {
                                                        ...form.values,
                                                        store_products: productsArr
                                                    }
                                                })
                                            }}
                                        />
                                        {form.values.store_products.length > 1 &&
                                            <IconButton
                                                size='large'
                                                sx={{padding: '16px'}}
                                                onClick={() => {
                                                    const productsArr = form.values.store_products
                                                    productsArr.splice(index, 1)

                                                    setForm({
                                                        ...form,
                                                        values: {
                                                            ...form.values,
                                                            store_products: productsArr
                                                        }
                                                    })
                                                }}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        }
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className='w-full flex justify-between items-center'>
                            <FormControl sx={{minWidth: 250}} variant='outlined' size='small' required>
                                <InputLabel>Способ оплаты</InputLabel>
                                <Select
                                    label="Способ оплаты"
                                    placeholder='Способ оплаты'
                                    sx={{borderRadius: 100}}
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

                            <Button
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setForm({
                                        ...form,
                                        values: {
                                            ...form.values,
                                            store_products: [...form.values.store_products, {
                                                barcode: '',
                                                product: '',
                                                product_title: '',
                                                price: '0',
                                            }]
                                        }
                                    })
                                }}
                            >
                                Добавить
                            </Button>
                        </div>
                    </div>

                    <div className='w-full flex justify-between items-center pt-[20px] mb-[60px]'
                         style={{borderTop: '2px solid #CED0D2'}}>
                        <p className='text-[#6E6C6A] text-[16px] font-[600]'>
                            Количество товаров: {form.values.store_products.length}
                        </p>
                        <p className='text-[#2A2826] text-[20px] font-[100]'>
                            К
                            оплате: {[...form.values.store_products].reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.price), 0) - [...form.values.customer_products].reduce((accumulator, currentValue) => accumulator + parseInt(currentValue.cost_price), 0)} сом
                        </p>
                    </div>

                    <CustomRoundedLoadingButton
                        variant='contained'
                        type='submit'
                        sx={{minWidth: 250}}
                        loading={form.requested}
                        disabled={form.requested}
                    >
                        Подтвердить
                    </CustomRoundedLoadingButton>
                </form>

                {form.values.client_info !== null && <ClientCard clientInfo={form.values.client_info}/>}
            </div>
        </>
    );
}
