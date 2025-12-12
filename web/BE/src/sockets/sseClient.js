export const sseClients = []

export function addClient(res) {
    sseClients.push(res)
    console.log('🔵 SSE Client connected:', sseClients.length)
}

export function removeClient(res) {
    const index = sseClients.indexOf(res)
    if (index !== -1) sseClients.splice(index, 1)
    console.log('🔴 SSE Client disconnected:', sseClients.length)
}

export function broadcast(data) {
    const payload = `data: ${JSON.stringify(data)}\n\n`
    sseClients.forEach(client => client.write(payload))
}
