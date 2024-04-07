import React, {FormEvent, useEffect, useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {Autocomplete, FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import {ClientService} from "../../../services/ClientService";
import {checkModalResponse} from "../../../helpers/helpers";
import ClientCard from "../../../components/ClientCard";
import ClientAddModalButton from "../../../components/ClientAddModalButton";
import {CustomRoundedLoadingButton, CustomTextField} from "../../../helpers/muiCustomization";
import BoxOfficeFilterButtons from "../../../components/BoxOfficeFilterButtons";

const formInitialValues = {
    values: {
        operation_type: 'income',
        operation: 'payment',
        client: '',
        client_full_name: '',
        client_info: null,
        payment_type: '',
        products: [],
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

export default function IncomePayment() {
    const navigate = useNavigate()
    const [form, setForm] = useState<any>(formInitialValues)

    const operations = BoxOfficeService.GetBoxOfficeOperations({operation_type__slug: form.values.operation_type})
    const clientsList = ClientService.SearchClient({search: form.values.client_full_name})
    const paymentTypes = BoxOfficeService.GetBoxOfficePaymentTypes()
    const productsList = BoxOfficeService.GetBoxOfficePaymentProducts(form.values, {cash__client: form.values.client})

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault()
        setForm({
            ...form,
            requested: true,
        })
        BoxOfficeService.CreateTransaction(form.values).then(()=>{
            setForm(formInitialValues)
            navigate('/box_office')
        }).catch((err)=>{
            checkModalResponse(err.response.data, setForm, form);
        })
    }

    useEffect(() => {
        if(!productsList.loading && !productsList.error){
            setForm({
                ...form,
                values:{
                    ...form.values,
                    products: [...productsList.result?.data].map((item: any)=>({
                        ...item,
                        amount: '0',
                    }))
                }
            })
        }
    }, [productsList.loading, productsList.error]);


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
                            <div className="w-full grid gap-[20px]">
                                <Autocomplete
                                    clearOnEscape
                                    sx={{width: 250}}
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
                            </div>
                        </div>

                        {form.values.products.length > 0 &&
                            <div className="w-full flex flex-col justify-start items-start gap-[20px] mb-[30px]">
                                <div className='w-full grid grid-cols-5 gap-[20px] pb-[10px] mb-[10px]'
                                     style={{borderBottom: '1px solid #576ED0'}}
                                >
                                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Бар код:</p>
                                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Наименование:</p>
                                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Сумма:</p>
                                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Остаток:</p>
                                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Сумма*</p>
                                </div>
                                {form.values.products.map((item: any, index: number) => (
                                    <div key={index} className='w-full grid grid-cols-5 gap-[20px]'>
                                        <div className='flex justify-start items-center'>
                                            <p className='text-[#2A2826] text-[14px] font-[500]'>{item.product.barcode}</p>
                                        </div>
                                        <div className='flex justify-start items-center'>
                                            <p className='text-[#2A2826] text-[14px] font-[500]'>{item.product.title}</p>
                                        </div>
                                        <div className='flex justify-start items-center'>
                                            <p className='text-[#2A2826] text-[14px] font-[500]'>{item.price}</p>
                                        </div>
                                        <div className='flex justify-start items-center'>
                                            <p className='text-[#2A2826] text-[14px] font-[500]'>{item.remains}</p>
                                        </div>


                                        <input
                                            type="number"
                                            required
                                            className='rounded-[100px] bg-[#F6F6F6] h-[36px] px-[20px]'
                                            value={item.amount}
                                            onChange={(event) => {
                                                const products = form.values.products
                                                let inputValue = event.target.value
                                                let quantity_for_check = products[index].remains
                                                let currentValue

                                                if(inputValue !== '' && inputValue < '0') {
                                                    inputValue = '0'
                                                }
                                                if(inputValue > quantity_for_check){
                                                    currentValue = quantity_for_check
                                                }else {
                                                    currentValue = inputValue
                                                }

                                                products[index].amount = currentValue

                                                setForm({
                                                    ...form,
                                                    values: {
                                                        ...form.values,
                                                        products: products
                                                    }
                                                })
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        }


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
                        </div>
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
