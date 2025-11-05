import { useQuery } from '@tanstack/react-query'
import { getListSlider } from '~/services/user/sliderService'

export const useListSlider = (params = {}, options = {}) => {
    return useQuery({
        queryKey: ['slider', 'list', params],
        queryFn: () => getListSlider(params),
        enabled: !!params, // luôn true vì params có default
        staleTime: Infinity,
        cacheTime: Infinity,
        ...options,
    })
}