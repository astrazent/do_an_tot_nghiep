export const formatDateTime = (dateInput, options = {}) => {
    if (!dateInput) return 'N/A'

    const date = new Date(dateInput)
    if (isNaN(date)) return 'N/A'

    const { showTime = true, hour12 = false } = options

    const baseOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }

    if (showTime) {
        baseOptions.hour = '2-digit'
        baseOptions.minute = '2-digit'
        baseOptions.hour12 = hour12
    }

    return date.toLocaleString('vi-VN', baseOptions)
}
