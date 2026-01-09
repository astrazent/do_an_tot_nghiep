import { useQuery } from '@tanstack/react-query'
import { getListTransaction } from '~/services/admin/adminOrderService'

export const useListOrder = ({ limit, offset }) => {
    return useQuery({
        queryKey: ['orders', limit, offset],
        queryFn: async () => {
            const res = await getListTransaction({ limit, offset })
            return res.data
        },
        refetchInterval: 3000,
        staleTime: 5000,
        keepPreviousData: true,
    })
}