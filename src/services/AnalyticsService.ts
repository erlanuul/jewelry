import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const AnalyticsService = {
    GetAnalyticsFinance() {
        return useAsync(async () => {
            return await $axios.get('/analytics/finance/');
        }, [])
    },
    GetAnalyticsDefers(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get('/analytics/defers/' + CreateSearchParams(searchParams));
        }, [CreateSearchParams(searchParams)])
    },
    GetAnalyticsExpenses(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get('/analytics/expenses/' + CreateSearchParams(searchParams));
        }, [CreateSearchParams(searchParams)])
    },
    GetAnalyticsRansoms(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get('/analytics/ransoms/' + CreateSearchParams(searchParams));
        }, [CreateSearchParams(searchParams)])
    },
    GetAnalyticsSales(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get('/analytics/sales/' + CreateSearchParams(searchParams));
        }, [CreateSearchParams(searchParams)])
    },
    GetAnalyticsRatings(searchParams: any) {
        return useAsync(async () => {
            return await $axios.get('/analytics/rating-of-sales-staff/' + CreateSearchParams(searchParams));
        }, [CreateSearchParams(searchParams)])
    },
}