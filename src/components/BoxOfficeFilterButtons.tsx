import React from "react";
import {useNavigate} from "react-router-dom";
import {CustomRoundedButton} from "../helpers/muiCustomization";
import {Skeleton} from "@mui/material";

export default function BoxOfficeFilterButtons({operationsArr, operationType, operation, initialPage}: any) {
    const navigate = useNavigate()
    return (
        <div className='rounded-[100px] bg-[#F4F5F7] flex items-center mb-[40px]'>
            {operationsArr.loading
                ?
                <>
                    <Skeleton variant="rectangular" width={100} height={37} sx={{borderRadius: '100px'}}/>
                    <Skeleton variant="rectangular" width={100} height={37} sx={{borderRadius: '100px'}}/>
                    <Skeleton variant="rectangular" width={100} height={37} sx={{borderRadius: '100px'}}/>
                    <Skeleton variant="rectangular" width={100} height={37} sx={{borderRadius: '100px'}}/>
                </>
                : operationsArr.error
                    ? operationsArr.error.message
                    :
                    operationsArr.result?.data.map((item: any, index: number) => (
                        <CustomRoundedButton
                            key={index}
                            variant={item.slug === operation ? 'contained' : 'outlined'}
                            color={item.slug === operation ? 'primary' : 'gray'}
                            onClick={() => {
                                navigate({
                                    pathname: `/box_office/${operationType}${item.slug === initialPage ? '' : `/${item.slug}`}`
                                })
                            }}
                        >
                        {item.name}
                        </CustomRoundedButton>
                    ))
            }
        </div>
    )
}