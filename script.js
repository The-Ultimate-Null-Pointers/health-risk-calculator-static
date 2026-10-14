const API_URL = 'https://health-risk-calculator-unp-node-f5hygtdhemhxc6ef.centralus-01.azurewebsites.net/'


// Wake up server when page loads
async function pingServer() {
    try {
        const response = await fetch(`${API_URL}/api/ping`)
        const text = await response.text()
        console.log('Server says:', text)
    } catch (error) {
        console.error('Ping failed:', error)
    }
}

pingServer()