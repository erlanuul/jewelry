import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams, RemoveEmptyObj} from "../helpers/helpers";

export const InventoryService = {
    GetInventoryList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/inventory-check/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetInventoryInfo() {
        return useAsync(async () => {
            return await $axios.get('/inventory-check/get-info/');
        }, [])
    },
    async CreateInventory(inventory: any) {
        return await $axios.post('/inventory-check/', RemoveEmptyObj(inventory))
    },
}