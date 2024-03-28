import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const BoxOfficeService = {
    GetBoxOfficeList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/box-office/list/' + CreateSearchParams(searchParamsObj));
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
    GetBoxOfficePaymentTypes() {
        return useAsync(async () => {
            return await $axios.get('/box-office/payment-types/');
        }, [])
    },
}