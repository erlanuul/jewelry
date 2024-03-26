import React, {FormEvent, useEffect, useState} from 'react';
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import {StaffService} from "../../services/StaffService";
import {checkModalResponse} from "../../helpers/helpers";
import {DataGrid} from "@mui/x-data-grid";
import {LoadingButton, Pagination} from "@mui/lab";
import {PositionsService} from "../../services/PositionsService";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import InputMask from "react-input-mask";

const modalInitialValues = {
    values: {
        id: '',
        full_name: '',
        position: '',
        phone: '',
        address: '',
        salary: '',
        percentage_of_the_sale: '',
        password: '',
        confirm_password: '',
    },
    validation: {
        error: {
            full_name: false,
            position: false,
            phone: false,
            address: false,
            salary: false,
            percentage_of_the_sale: false,
            password: false,
            confirm_password: false,
        },
        message: {
            full_name: '',
            position: '',
            phone: '',
            address: '',
            salary: '',
            percentage_of_the_sale: '',
            password: '',
            confirm_password: '',
        },
    },
    open: false,
    requested: false,
    showPassword: false,
    action: '',
}

const tableInitialValues = {
    rows: [],
    filter: {
        page: 1,
        size: 20,
        total_pages: 1,
    },
};


export default function Staffs() {
    const [table, setTable] = useState<any>({
        ...tableInitialValues,
        columns: [
            {field: 'id', headerName: 'ID', flex: 1},
            {field: 'full_name', headerName: 'Имя сотрудника', flex: 1},
            {
                field: 'position', headerName: 'Должность', flex: 1, renderCell: (params: any) =>
                    params.row.position?.name
            },
            {field: 'phone', headerName: 'Номер телефона', flex: 1},
            {field: 'address', headerName: 'Адрес', flex: 1},
            {field: 'date_joined', headerName: 'Дата приема на работу', flex: 1},
            {field: 'salary', headerName: 'Оклад', flex: 1},
            {field: 'percentage_of_the_sale', headerName: 'Процент за продажу', flex: 1},
            {
                field: 'actions', headerName: 'Действия', width: 120, renderCell: (params: any) => (
                    <div className='w-full flex items-center justify-center'>
                        <IconButton color="secondary" onClick={() => {
                            setModal({
                                ...modalInitialValues,
                                open: true,
                                action: 'edit',
                                values: {
                                    ...modalInitialValues.values,
                                    ...params.row,
                                    position: params.row.position?.id,
                                }
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

    const positionsList = PositionsService.GetPositionsList()
    const tableList = StaffService.GetStaffList(table.filter)

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        setModal({
            ...modal,
            requested: true,
        });

        switch (modal.action) {
            case 'add':
                StaffService.CreateStaff(modal.values).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'edit':
                StaffService.EditStaff(modal.values).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })
                break;

            case 'delete':
                StaffService.DeleteStaff(modal.values.id).then(() => {
                    setModal(modalInitialValues);
                    tableList.execute();
                }).catch((err) => {
                    checkModalResponse(err.response.data, setModal, modal);
                })

                break;
        }
    };

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
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Сотрудники</h1>

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
                    Добавить сотрудника
                </Button>
            </div>

            <div className='w-full rounded-[10px] shadow-md'>
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
                <form onSubmit={handleFormSubmit} className='mainModal'>
                    <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                        {modal.action === 'add' && 'Добавление сотрудника'}
                        {modal.action === 'delete' && 'Удалить сотрудника?'}
                        {modal.action === 'edit' && 'Редактирование сотрудника'}
                    </h1>
                    {modal.action !== 'delete' &&
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
                            <FormControl fullWidth required>
                                <InputLabel>Должность</InputLabel>
                                <Select
                                    label="Должность"
                                    placeholder='Должность'
                                    required
                                    value={modal.values.position}
                                    error={modal.validation.error.position}
                                    onChange={(event) => {
                                        setModal({
                                            ...modal,
                                            values: {
                                                ...modal.values,
                                                position: event.target.value,
                                            }
                                        })
                                    }}
                                >
                                    {positionsList.loading
                                        ? <div>loading</div>
                                        : positionsList.error
                                            ? <div>Error</div>
                                            : positionsList.result?.data.map((item: any) => (
                                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                                            ))
                                    }
                                </Select>
                                {modal.validation.message.position !== '' &&
                                    <FormHelperText>{modal.validation.message.position}</FormHelperText>
                                }
                            </FormControl>
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
                            <TextField
                                fullWidth
                                label='Оклад'
                                placeholder='Оклад'
                                type='number'
                                required
                                value={modal.values.salary}
                                error={modal.validation.error.salary}
                                helperText={modal.validation.message.salary}
                                onChange={(event) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            salary: event.target.value,
                                        }
                                    })
                                }}
                            />
                            <TextField
                                fullWidth
                                label='Процент за продажу'
                                placeholder='Процент за продажу'
                                type='number'
                                required
                                value={modal.values.percentage_of_the_sale}
                                error={modal.validation.error.percentage_of_the_sale}
                                helperText={modal.validation.message.percentage_of_the_sale}
                                onChange={(event) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            percentage_of_the_sale: event.target.value,
                                        }
                                    })
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Пароль"
                                placeholder="Пароль"
                                variant="outlined"
                                type={modal.showPassword ? 'text' : 'password'}
                                value={modal.values.password}
                                onChange={(event) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            password: event.target.value,
                                        }
                                    })
                                }}
                                error={modal.validation.error.password}
                                helperText={modal.validation.message.password}
                                required={modal.action === 'add'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    setModal({
                                                        ...modal,
                                                        showPassword: !modal.showPassword,
                                                    })
                                                }}
                                            >
                                                {modal.showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Подтвердите пароль"
                                placeholder="Подтвердите пароль"
                                variant="outlined"
                                type={modal.showPassword ? 'text' : 'password'}
                                value={modal.values.confirm_password}
                                onChange={(event) => {
                                    setModal({
                                        ...modal,
                                        values: {
                                            ...modal.values,
                                            confirm_password: event.target.value,
                                        }
                                    })
                                }}
                                error={modal.values.confirm_password !== modal.values.password}
                                helperText={modal.values.confirm_password !== modal.values.password ? 'Пароли не совпадают' : ''}
                                required={modal.action === 'add'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => {
                                                    setModal({
                                                        ...modal,
                                                        showPassword: !modal.showPassword,
                                                    })
                                                }}
                                            >
                                                {modal.showPassword ? <VisibilityOff/> : <Visibility/>}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
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
            </Modal>
        </>
    );
}
