import { useContext, useEffect } from 'react'
import { SSEContext } from '~/contexts/SSEContext'
import { useAlert } from '~/contexts/AlertContext'
import { useQueryClient } from '@tanstack/react-query'
import { useCurrentUser } from '~/hooks/user/useUser'

export default function GlobalSSEHandler() {
    const message = useContext(SSEContext)
    const { showAlert } = useAlert()
    const queryClient = useQueryClient()
    const { user } = useCurrentUser()
    useEffect(() => {
        if (!message) return
        switch (message.event) {
            case 'transaction_added':
                showAlert(`${message.message}`, {
                    type: 'success',
                    duration: 3000,
                })
                if (user?.user_id) {
                    queryClient.invalidateQueries([
                        'transactions',
                        user.user_id,
                    ])
                }
                break

            default:
                showAlert(`Sự kiện mới: ${JSON.stringify(message)}`, {
                    type: 'info',
                    duration: 2000,
                })
        }
    }, [message])

    return null
}
