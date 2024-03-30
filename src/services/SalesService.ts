import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const SalesService = {
    GetSalesList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/sales-report/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetSale(report_id: any) {
        return useAsync(async () => {
            return await $axios.get(`/sales-report/${report_id}/`);
        }, [report_id])
    },
    async GetAllSalesReports(searchParamsObj: any) {
        return await $axios.get('/sales-report/all/' + CreateSearchParams(searchParamsObj))
    },
}