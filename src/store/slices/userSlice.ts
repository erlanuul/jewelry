import {createSlice} from '@reduxjs/toolkit';
import {removeCookie} from 'typescript-cookie';
import {access_token_name, refresh_token_name} from "../../http";

const userInitialState = {
    authed: false,
    user: null
};


export const userSlice = createSlice({
    name: 'userData',
    initialState: userInitialState,
    reducers: {
        logout: ()=>{
            removeCookie(access_token_name);
            removeCookie(refresh_token_name);
            window.location.reload()
            return userInitialState
        },
        login: (state, action)=>{
            state = action.payload
            window.location.reload()
            return state
        }
    },
});

export const { logout, login } = userSlice.actions
export default userSlice.reducer

