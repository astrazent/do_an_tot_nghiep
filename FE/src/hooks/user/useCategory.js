import { useQuery } from '@tanstack/react-query'
import { getAllCategories } from '~/services/user/categoryService'

export const useAllCategories = () => {
    return useQuery({
        queryKey: ['categories', 'all'],
        queryFn: getAllCategories,
        staleTime: Infinity,
        cacheTime: Infinity,
    })
}
