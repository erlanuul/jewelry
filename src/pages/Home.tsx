import React from 'react';
import {useSelector} from "react-redux";

export default function Home() {
    const user = useSelector((state: any)=> state.userData.user)

    return (
        <>

        </>
    );
}
