import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const DeferService = {
    GetDefersList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/defer-report/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetDefer(defer_id: any) {
        return useAsync(async () => {
            return await $axios.get(`/defer-report/${defer_id}/`);
        }, [defer_id])
    },
    async GetAllDefersReports(searchParamsObj: any) {
        return await $axios.get('/defer-report/all/' + CreateSearchParams(searchParamsObj))
    },
}