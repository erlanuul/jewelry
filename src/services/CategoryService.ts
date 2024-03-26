import {useAsync} from "react-async-hook";
import {$axios} from "../http";

export const CategoryService = {
    GetCategoryList() {
        return useAsync(async () => {
            return await $axios.get('/categories/');
        }, [])
    }
}