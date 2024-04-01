import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const MetalService = {
    GetMetalList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/metals/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
}