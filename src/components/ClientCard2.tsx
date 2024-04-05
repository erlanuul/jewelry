import React, {useState} from 'react';
import Slider from "react-slick";
import {Modal} from "@mui/material";

export default function ClientCard2({clientInfo}: any) {
    const [open, setOpen] = useState(false)
    const settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false
    };
    return (
        <>
            <div
                className='w-full px-[30px] py-[20px] bg-white rounded-[10px] shadow-md flex justify-start items-start gap-[30px]'>
                {clientInfo.images.length > 0
                    ?
                    <div className='rounded-[5px] w-[150px] h-[150px] bg-cover bg-center'
                         style={{backgroundImage: `url(${clientInfo.images[0].image})`}}
                         onClick={()=> setOpen(true)}
                    >
                    </div>
                    :
                    <div
                        className='flex flex-col justify-center items-center rounded-[5px] bg-[#F6F6F6] w-[150px] h-[150px]'>
                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <mask id="mask0_170_1742" style={{maskType: 'alpha'}} maskUnits="userSpaceOnUse"
                                  x="2" y="1" width="16" height="16">
                                <path fillRule="evenodd" clipRule="evenodd"
                                      d="M17.2227 12.4995V3.49951C17.2227 2.67451 16.5477 1.99951 15.7227 1.99951H6.72266C5.89766 1.99951 5.22266 2.67451 5.22266 3.49951V12.4995C5.22266 13.3245 5.89766 13.9995 6.72266 13.9995H15.7227C16.5477 13.9995 17.2227 13.3245 17.2227 12.4995ZM9.27266 9.89701L10.4952 11.532L12.4302 9.11701C12.5802 8.92951 12.8652 8.92951 13.0152 9.11701L15.2352 11.892C15.4302 12.1395 15.2577 12.4995 14.9427 12.4995H7.47266C7.16516 12.4995 6.98516 12.147 7.17266 11.8995L8.67266 9.89701C8.82266 9.70201 9.12266 9.70201 9.27266 9.89701ZM2.22266 15.4995V5.74951C2.22266 5.33701 2.56016 4.99951 2.97266 4.99951C3.38516 4.99951 3.72266 5.33701 3.72266 5.74951V14.7495C3.72266 15.162 4.06016 15.4995 4.47266 15.4995H13.4727C13.8852 15.4995 14.2227 15.837 14.2227 16.2495C14.2227 16.662 13.8852 16.9995 13.4727 16.9995H3.72266C2.89766 16.9995 2.22266 16.3245 2.22266 15.4995Z"
                                      fill="black"/>
                            </mask>
                            <g mask="url(#mask0_170_1742)">
                                <rect x="0.722656" y="0.499512" width="18" height="18" fill="#6E6C6A"/>
                            </g>
                        </svg>
                        <p className='w-full text-center text-[#6E6C6A] text-[10px] font-[500]'>
                            Нет фото
                        </p>
                    </div>
                }
                <div className='flex flex-col justify-start items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>ФИО:</p>
                    <p className='text-[#2A2826] text-[16px] font-[900]'>{clientInfo.full_name}</p>
                </div>
                <div className='flex flex-col justify-start items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Платежеспособность:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{clientInfo.solvency ? 'Да' : 'Нет'}</p>
                </div>
                <div className='flex flex-col justify-start items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>ИНН:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{clientInfo.inn}</p>
                </div>
                <div className='flex flex-col justify-start items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Номер телефона:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{clientInfo.phone}</p>
                </div>
                <div className='flex flex-col justify-start items-start gap-[10px] mt-[40px]'>
                    <p className='text-[#6E6C6A] text-[12px] font-[500]'>Адрес:</p>
                    <p className='text-[#2A2826] text-[16px] font-[400]'>{clientInfo.address}</p>
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)}>
                <div className='modalSlider'>
                    <Slider {...settings}>
                        {clientInfo.images.map((item: any, index: number) => (
                            <div key={index}>
                                <div className='max-w-[756px] h-[420px] bg-center bg-cover rounded-[10px]'
                                     style={{backgroundImage: `url(${item.image})`}}
                                >
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </Modal>
        </>
    )
}