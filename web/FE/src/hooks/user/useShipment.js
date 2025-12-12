import { useQuery } from '@tanstack/react-query'
import { getAllShipments } from '~/services/shipmentService'

export const useAllShipments = () => {
    return useQuery({
        queryKey: ['allShipments'],
        queryFn: getAllShipments,
        staleTime: Infinity,
        cacheTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
