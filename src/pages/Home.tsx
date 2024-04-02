import React, {FormEvent, useState} from 'react';
import {AnalyticsService} from "../services/AnalyticsService";
import {Button, Modal, Skeleton} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {CustomTextField} from "../helpers/muiCustomization";
import {LoadingButton} from "@mui/lab";
import {BoxOfficeService} from "../services/BoxOfficeService";
import {checkModalResponse} from "../helpers/helpers";


const modalInitialValues = {
    values:{
        finance_id: '',
        name: '',
        total_sum: 0,
        amount: '',
        note: '',
    },
    validations: {
        errors:{
            name: false,
            amount: false,
            note: false,
        },
        messages:{
            name: '',
            amount: '',
            note: '',
        }
    },
    open: false,
    requested: false
}
export default function Home() {
    const [modal, setModal] = useState(modalInitialValues)
    const analyticsFinance = AnalyticsService.GetAnalyticsFinance()


    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault()
        setModal({
            ...modal,
            requested: true
        })
        BoxOfficeService.CreateWithDrawal(modal.values).then(()=>{
            setModal(modalInitialValues)
            analyticsFinance.execute()
        }).catch((err) => {
            checkModalResponse(err.response.data, setModal, modal);
        })
    }
    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Главная</h1>
            </div>

            <div className="w-full flex justify-start items-start gap-[20px]">
                {analyticsFinance.loading
                    ?
                    <>
                        <div className='w-full flex flex-col justify-start items-center mb-[39px]'>
                            <Skeleton variant="rectangular" width={'40%'} height={30}/>
                        </div>
                        <Skeleton variant="rectangular" width={'100%'} height={500}/>
                    </>
                    : analyticsFinance.error
                        ? analyticsFinance.error.message
                        :
                        <>
                            {[...analyticsFinance.result?.data.finance].filter((item: any) => !item.cashless).map((index: number) => (
                                <div className="p-[14px] rounded-[10px] bg-white min-h-[238px] flex flex-col justify-between items-center" key={index}>
                                    <div className="w-full flex justify-between items-center gap-[20px] pb-[10px]"
                                         style={{borderBottom: '1px solid #576ED0'}}
                                    >
                                        <p className="text-[#2A2826] text-[16px] font-[600] text-nowrap">Наличные (сом)</p>
                                        <p className="text-[#3E3C3A text-[24px] font-[700]">{analyticsFinance.result?.data.total_cash}</p>
                                    </div>

                                    <Button
                                        sx={{minWidth: '162px', }}
                                        variant='contained'
                                        size='small'
                                        startIcon={<AccountBalanceWalletIcon/>}
                                    >
                                        Снять
                                    </Button>
                                </div>
                            ))}

                            <div className="p-[14px] rounded-[10px] bg-white flex flex-col justify-items-start items-start">
                                <div className="w-full flex justify-start items-center gap-[20px] pb-[10px] mb-[30px]"
                                     style={{borderBottom: '1px solid #576ED0'}}
                                >
                                    <p className="text-[#2A2826] text-[16px] font-[600]">Безналичные (сом)</p>
                                    <p className="text-[#3E3C3A text-[24px] font-[700]">{analyticsFinance.result?.data.total_cashless}</p>
                                </div>
                                <div className="w-full grid grid-cols-3 gap-[70px]">
                                    {[...analyticsFinance.result?.data.finance].filter((item: any) => item.cashless).map((item: any, index: number) => (
                                        <div className=" flex flex-col justify-between items-start gap-[16px]" key={index}>
                                            <div className="w-full flex flex-col justify-start items-start gap-[10px]">
                                                <p className="text-[#2A2826] text-[16px] font-[600]">{item.name} (сом)</p>
                                                <p className="text-[#3E3C3A text-[24px] font-[700]">{item.total_sum}</p>
                                            </div>

                                            <Button
                                                sx={{minWidth: '162px', }}
                                                variant='contained'
                                                size='small'
                                                startIcon={<CreditCardIcon/>}
                                                onClick={()=>{
                                                    setModal({
                                                        ...modalInitialValues,
                                                        open: true,
                                                        values:{
                                                            ...modalInitialValues.values,
                                                            finance_id: item.id,
                                                            name: item.name,
                                                            total_sum: item.total_sum,
                                                        }
                                                    })
                                                }}
                                            >
                                                Снять
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                }

                <Modal open={modal.open} onClose={() => setModal(modalInitialValues)}>
                    <form onSubmit={handleFormSubmit} className='mainModal'>
                        <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                            Снятие
                        </h1>
                        <div className="w-full flex flex-col justify-start items-center gap-[50px]">
                            <div className='w-full flex flex-col gap-[10px] pb-[10px]' style={{borderBottom: '1px solid #CED0D2'}}>
                                <p className="text-[#576ED0] text-[14px] font-[500]">{modal.values.name}</p>
                                <p className="text-[#576ED0] text-[20px] font-[600]">{modal.values.total_sum} сом</p>
                            </div>
                            <div className='w-full grid grid-cols-2 gap-[30px]'>
                                <CustomTextField
                                    fullWidth
                                    label='Сумма'
                                    placeholder='Сумма'
                                    required
                                    type='number'
                                    value={modal.values.amount}
                                    error={modal.validations.errors.amount}
                                    helperText={modal.validations.messages.amount}
                                    onChange={(event) => {
                                        if(parseInt(event.target.value) > modal.values.total_sum){
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    amount: event.target.value,
                                                },
                                                validations: {
                                                    ...modal.validations,
                                                    messages:{
                                                        ...modal.validations.messages,
                                                        amount: 'Недостаточно средств!',
                                                    },
                                                    errors:{
                                                        ...modal.validations.errors,
                                                        amount: true,
                                                    }
                                                }
                                            })
                                        }else{
                                            setModal({
                                                ...modal,
                                                values: {
                                                    ...modal.values,
                                                    amount: event.target.value,
                                                },
                                                validations: {
                                                    ...modalInitialValues.validations,
                                                }
                                            })
                                        }
                                    }}
                                />
                                <CustomTextField
                                    fullWidth
                                    label='Примечание'
                                    placeholder='Примечание'
                                    required
                                    value={modal.values.note}
                                    error={modal.validations.errors.note}
                                    helperText={modal.validations.messages.note}
                                    onChange={(event) => {
                                        setModal({
                                            ...modal,
                                            values: {
                                                ...modal.values,
                                                note: event.target.value,
                                            }
                                        })
                                    }}
                                />
                            </div>
                        </div>

                        <div className='w-1/2'>
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
            </div>
        </>
    );
}
