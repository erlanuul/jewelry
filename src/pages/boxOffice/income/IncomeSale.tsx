import React, {useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import {
    Autocomplete,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import {StaffService} from "../../../services/StaffService";

const formInitialValues = {
    values: {
        operation_type: 'income',
        operation: 'sale',
        client: '',
        manager: '',
        payment_type: '',
        products: [
            {
                product: '',
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

export default function IncomeSale() {
    const navigate = useNavigate()
    const [form, setForm] = useState(formInitialValues)

    const operations = BoxOfficeService.GetBoxOfficeOperations({operation_type__slug: form.values.operation_type})
    const managersList = StaffService.GetManagersList()

    const [client, setClient] = useState({})
    const [clientSearch, setClientSearch] = useState('')

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

                        <div className='w-full flex flex-col justify-start items-start gap-[20px]'>
                            <div className="w-full flex justify-start items-end gap-[30px]">
                                <Autocomplete
                                    freeSolo
                                    sx={{ width: 250 }}
                                    disableClearable
                                    isOptionEqualToValue={(option: any, value) => option.full_name === value.full_name}
                                    getOptionLabel={(option:any) => option.full_name}
                                    options={[].map((option: any) => option.title)}
                                    value={client}
                                    onChange={(event: any, newValue: any) => {
                                        console.log(newValue)
                                        setClient(newValue);
                                    }}
                                    inputValue={clientSearch}
                                    onInputChange={(event, newInputValue) => {
                                        setClientSearch(newInputValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Клиент"
                                            InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                            }}
                                        />
                                    )}
                                />
                                <FormControl sx={{minWidth: 250}} required>
                                    <InputLabel>Менеджер*</InputLabel>
                                    <Select
                                        label="Менеджер*"
                                        placeholder='Менеджер*'
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
