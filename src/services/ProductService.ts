import {useAsync} from "react-async-hook";
import {$axios} from "../http";
import {CreateSearchParams} from "../helpers/helpers";

export const ProductService = {
    GetProductList(searchParamsObj: any) {
        return useAsync(async () => {
            return await $axios.get('/products/' + CreateSearchParams(searchParamsObj));
        }, [CreateSearchParams(searchParamsObj)])
    },
    GetProductInfo(product_id: any) {
        return useAsync(async () => {
            return await $axios.get(`/products/${product_id}/`);
        }, [product_id])
    },
    async GetProduct(product_id: string) {
        return await $axios.get(`/products/${product_id}/`)
    },
    async DeleteProduct(product_id: string) {
        return await $axios.delete(`/products/${product_id}/`)
    },
    async CreateProduct(product: any) {
        return await $axios.post('/products/', product)
    },
    async EditProduct(product_id: any, product: any) {
        return await $axios.put(`/products/update/${product_id}/`, product)
    }
}