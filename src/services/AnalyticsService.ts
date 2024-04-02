import {useAsync} from "react-async-hook";
import {$axios} from "../http";

export const AnalyticsService = {
    GetAnalyticsFinance() {
        return useAsync(async () => {
            return await $axios.get('/analytics/finance/');
        }, [])
    },
}