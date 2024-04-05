import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const ClientService = {
    GetClientList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/clients/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetPurchasesList(id: any, searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get(`/clients/purchases/${id}/` + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetDefersList(id: any, searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get(`/clients/defers/${id}/` + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    SearchClient(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/clients/search/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetClient(id: any) {
        return useAsync(async () => {
            return await $axios.get(`/clients/${id}/`);
        }, [])
    },
    async DeleteClient(client_id: string) {
        return await $axios.delete(`/clients/${client_id}/`)
    },
    async CreateClient(client: any) {
        return await $axios.post('/clients/', client)
    },
    async EditClient(client_id: any, client: any) {
        return await $axios.put(`/clients/${client_id}/`, client)
    }
}