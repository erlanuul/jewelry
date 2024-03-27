import React, {useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";

const formInitialValues = {
    values:{
        operation_type: 'income',
        operation: 'interchange',
    },
    validation:{
        error: {

        },
        message:{

        }
    },
    requested: false,
}

export default function IncomeInterchange() {
    const navigate = useNavigate()
    const [form, setForm] = useState(formInitialValues)

    const operations = BoxOfficeService.GetBoxOfficeOperations({
        operation_type__slug: form.values.operation_type
    })

    return (
        <>
            <div className='w-full flex justify-between items-center mb-[57px]'>
                <h1 className="text-[#2A2826] text-[42px] font-[800]">Добавить приход</h1>
            </div>
            <div className='w-full flex justify-between items-start gap-[20px]'>
                <div className='flex flex-col justify-start items-center'>
                    <div className='w-full p-[30px] bg-white rounded-[10px] flex flex-col justify-start items-start'>
                        <div className='rounded-[100px] bg-[#F4F5F7] flex items-center'>
                            {!operations.loading && !operations.error && operations.result?.data.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className={`px-[20px] py-[8px] rounded-[100px] text-[12px] font-[500] cursor-pointer hover:bg-[#576ED0] hover:text-white ${item.slug === form.values.operation ? 'text-white bg-[#576ED0]' : ' text-[#292929]'}`}
                                    onClick={() => {
                                        navigate({
                                            pathname: `/box_office/${form.values.operation_type}${item.slug === 'sale' ? '' : `/${item.slug}` }`
                                        })
                                    }}
                                >
                                    {item.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
