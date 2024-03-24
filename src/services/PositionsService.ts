import {useAsync} from "react-async-hook";
import {$axios} from "../http";

export const PositionsService = {
    GetPositionsList() {
        return useAsync(async () => {
            return await $axios.get('/position/');
        }, [])
    }
}