import { useQuery } from '@tanstack/react-query'
import { getListSlider } from '~/services/user/sliderService'

export const useListSlider = (params = {}, options = {}) => {
    return useQuery({
        queryKey: ['slider', 'list', params],
        queryFn: () => getListSlider(params),
        enabled: !!params,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...options,
    })
}
