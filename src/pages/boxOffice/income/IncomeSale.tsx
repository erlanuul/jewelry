import React, {FormEvent, useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {Autocomplete, Button, FormHelperText, IconButton, InputLabel, MenuItem} from "@mui/material";
import {StaffService} from "../../../services/StaffService";
import {ClientService} from "../../../services/ClientService";
import {checkModalResponse} from "../../../helpers/helpers";
import AddIcon from "@mui/icons-material/Add";
import {LoadingButton} from "@mui/lab";
import {ProductService} from "../../../services/ProductService";
import DeleteIcon from '@mui/icons-material/Delete';
import ClientCard from "../../../components/ClientCard";
import ClientAddModalButton from "../../../components/ClientAddModalButton";
import {
    CustomFormControl,
    CustomSelect,
    CustomTextField
} from "../../../helpers/muiCustomization";

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
                price: '0',
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
        const productsArr = form.values.products
        productsArr[index].barcode = barcode

        setForm({
            ...form,
            values: {
                ...form.values,
                products: productsArr
            }
        })
        ProductService.SearchProduct({barcode: barcode}).then((res: any)=>{
            if(Object.entries(res.data).length === 0){
                const productsArr = form.values.products
                productsArr[index].product_title = ''
                productsArr[index].product = ''

                setForm({
                    ...form,
                    values: {
                        ...form.values,
                        products: productsArr
                    }
                })
            }else{
                const productsArr = form.values.products
                productsArr[index].barcode = barcode
                productsArr[index].product_title = res.data.title
                productsArr[index].product = res.data.id

                setForm({
                    ...form,
                    values: {
                        ...form.values,
                        products: productsArr
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
                <form onSubmit={handleFormSubmit} className='flex flex-col justify-start items-center'>
                    <div className='w-full p-[20px] bg-white rounded-[10px] shadow-md flex flex-col justify-start items-start mb-[40px]'>
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
                            <div className="w-full flex justify-start items-start gap-[20px]">
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
                                        <CustomTextField
                                            {...params}
                                            required
                                            label="Клиент"
                                        />
                                    )}
                                />
                                <CustomFormControl sx={{minWidth: 250}} required>
                                    <InputLabel>Менеджер</InputLabel>
                                    <CustomSelect
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
                                    </CustomSelect>
                                    {form.validation.message.manager !== '' &&
                                        <FormHelperText>{form.validation.message.manager}</FormHelperText>
                                    }
                                </CustomFormControl>
                            </div>

                            <ClientAddModalButton/>
                        </div>

                        <div className="w-full flex flex-col justify-start items-start gap-[20px] mb-[30px]">
                            {form.values.products.map((items: any, index: number)=> (
                                <div key={index} className='w-full flex justify-start items-start gap-[20px]'>
                                    <CustomTextField
                                        sx={{minWidth: 250}}
                                        fullWidth
                                        label='Код товара'
                                        placeholder='Код товара'
                                        required
                                        value={items.barcode}
                                        onChange={(event) => handleSearchProduct(event.target.value, index)}
                                    />
                                    <CustomTextField
                                        sx={{minWidth: 250}}
                                        fullWidth
                                        label='Товар'
                                        placeholder='Товар'
                                        required
                                        disabled
                                        value={items.product_title}
                                    />
                                    <CustomTextField
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

                                    {form.values.products.length > 1 &&
                                        <IconButton
                                            size='large'
                                            onClick={()=>{
                                                const productsArr = form.values.products
                                                productsArr.splice(index, 1)

                                                setForm({
                                                    ...form,
                                                    values:{
                                                        ...form.values,
                                                        products: productsArr
                                                    }
                                                })
                                            }}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    }
                                </div>
                            ))}
                        </div>

                        <div className='w-full flex justify-between items-end'>
                            <CustomFormControl sx={{minWidth: 250}} required>
                                <InputLabel>Способ оплаты</InputLabel>
                                <CustomSelect
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
                                </CustomSelect>
                                {form.validation.message.payment_type !== '' &&
                                    <FormHelperText>{form.validation.message.payment_type}</FormHelperText>
                                }
                            </CustomFormControl>

                            <Button
                                startIcon={<AddIcon/>}
                                onClick={() => {
                                    setForm({
                                        ...form,
                                        values:{
                                            ...form.values,
                                            products: [...form.values.products, {
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
                            Количество товаров: {form.values.products.length}
                        </p>
                        <p className='text-[#2A2826] text-[20px] font-[100]'>
                            К оплате: {[...form.values.products].reduce((accumulator, currentValue)=> accumulator + parseInt(currentValue.price), 0)} сом
                        </p>
                    </div>

                    <LoadingButton
                        color='blue'
                        variant='contained'
                        type='submit'
                        sx={{minWidth: 250}}
                        loading={form.requested}
                        disabled={form.requested}
                    >
                        Подтвердить
                    </LoadingButton>
                </form>

                {form.values.client_info !== null && <ClientCard clientInfo={form.values.client_info}/>}
            </div>
        </>
    );
}
