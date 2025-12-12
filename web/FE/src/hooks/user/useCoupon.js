import { useQuery } from '@tanstack/react-query'
import { getCouponByCode } from '~/services/user/couponService'

export const useCouponByCode = couponCode => {
    return useQuery({
        queryKey: ['coupon', 'by_code', couponCode],
        queryFn: () => getCouponByCode(couponCode),
        enabled: !!couponCode,
        staleTime: 0,
        cacheTime: 0,
        retry: 0,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    })
}
