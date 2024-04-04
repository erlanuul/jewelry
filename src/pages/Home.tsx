import React, {FormEvent, useState} from 'react';
import {AnalyticsService} from "../services/AnalyticsService";
import {Button, ListItemText, MenuItem, MenuList, Modal, Popover, Skeleton} from "@mui/material";
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {
    CustomRoundedButton,
    CustomRoundedDatePicker,
    CustomRoundedLoadingButton,
    CustomTextField
} from "../helpers/muiCustomization";
import {BoxOfficeService} from "../services/BoxOfficeService";
import {checkModalResponse} from "../helpers/helpers";
import {CategoryService} from "../services/CategoryService";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PopupState, {bindPopover, bindTrigger} from "material-ui-popup-state";
import moment from "moment";
import {SampleNumbersService} from "../services/SampleNumbersService";


const modalInitialValues = {
    values: {
        finance_id: '',
        name: '',
        total_sum: 0,
        amount: '',
        note: '',
    },
    validations: {
        errors: {
            name: false,
            amount: false,
            note: false,
        },
        messages: {
            name: '',
            amount: '',
            note: '',
        }
    },
    open: false,
    requested: false
}

const filtersInitialValues = {
    defers: {
        date_from: null,
        date_to: null,
        type: ''
    },
    expenses: {
        date_from: null,
        date_to: null,
    },
    ransoms: {
        date_from: null,
        date_to: null,
    },
    sales: {
        date_from: null,
        date_to: null,
        category: '',
        sample_number: '',
    },
    ratings: {
        date_from: null,
        date_to: null,
    },
}
export default function Home() {
    const [modal, setModal] = useState(modalInitialValues)
    const [filter, setFilter] = useState<any>(filtersInitialValues)

    const analyticsFinance = AnalyticsService.GetAnalyticsFinance()
    const analyticsDefers = AnalyticsService.GetAnalyticsDefers({
        ...filter.defers,
        ...filter.defers.date_from === null ? {} : {date_from: moment(filter.defers.date_from?.$d).format('YYYY-MM-DD')},
        ...filter.defers.date_to === null ? {} : {date_to: moment(filter.defers.date_to?.$d).format('YYYY-MM-DD')},
    })
    const analyticsExpenses = AnalyticsService.GetAnalyticsExpenses({
        ...filter.expenses,
        ...filter.expenses.date_from === null ? {} : {date_from: moment(filter.expenses.date_from?.$d).format('YYYY-MM-DD')},
        ...filter.expenses.date_to === null ? {} : {date_to: moment(filter.expenses.date_to?.$d).format('YYYY-MM-DD')},
    })
    const analyticsRansoms = AnalyticsService.GetAnalyticsRansoms({
        ...filter.ransoms,
        ...filter.ransoms.date_from === null ? {} : {date_from: moment(filter.ransoms.date_from?.$d).format('YYYY-MM-DD')},
        ...filter.ransoms.date_to === null ? {} : {date_to: moment(filter.ransoms.date_to?.$d).format('YYYY-MM-DD')},
    })
    const analyticsSales = AnalyticsService.GetAnalyticsSales({
        ...filter.sales,
        ...filter.sales.date_from === null ? {} : {date_from: moment(filter.sales.date_from?.$d).format('YYYY-MM-DD')},
        ...filter.sales.date_to === null ? {} : {date_to: moment(filter.sales.date_to?.$d).format('YYYY-MM-DD')},
    })
    const analyticsRatings = AnalyticsService.GetAnalyticsRatings({
        ...filter.ratings,
        ...filter.ratings.date_from === null ? {} : {date_from: moment(filter.ratings.date_from?.$d).format('YYYY-MM-DD')},
        ...filter.ratings.date_to === null ? {} : {date_to: moment(filter.ratings.date_to?.$d).format('YYYY-MM-DD')},
    })


    const categoriesList = CategoryService.GetCategoryList()
    const sampleNumbersList = SampleNumbersService.GetSampleNumbersList()
    const defersTypeList = [
        {name: 'Продажи', slug: 'sales'},
        {name: 'Выплаты', slug: 'paid'},
        {name: 'Долги', slug: 'debt'}
    ]

    const handleFormSubmit = (event: FormEvent) => {
        event.preventDefault()
        setModal({
            ...modal,
            requested: true
        })
        BoxOfficeService.CreateWithDrawal(modal.values).then(() => {
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

            {analyticsFinance.loading
                ?
                <>
                    <div className="w-full flex justify-start items-start gap-[20px] mb-[80px]">
                        <Skeleton variant="rectangular" width={'20%'} height={248}/>
                        <Skeleton variant="rectangular" width={'80%'} height={248}/>
                    </div>
                </>
                : analyticsFinance.error
                    ? analyticsFinance.error.message
                    :
                    <div className="w-full flex justify-start items-start gap-[20px] mb-[80px]">
                        {[...analyticsFinance.result?.data.finance].filter((item: any) => !item.cashless).map((index: number) => (
                            <div
                                className="p-[14px] rounded-[10px] bg-white min-h-[238px] flex flex-col justify-between items-center shadow-md"
                                key={index}>
                                <div className="w-full flex justify-between items-center gap-[20px] pb-[10px]"
                                     style={{borderBottom: '1px solid #576ED0'}}
                                >
                                    <p className="text-[#2A2826] text-[16px] font-[600] text-nowrap">Наличные
                                        (сом)</p>
                                    <p className="text-[#3E3C3A text-[24px] font-[700]">{analyticsFinance.result?.data.total_cash}</p>
                                </div>

                                <CustomRoundedButton
                                    sx={{minWidth: '162px',}}
                                    variant='contained'
                                    size='small'
                                    startIcon={<AccountBalanceWalletIcon/>}
                                >
                                    Снять
                                </CustomRoundedButton>
                            </div>
                        ))}

                        <div className="p-[14px] rounded-[10px] bg-white flex flex-col justify-items-start items-start shadow-md">
                            <div className="w-full flex justify-start items-center gap-[20px] pb-[10px] mb-[30px]"
                                 style={{borderBottom: '1px solid #576ED0'}}
                            >
                                <p className="text-[#2A2826] text-[16px] font-[600]">Безналичные (сом)</p>
                                <p className="text-[#3E3C3A text-[24px] font-[700]">{analyticsFinance.result?.data.total_cashless}</p>
                            </div>
                            <div className="w-full grid grid-cols-3 gap-[70px]">
                                {[...analyticsFinance.result?.data.finance].filter((item: any) => item.cashless).map((item: any, index: number) => (
                                    <div className=" flex flex-col justify-between items-start gap-[16px]"
                                         key={index}>
                                        <div className="w-full flex flex-col justify-start items-start gap-[10px]">
                                            <p className="text-[#2A2826] text-[16px] font-[600]">{item.name} (сом)</p>
                                            <p className="text-[#3E3C3A text-[24px] font-[700]">{item.total_sum}</p>
                                        </div>

                                        <CustomRoundedButton
                                            sx={{minWidth: '162px',}}
                                            variant='contained'
                                            size='small'
                                            startIcon={<CreditCardIcon/>}
                                            onClick={() => {
                                                setModal({
                                                    ...modalInitialValues,
                                                    open: true,
                                                    values: {
                                                        ...modalInitialValues.values,
                                                        finance_id: item.id,
                                                        name: item.name,
                                                        total_sum: item.total_sum,
                                                    }
                                                })
                                            }}
                                        >
                                            Снять
                                        </CustomRoundedButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
            }
            <div className="w-full flex flex-col justify-start items-star">
                <h3 className="text-[#2A2826] text-[24px] font-[700] mb-[40px]">
                    Статистика
                </h3>
                <div className="w-full grid grid-cols-4 gap-[20px]">

                    <div className="w-full p-[14px] rounded-[10px] bg-white flex flex-col justify-start items-center shadow-md">
                        <div className="w-full flex justify-between items-center pb-[10px] mb-[24px]"
                             style={{borderBottom: '1px solid #576ED0'}}
                        >
                            <p className="text-[#576ED0] text-[16px] font-[600] text-nowrap">Продажи</p>
                        </div>
                        <div className="w-full flex justify-between items-start gap-[20px] mb-[40px]">
                            <div className="flex flex-col justify-start items-start gap-[4px]">
                                <p className="text-[#3E3C3A] text-[20px] font-[600]">
                                    {
                                        (!analyticsSales.loading && !analyticsSales.error)
                                            ? analyticsSales.result?.data.total_quantity
                                            : '0'
                                    }
                                </p>
                                <p className="text-[#6E6C6A] text-[10px] font-[500]">Количество продаж</p>
                            </div>

                            <div className="flex flex-col justify-start items-start gap-[4px]">
                                <p className="text-[#3E3C3A] text-[20px] font-[600]">
                                    {
                                        (!analyticsSales.loading && !analyticsSales.error)
                                            ? analyticsSales.result?.data.total
                                            : '0'
                                    }
                                </p>
                                <p className="text-[#6E6C6A] text-[10px] font-[500]">Сумма (сом)</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-center gap-[10px]">
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<CalendarMonthIcon/>} {...bindTrigger(popupState)}>
                                            Дата
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div className='flex items-center gap-[20px] p-[20px] bg-white'>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>От</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.sales.date_from}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                sales: {
                                                                    ...filter.sales,
                                                                    date_from: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>до</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.sales.date_to}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                sales: {
                                                                    ...filter.sales,
                                                                    date_to: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<ArrowDropDownIcon/>} {...bindTrigger(popupState)}>
                                            Категория
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div className='w-full flex flex-col justify-start items-start gap-[10px] p-[20px]'>
                                                {!categoriesList.loading && !categoriesList.error && categoriesList.result?.data.map((item: any, index: number)=> (
                                                    <p key={index}
                                                       className={`${filter.sales.category === item.id ? 'text-[#576ED0]' : 'text-[#2A2826]'} text-[14px] font-[500] hover:text-[#576ED0] cursor-pointer`}
                                                       onClick={()=>{
                                                           setFilter({
                                                               ...filter,
                                                               sales: {
                                                                   ...filter.sales,
                                                                   category: item.id
                                                               }
                                                           })
                                                       }}
                                                    >
                                                        {item.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<ArrowDropDownIcon/>} {...bindTrigger(popupState)}>
                                            Проба
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div
                                                className='w-full flex flex-col justify-start items-start gap-[10px] p-[20px]'>
                                                {!sampleNumbersList.loading && !sampleNumbersList.error && sampleNumbersList.result?.data.map((item: any, index: number) => (
                                                    <p key={index}
                                                       className={`${filter.sales.sample_number === item.sample_number ? 'text-[#576ED0]' : 'text-[#2A2826]'} text-[14px] font-[500] hover:text-[#576ED0] cursor-pointer`}
                                                       onClick={() => {
                                                           setFilter({
                                                               ...filter,
                                                               sales: {
                                                                   ...filter.sales,
                                                                   sample_number: item.sample_number
                                                               }
                                                           })
                                                       }}
                                                    >
                                                        {item.sample_number}
                                                    </p>
                                                ))}
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                        </div>
                    </div>

                    <div className="w-full p-[14px] rounded-[10px] bg-white flex flex-col justify-start items-center shadow-md">
                        <div className="w-full flex justify-between items-center pb-[10px] mb-[24px]"
                             style={{borderBottom: '1px solid #576ED0'}}
                        >
                            <p className="text-[#576ED0] text-[16px] font-[600] text-nowrap">Скупка</p>
                        </div>
                        <div className="w-full flex justify-between items-start gap-[20px] mb-[40px]">
                            <div className="flex flex-col justify-start items-start gap-[4px]">
                                <p className="text-[#3E3C3A] text-[20px] font-[600]">
                                    {
                                        (!analyticsRansoms.loading && !analyticsRansoms.error)
                                            ? analyticsRansoms.result?.data.total
                                            : '0'
                                    }
                                </p>
                                <p className="text-[#6E6C6A] text-[10px] font-[500]">Сумма скупок (сом)</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-center gap-[10px]">
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<CalendarMonthIcon/>} {...bindTrigger(popupState)}>
                                            Дата
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div className='flex items-center gap-[20px] p-[20px] bg-white'>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>От</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.ransoms.date_from}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                ransoms: {
                                                                    ...filter.ransoms,
                                                                    date_from: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>до</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.ransoms.date_to}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                ransoms: {
                                                                    ...filter.ransoms,
                                                                    date_to: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                        </div>
                    </div>

                    <div className="w-full p-[14px] rounded-[10px] bg-white flex flex-col justify-start items-center shadow-md">
                        <div className="w-full flex justify-between items-center pb-[10px] mb-[24px]"
                             style={{borderBottom: '1px solid #576ED0'}}
                        >
                            <p className="text-[#576ED0] text-[16px] font-[600] text-nowrap">Рассрочка</p>
                        </div>
                        <div className="w-full flex justify-between items-start gap-[20px] mb-[40px]">
                            <div className="flex flex-col justify-start items-start gap-[4px]">
                                <p className="text-[#3E3C3A] text-[20px] font-[600]">
                                    {
                                        (!analyticsDefers.loading && !analyticsDefers.error)
                                            ? analyticsDefers.result?.data.total
                                            : '0'
                                    }
                                </p>
                                <p className="text-[#6E6C6A] text-[10px] font-[500]">Сумма рассрочки (сом)</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-center gap-[10px]">
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<CalendarMonthIcon/>} {...bindTrigger(popupState)}>
                                            Дата
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div className='flex items-center gap-[20px] p-[20px] bg-white'>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>От</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.defers.date_from}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                defers: {
                                                                    ...filter.defers,
                                                                    date_from: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>до</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.defers.date_to}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                defers: {
                                                                    ...filter.defers,
                                                                    date_to: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<ArrowDropDownIcon/>} {...bindTrigger(popupState)}>
                                            Типы
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div className='w-full flex flex-col justify-start items-start gap-[10px] p-[20px]'>
                                                {defersTypeList.map((item: any, index: number)=> (
                                                    <p key={index}
                                                       className={`${filter.defers.type === item.slug ? 'text-[#576ED0]' : 'text-[#2A2826]'} text-[14px] font-[500] hover:text-[#576ED0] cursor-pointer`}
                                                       onClick={()=>{
                                                           setFilter({
                                                               ...filter,
                                                               defers: {
                                                                   ...filter.defers,
                                                                   type: item.slug
                                                               }
                                                           })
                                                       }}
                                                    >
                                                        {item.name}
                                                    </p>
                                                ))}
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                        </div>
                    </div>

                    <div className="w-full p-[14px] rounded-[10px] bg-white flex flex-col justify-start items-center shadow-md">
                        <div className="w-full flex justify-between items-center pb-[10px] mb-[24px]"
                             style={{borderBottom: '1px solid #576ED0'}}
                        >
                            <p className="text-[#576ED0] text-[16px] font-[600] text-nowrap">Расходы</p>
                        </div>
                        <div className="w-full flex justify-between items-start gap-[20px] mb-[40px]">
                            <div className="flex flex-col justify-start items-start gap-[4px]">
                                <p className="text-[#3E3C3A] text-[20px] font-[600]">
                                    {analyticsExpenses.result?.data.total}
                                    {
                                        (!analyticsExpenses.loading && !analyticsExpenses.error)
                                            ? analyticsExpenses.result?.data.total
                                            : '0'
                                    }
                                </p>
                                <p className="text-[#6E6C6A] text-[10px] font-[500]">Сумма расходов (сом)</p>
                            </div>
                        </div>
                        <div className="w-full flex justify-start items-center gap-[10px]">
                            <PopupState variant="popover" popupId="demo-popup-popover">
                                {(popupState) => (
                                    <div>
                                        <Button size='small' endIcon={<CalendarMonthIcon/>} {...bindTrigger(popupState)}>
                                            Дата
                                        </Button>
                                        <Popover
                                            {...bindPopover(popupState)}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                        >
                                            <div className='flex items-center gap-[20px] p-[20px] bg-white'>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>От</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.expenses.date_from}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                expenses: {
                                                                    ...filter.expenses,
                                                                    date_from: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                                <div className='flex items-center gap-[14px]'>
                                                    <p className='text-[#2A2826] text-[14px] font-[500]'>до</p>
                                                    <CustomRoundedDatePicker
                                                        value={filter.expenses.date_to}
                                                        onChange={(newValue) => {
                                                            setFilter({
                                                                ...filter,
                                                                expenses: {
                                                                    ...filter.expenses,
                                                                    date_to: newValue
                                                                }
                                                            })
                                                        }}
                                                        slotProps={{
                                                            textField: {
                                                                required: true,
                                                                size: 'small'
                                                            },
                                                        }}
                                                        sx={{width: '180px'}}
                                                    />
                                                </div>
                                            </div>
                                        </Popover>
                                    </div>
                                )}
                            </PopupState>
                        </div>
                    </div>
                </div>
            </div>

            <Modal open={modal.open} onClose={() => setModal(modalInitialValues)}>
                <form onSubmit={handleFormSubmit} className='mainModal'>
                    <h1 className='text-[#2A2826] text-[24px] font-[700]'>
                        Снятие
                    </h1>
                    <div className="w-full flex flex-col justify-start items-center gap-[50px]">
                        <div className='w-full flex flex-col gap-[10px] pb-[10px]'
                             style={{borderBottom: '1px solid #CED0D2'}}>
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
                                    if (parseInt(event.target.value) > modal.values.total_sum) {
                                        setModal({
                                            ...modal,
                                            values: {
                                                ...modal.values,
                                                amount: event.target.value,
                                            },
                                            validations: {
                                                ...modal.validations,
                                                messages: {
                                                    ...modal.validations.messages,
                                                    amount: 'Недостаточно средств!',
                                                },
                                                errors: {
                                                    ...modal.validations.errors,
                                                    amount: true,
                                                }
                                            }
                                        })
                                    } else {
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
                        <CustomRoundedLoadingButton
                            fullWidth
                            variant='contained'
                            loading={modal.requested}
                            disabled={modal.requested}
                            type='submit'
                        >
                            Готово
                        </CustomRoundedLoadingButton>
                    </div>
                </form>
            </Modal>
        </>
    );
}
