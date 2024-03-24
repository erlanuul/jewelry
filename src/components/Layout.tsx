import React from 'react';
import {Outlet} from "react-router-dom";
import Header from "./Header";
import {motion as m} from "framer-motion";

function Layout() {
    return (
        <m.section
            className={`w-full min-h-screen text-[#282828] relative bg-white flex flex-col items-center justify-start`}
            initial={{scale: 0.9}}
            animate={{scale: 1}}
            transition={{duration: 0.3, ease: "easeOut"}}>
            <Header/>
            <div className='w-full bg-[#F6F5F5FF] min-h-screen flex flex-col justify-start items-start py-[80px] pl-[125px] pr-[75px]'>
                <Outlet/>
            </div>
        </m.section>
    );
}

export default Layout;