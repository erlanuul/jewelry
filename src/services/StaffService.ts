import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams, RemoveEmptyObj} from "../helpers/helpers";

export const StaffService = {
    GetStaffList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/staff/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    async DeleteStaff(id: string) {
        return await $axios.delete(`/staff/${id}/`)
    },
    async CreateStaff(staff: any) {
        return await $axios.post('/staff/', RemoveEmptyObj(staff))
    },
    async EditStaff(staff: any) {
        return await $axios.put(`/staff/${staff.id}/`, RemoveEmptyObj(staff))
    }
}