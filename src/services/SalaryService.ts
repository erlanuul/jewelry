import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams, RemoveEmptyObj} from "../helpers/helpers";

export const SalaryService = {
    GetSalaryList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/salary/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetSalary(salary_id: any) {
        return useAsync(async () => {
            return await $axios.get(`/salary/${salary_id}/`);
        }, [salary_id])
    },
    GetSalaryWithoutPagination(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get(`/salary/without-pagination/` + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    async GetSalaryReportList(searchParamsObj: any) {
        return await $axios.get('/salary/get-report/' + CreateSearchParams(searchParamsObj))
    },
    async DeleteSalary(salary_id: string) {
        return await $axios.delete(`/salary/${salary_id}/`)
    },
    async CreateSalary(salary: any) {
        return await $axios.post('/salary/', RemoveEmptyObj(salary))
    },
}