import {useAsync} from "react-async-hook";
import {$axios} from "../http";

export const AuthService = {
    GetStaffInfo() {
        return useAsync(async () => {
            return await $axios.get('/staff/user-info/');
        }, [])
    },
    async PostAuthData(formValues: any) {
        return await $axios.post('/token/', formValues)
    }
}