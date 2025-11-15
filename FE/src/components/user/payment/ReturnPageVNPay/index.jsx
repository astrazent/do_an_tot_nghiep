import { useSearchParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { FiAlertCircle, FiHome } from 'react-icons/fi'
import { React, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useCreateTransaction } from '~/hooks/user/useTransaction'
import { deleteAllCart } from '~/Redux/reducers/cartItemReducer'
import { resetOrder } from '~/Redux/reducers/orderReducer'
import { useAlert } from '~/contexts/AlertContext'
import { useCurrentUser } from '~/hooks/user/useUser'
import { useDeleteCartByUser } from '~/hooks/user/useCartItem'

const ReturnPageVNPay = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { showAlert } = useAlert()
    const orderState = useSelector(state => state.order)

    const paymentData = searchParams.has('vnp_TxnRef')
        ? {
              success: searchParams.get('success') === 'true',
              code: searchParams.get('code') || '',
              message: searchParams.get('message') || '',
              data: {
                  vnp_Amount: searchParams.get('vnp_Amount') || '',
                  vnp_BankCode: searchParams.get('vnp_BankCode') || '',
                  vnp_BankTranNo: searchParams.get('vnp_BankTranNo') || '',
                  vnp_CardType: searchParams.get('vnp_CardType') || '',
                  vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
                  vnp_PayDate: searchParams.get('vnp_PayDate') || '',
                  vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
                  vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
                  vnp_TransactionNo:
                      searchParams.get('vnp_TransactionNo') || '',
                  vnp_TransactionStatus:
                      searchParams.get('vnp_TransactionStatus') || '',
                  vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
              },
          }
        : null

    const { user, isAuthenticated, loading: userLoading } = useCurrentUser()

    const { mutate: deleteCartByUser } = useDeleteCartByUser({
        onSuccess: () => {
            console.log('Giỏ hàng đã được làm mới sau khi tạo đơn hàng')
        },
        onError: () => {
            console.log('Không thể xóa giỏ hàng sau khi tạo đơn hàng')
        },
    })

    const { mutate: createTransaction, isLoading: creatingTransaction } =
        useCreateTransaction({
            onSuccess: async data => {
                showAlert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm.', {
                    type: 'success',
                })
                try {
                    if (user && user.user_id) {
                        await deleteCartByUser(user.user_id)
                    } else {
                        dispatch(deleteAllCart())
                    }

                    dispatch(resetOrder())
                } catch (err) {
                    console.error('Xóa giỏ hàng thất bại:', err)
                }
            },
            onError: err => {
                console.error('Tạo transaction thất bại:', err)
                showAlert('Đặt hàng thất bại. Vui lòng thử lại.', {
                    type: 'error',
                    duration: 3000,
                })
            },
        })

    const formatCurrency = amount => {
        const number = parseInt(amount || '0') / 100
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(number)
    }

    const formatDate = dateString => {
        if (!dateString) return ''
        const year = dateString.substring(0, 4)
        const month = dateString.substring(4, 6)
        const day = dateString.substring(6, 8)
        const hour = dateString.substring(8, 10)
        const minute = dateString.substring(10, 12)
        const second = dateString.substring(12, 14)
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`
    }

    useEffect(() => {
        if (paymentData) {
            window.scrollTo({
                top: 230,
                left: 0,
                behavior: 'smooth',
            })
        }
    }, [paymentData])

    const hasValidOrder =
        orderState &&
        (orderState.amount > 0 ||
            (orderState.items && orderState.items.length > 0))

    useEffect(() => {
        if (paymentData?.success && !creatingTransaction && hasValidOrder) {
            createTransaction(orderState)
        }
    }, [paymentData?.success, creatingTransaction, hasValidOrder])

    if (!paymentData) {
        return (
            <div className="bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center my-10">
                    <FiAlertCircle className="mx-auto w-16 h-16 text-red-500 mb-4" />
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">
                        Không có giao dịch nào được thực hiện
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Vui lòng thực hiện thanh toán hoặc kiểm tra lại đường
                        dẫn.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out flex items-center justify-center mx-auto"
                    >
                        <FiHome className="w-5 h-5 mr-2" />
                        Quay về trang chủ
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gray-100 min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
                <div className="flex flex-col items-center">
                    <svg
                        className={`w-24 h-24 mb-4 ${paymentData.success ? 'text-green-500' : 'text-red-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d={
                                paymentData.success
                                    ? 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                                    : 'M6 18L18 6M6 6l12 12'
                            }
                        ></path>
                    </svg>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {paymentData.message}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {paymentData.success
                            ? 'Cảm ơn bạn đã hoàn tất thanh toán.'
                            : 'Thanh toán không thành công, vui lòng thử lại.'}
                    </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">
                        Chi tiết giao dịch
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">
                                Mã giao dịch:
                            </span>
                            <span className="text-gray-800 font-semibold">
                                {paymentData.data.vnp_TxnRef}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">
                                Số tiền:
                            </span>
                            <span className="text-green-600 font-bold text-lg">
                                {formatCurrency(paymentData.data.vnp_Amount)}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">
                                Ngân hàng:
                            </span>
                            <span className="text-gray-800">
                                {paymentData.data.vnp_BankCode}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">
                                Mã GD ngân hàng:
                            </span>
                            <span className="text-gray-800">
                                {paymentData.data.vnp_BankTranNo}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="font-medium text-gray-600">
                                Thời gian thanh toán:
                            </span>
                            <span className="text-gray-800">
                                {formatDate(paymentData.data.vnp_PayDate)}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 col-span-1 md:col-span-2">
                            <span className="font-medium text-gray-600">
                                Nội dung:
                            </span>
                            <span className="text-gray-800 text-right">
                                {paymentData.data.vnp_OrderInfo}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center space-x-4">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                    >
                        Tiếp tục mua sắm
                    </button>
                    <button
                        onClick={() => navigate('/user/purchase')}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition duration-300 ease-in-out"
                    >
                        Xem đơn hàng
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReturnPageVNPay
