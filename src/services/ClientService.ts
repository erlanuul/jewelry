import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const ClientService = {
    GetClientList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/clients/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    async GetClient(client_id: string) {
        return await $axios.get(`/clients/${client_id}/`)
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