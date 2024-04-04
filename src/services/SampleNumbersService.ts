import {useAsync} from "react-async-hook";
import {$axios} from "../http";

export const SampleNumbersService = {
     GetSampleNumbersList() {
        return useAsync(async () => {
            return await $axios.get('/sample-numbers/');
        }, [])
    }
}