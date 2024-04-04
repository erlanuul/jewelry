import React, {FormEvent, useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import {StaffService} from "../../../services/StaffService";
import {checkModalResponse} from "../../../helpers/helpers";
import {CustomFormControl, CustomRoundedLoadingButton, CustomTextField} from "../../../helpers/muiCustomization";
import BoxOfficeFilterButtons from "../../../components/BoxOfficeFilterButtons";

const formInitialValues = {
    values: {
        operation_type: 'expense',
        operation: 'prepayment',
        manager: '',
        payment_type: '',
        total_sum: '',
        note: '',
    },
    validation: {
        error: {
            operation_type: false,
            operation: false,
            manager: false,
            payment_type: false,
            total_sum: false,
            note: false,
        },
        message: {
            operation_type: '',
            operation: '',
            manager: '',
            payment_type: '',
            total_sum: '',
            note: '',
        }
    },
    requested: false,
}

export default function ExpensePrepayment() {
    const navigate = useNavigate()
    const [form, setForm] = useState<any>(formInitialValues)

    const operations = BoxOfficeService.GetBoxOfficeOperations({operation_type__slug: form.values.operation_type})
    const managersList = StaffService.GetFilteredStaffList()
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

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Добавить расход </h1>
            </div>

            <form onSubmit={handleFormSubmit} className='w-[570px] flex flex-col justify-start items-center'>
                <div
                    className='w-full p-[20px] bg-white rounded-[10px] shadow-md flex flex-col justify-start items-start mb-[40px]'>

                    <BoxOfficeFilterButtons
                        operationsArr={operations}
                        operationType={form.values.operation_type}
                        operation={form.values.operation}
                        initialPage={'ransom'}
                    />

                    <div className='w-full flex flex-col justify-start items-start gap-[20px]'>
                        <div className="w-full grid grid-cols-2 gap-[30px] mb-[60px]">
                            <CustomFormControl required>
                                <InputLabel>Менеджер</InputLabel>
                                <Select
                                    label="Сотрудник"
                                    placeholder='Сотрудник'
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
                            <CustomTextField
                                fullWidth
                                label='Сумма'
                                placeholder='Сумма'
                                type='number'
                                required
                                value={form.values.total_sum}
                                onChange={(event) => {
                                    setForm({
                                        ...form,
                                        values: {
                                            ...form.values,
                                            total_sum: event.target.value
                                        }
                                    })
                                }}
                            />

                            <div className='w-full row-start-2 row-end-3 col-start-1 col-end-3'>
                                <CustomTextField
                                    fullWidth
                                    label='Примечание'
                                    placeholder='Примечание'
                                    type='text'
                                    InputProps={{
                                        sx: {
                                            borderRadius: '10px !important',
                                        }
                                    }}
                                    multiline
                                    maxRows={4}
                                    required
                                    value={form.values.note}
                                    onChange={(event) => {
                                        setForm({
                                            ...form,
                                            values: {
                                                ...form.values,
                                                note: event.target.value
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>
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
        </>
    );
}
