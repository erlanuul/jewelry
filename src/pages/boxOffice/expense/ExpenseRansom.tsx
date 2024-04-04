import React, {FormEvent, useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select} from "@mui/material";
import {StaffService} from "../../../services/StaffService";
import {checkModalResponse, ImageImport, ImageImportButton} from "../../../helpers/helpers";
import {CustomFormControl, CustomRoundedLoadingButton, CustomTextField} from "../../../helpers/muiCustomization";
import BoxOfficeFilterButtons from "../../../components/BoxOfficeFilterButtons";

const formInitialValues = {
    values: {
        operation_type: 'expense',
        operation: 'ransom',
        manager: '',
        payment_type: '',
        total_sum: '',
        metal:{
            sample_number: '',
            weight: '',
            images: [
                {
                    image: null
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
            ],
        }
    },
    validation: {
        error: {
            operation_type: false,
            operation: false,
            manager: false,
            payment_type: false,
        },
        message: {
            operation_type: '',
            operation: '',
            manager: '',
            payment_type: '',
        }
    },
    requested: false,
}

export default function ExpenseRansom() {
    const navigate = useNavigate()
    const [form, setForm] = useState<any>(formInitialValues)

    const operations = BoxOfficeService.GetBoxOfficeOperations({operation_type__slug: form.values.operation_type})
    const managersList = StaffService.GetFilteredStaffList({position__slug: 'manager'})
    const paymentTypes = BoxOfficeService.GetBoxOfficePaymentTypes()

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault()
        setForm({
            ...form,
            requested: true,
        })

        const values = {
            ...form.values,
            metal:{
                ...form.values.metal,
                images: [...form.values.metal.images].filter((item: any)=> item.image !== null)
            }
        }

        const form_data = new FormData()

        for (let key in values) {
            if(typeof values[key] === 'object'){
                for(let metalKey in values[key]){
                    if (Array.isArray(values[key][metalKey])) {
                        for (let i = 0; i < values[key][metalKey].length; i++) {
                            for (let keyImg in values[key][metalKey][i]) {
                                form_data.append(`${key}.${metalKey}[${i}]${keyImg}`, values[key][metalKey][i][keyImg]);
                            }
                        }
                    } else {
                        form_data.append(`${key}.${metalKey}`, values[key][metalKey]);
                    }
                }
            }else {
                form_data.append(key, values[key]);
            }
        }

        BoxOfficeService.CreateTransaction(form.values, form_data).then(()=>{
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
                            <CustomTextField
                                fullWidth
                                label='Проба'
                                placeholder='Проба'
                                type='number'
                                required
                                value={form.values.metal.sample_number}
                                onChange={(event) => {
                                    setForm({
                                        ...form,
                                        values: {
                                            ...form.values,
                                            metal: {
                                                ...form.values.metal,
                                                sample_number: event.target.value
                                            }
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
                                value={form.values.metal.weight}
                                onChange={(event) => {
                                    setForm({
                                        ...form,
                                        values: {
                                            ...form.values,
                                            metal: {
                                                ...form.values.metal,
                                                weight: event.target.value
                                            }
                                        }
                                    })
                                }}
                            />
                        </div>
                        <div className="w-full grid grid-cols-4 gap-[10px] mb-[60px]">
                            {form.values.metal.images.map((item: any, index: number) => (
                                <div
                                    className={`w-full min-h-[76px] ${index === 0 ? 'col-start-1 col-end-3 row-start-1 row-end-3' : 'h-[76px]'}`}
                                    key={index}>
                                    <ImageImport
                                        multiple={false}
                                        onChange={(event) => {
                                            if (event.target.files) {
                                                const imagesArr = form.values.metal.images
                                                const imagesFiles = event.target.files
                                                imagesArr[index].image = imagesFiles[0]
                                                setForm({
                                                    ...form,
                                                    values: {
                                                        ...form.values,
                                                        metal: {
                                                            ...form.values.metal,
                                                            images: imagesArr
                                                        }
                                                    }
                                                })
                                            }
                                        }}
                                        onDelete={() => {
                                            const imagesArr = form.values.metal.images
                                            if (imagesArr.length <= 4) {
                                                imagesArr[index].image = null
                                            } else {
                                                imagesArr.splice(index, 1)
                                            }
                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    metal: {
                                                        ...form.values.metal,
                                                        images: imagesArr
                                                    }
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
                                            const imagesArr = [...form.values.metal.images]
                                            const files = Array.from(event.target.files)

                                            for (let i = 0; i < imagesArr.length && files.length > 0; i++) {
                                                if (!imagesArr[i].image) {
                                                    imagesArr[i] = {image: files.shift()}
                                                }
                                            }
                                            while (files.length > 0) {
                                                imagesArr.push({image: files.shift()})
                                            }

                                            setForm({
                                                ...form,
                                                values: {
                                                    ...form.values,
                                                    metal: {
                                                        ...form.values.metal,
                                                        images: imagesArr
                                                    }
                                                }
                                            });
                                        }
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
