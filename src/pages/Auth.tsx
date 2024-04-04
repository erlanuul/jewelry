import React, {useState} from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {Avatar, IconButton, InputAdornment} from '@mui/material';
import {setCookie} from 'typescript-cookie'
import {jwtDecode} from "jwt-decode";
import {AuthService} from "../services/AuthService";
import {access_token_name, refresh_token_name} from "../http";
import {useDispatch} from "react-redux";
import {LoadingButton} from "@mui/lab";
import InputMask from 'react-input-mask';
import {login} from "../store/slices/userSlice";
import {CustomRoundedLoadingButton, CustomTextField} from "../helpers/muiCustomization";

const formInitialState = {
    values:{
        phone: '',
        password: '',
    },
    validation:{
        message:{
            phone: '',
            password: '',
        },
        error:{
            phone: false,
            password: false,
        }
    },
    showPassword: false,
    requested: false,
}
export default function Auth() {
    const dispatch = useDispatch()
    const [form, setForm] = useState(formInitialState)
    const handleSubmit = (e: React.SyntheticEvent) => {
        e.preventDefault()
        setForm({
            ...form,
            requested: true,
        })
        AuthService.PostAuthData(form.values).then((res) => {
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);

            const accessDecode: any = jwtDecode(res.data.access)
            const refreshDecode: any = jwtDecode(res.data.refresh)

            const accessExpirationInSeconds = accessDecode.exp;
            const refreshExpirationInSeconds = refreshDecode.exp;

            // Calculate the difference in seconds
            const accessDifferenceInSeconds = accessExpirationInSeconds - currentTimeInSeconds;
            const refreshDifferenceInSeconds = refreshExpirationInSeconds - currentTimeInSeconds;

            // Convert the difference in seconds to days
            const accessDifferenceInDays = accessDifferenceInSeconds / (60 * 60 * 24);
            const refreshDifferenceInDays = refreshDifferenceInSeconds / (60 * 60 * 24);

            setCookie(access_token_name, res.data.access, {expires: accessDifferenceInDays})
            setCookie(refresh_token_name, res.data.refresh, {expires: refreshDifferenceInDays})

            // write a user

            dispatch(login({
                authed: true,
                user: res.data.user_info
            }))
        }).catch((err) => {
            if(err.response.status === 401){
                setForm({
                    ...form,
                    validation: {
                        error: {
                            phone: true,
                            password: true,
                        },
                        message: {
                            phone: err.response.data.detail,
                            password: err.response.data.detail,
                        }
                    },
                    requested: false,
                })
            }else {
                setForm({
                    ...form,
                    requested: false,
                })
            }
        })
    }

    return (
        <div className='w-full bg-[#F8F4F1] min-h-screen flex justify-center items-center p-[40px]'>
            <form className='min-w-[531px] pt-[60px] pb-[70px] px-[140px] bg-[#FFFFFF] flex flex-col items-center justify-start gap-[30px]' onSubmit={handleSubmit}>
                <Avatar className='Avatar'><LockOutlinedIcon/></Avatar>
                <div className='w-full flex flex-col justify-start items-center gap-[50px]'>
                    <h1 className='text-[#6E6C6A] text-[30px] font-[700]'>Авторизация</h1>
                    <div className='w-full flex flex-col justify-start items-center gap-[34px]'>
                        <InputMask
                            mask="9(999)-999-999"
                            value={form.values.phone}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        phone: event.target.value.replace(/\D/g, '')
                                    }
                                });
                            }}
                        >
                            <CustomTextField
                                label="Ваш номер"
                                placeholder='Ваш номер'
                                variant="outlined"
                                type='text'
                                fullWidth
                                error={form.validation.error.phone}
                                helperText={form.validation.message.phone}
                                required
                            />
                        </InputMask>

                        <CustomTextField
                            label="Пароль"
                            placeholder='Пароль'
                            variant="outlined"
                            fullWidth
                            type={form.showPassword ? 'text' : 'password'}
                            value={form.values.password}
                            onChange={(event) => {
                                setForm({
                                    ...form,
                                    values: {
                                        ...form.values,
                                        password: event.target.value
                                    }
                                })
                            }}
                            error={form.validation.error.password}
                            helperText={form.validation.message.password}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => {
                                                setForm({
                                                    ...form,
                                                    showPassword: !form.showPassword,
                                                });
                                            }}
                                        >
                                            {form.showPassword ? <VisibilityOff/> : <Visibility/>}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
                <CustomRoundedLoadingButton
                    fullWidth
                    variant='contained'
                    type='submit'
                    loading={form.requested}
                    disabled={form.requested}
                >
                    Войти
                </CustomRoundedLoadingButton>
            </form>
        </div>
    );
}



