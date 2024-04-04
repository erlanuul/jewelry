import React, {useState} from 'react';
import {BoxOfficeService} from "../../../services/BoxOfficeService";
import {useNavigate} from "react-router-dom";
import BoxOfficeFilterButtons from "../../../components/BoxOfficeFilterButtons";

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

                        <BoxOfficeFilterButtons
                            operationsArr={operations}
                            operationType={form.values.operation_type}
                            operation={form.values.operation}
                            initialPage={'sale'}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
