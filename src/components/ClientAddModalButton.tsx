import React, {FormEvent, useState} from 'react';
import {ClientService} from "../services/ClientService";
import {checkModalResponse, ImageImport, ImageImportButton} from "../helpers/helpers";
import {Button, FormControl, FormHelperText, InputLabel, MenuItem, Modal, Select, TextField} from "@mui/material";
import InputMask from "react-input-mask";
import {LoadingButton} from "@mui/lab";
import AddIcon from "@mui/icons-material/Add";


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
}
export default function ClientAddModalButton() {
    const [clientModal, setClientModal] = useState<any>(clientModalInitialValues)
    const handleClientFormSubmit = (event: FormEvent) => {
        event.preventDefault();
        event.stopPropagation()
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

        ClientService.CreateClient(form_data).then(() => {
            setClientModal(clientModalInitialValues);
        }).catch((err) => {
            checkModalResponse(err.response.data, setClientModal, clientModal);
        })
    };
    return (
        <>
            <Button
                color='blue'
                variant='contained'
                startIcon={<AddIcon/>}
                onClick={() => {
                    setClientModal({
                        ...clientModalInitialValues,
                        open: true,
                    })
                }}
            >
                Добавить клиента
            </Button>
            <Modal open={clientModal.open} onClose={() => setClientModal(clientModalInitialValues)}>
                <form onSubmit={handleClientFormSubmit} className='mainModal'>
                    <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                        Добавление клиента
                    </h1>
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
            </Modal>
        </>
    )
}