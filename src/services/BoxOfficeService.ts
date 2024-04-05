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
    GetBoxOfficePaymentProducts(transaction: any, searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get(`/box-office/${transaction.operation_type}/${transaction.operation}/products/` + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetBoxOfficeInterchange(id: any) {
        return useAsync(async () => {
            return await $axios.get(`/box-office/income/interchange/${id}/`);
        }, [])
    },
    async CreateTransaction(transaction: any, form_data?: any) {
        return await $axios.post(`/box-office/${transaction.operation_type}/${transaction.operation}/`, transaction.operation === 'ransom' ? form_data : transaction)
    },
    async CreateWithDrawal(values: any) {
        return await $axios.post(`/box-office/withdrawal/create/`, values)
    },
}