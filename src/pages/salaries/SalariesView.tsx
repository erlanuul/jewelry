import React from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {SalaryService} from "../../services/SalaryService";
import {Skeleton} from "@mui/material";
import moment from "moment/moment";


export default function SalariesView() {
    const navigate = useNavigate()
    const {id} = useParams()

    const salary = SalaryService.GetSalary(id)

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Просмотр зарплатной ведомости</h1>
            </div>


            {salary.loading
                ?
                <>
                    <div className='w-full flex flex-col justify-start items-center mb-[39px]'>
                        <Skeleton variant="rectangular" width={'40%'} height={30}/>
                    </div>
                    <Skeleton variant="rectangular" width={'100%'} height={500}/>
                </>
                : salary.error
                    ? 'error'
                    :
                    <>
                        <div className='w-full flex flex-col justify-start items-center p-[30px] bg-[white] shadow-md'>
                            <p className='text-[#2A2826] text-[20px] font-[600] mb-[39px]'>
                                C {moment(salary.result?.data.date_start).format('DD.MM.YY').toString()} по {moment(salary.result?.data.date_end).format('DD.MM.YY').toString()}
                            </p>

                            <div className='w-full grid grid-cols-7 pb-[10px] mb-[30px]'
                                 style={{borderBottom: '1px solid #576ED0'}}>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>ФИО</p>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Оклад</p>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Процент за продажу</p>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Количество продаж</p>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Аванс</p>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Итого</p>
                                <p className='text-[#2A2826] text-[14px] font-[700] text-center'>Выплачено</p>
                            </div>
                            <div className='w-full flex flex-col gap-[24px]'>
                                {[...salary.result?.data.reports].map((item: any, index: number)=> (
                                    <div key={index} className='w-full grid grid-cols-7 mb-[20px]'>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-start'>
                                            {item.staff?.full_name}
                                        </p>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>
                                            {item.staff?.salary}
                                        </p>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>
                                            {item.staff?.percentage_of_the_sale}
                                        </p>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>
                                            {item.quantity_of_sales}
                                        </p>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>
                                            {item.prepayment}
                                        </p>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>

                                        </p>
                                        <p className='text-[#2A2826] text-[14px] font-[500] text-center'>

                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
            }
        </>
    );
}
