import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const BoxOfficeService = {
    GetBoxOfficeTransactionList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/box-office/transaction/list/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetBoxOfficeOperationTypes() {
        return useAsync(async () => {
            return await $axios.get('/box-office/operation-types/');
        }, [])
    },
    GetBoxOfficeOperations(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/box-office/operations/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
}