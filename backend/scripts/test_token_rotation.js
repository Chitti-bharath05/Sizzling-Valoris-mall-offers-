const API_URL = 'http://localhost:5000/api';

async function testTokenRotation() {
    console.log('--- Testing Token Rotation & Expiry ---');

    try {
        // 1. Login
        console.log('\n[PHASE 1] Logging in...');
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'customer@test.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const { token, refreshToken } = loginData.user;
        console.log('Got Access Token (Short-lived)');
        console.log('Got Refresh Token (Long-lived)');

        // 2. Access Protected Resource
        console.log('\n[PHASE 2] Accessing protected resource...');
        const userRes = await fetch(`${API_URL}/auth/users`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Access Status:', userRes.status);

        // 3. Simulate Expiry (Wait or just call refresh)
        console.log('\n[PHASE 3] Manually refreshing token...');
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        const refreshData = await refreshRes.json();
        console.log('Refresh Success:', refreshData.success);
        console.log('New Access Token Received');

        // 4. Verify New Token
        console.log('\n[PHASE 4] Verifying new token...');
        const verifyRes = await fetch(`${API_URL}/auth/users`, {
            headers: { 'Authorization': `Bearer ${refreshData.token}` }
        });
        console.log('New Token Access Status:', verifyRes.status);

        // 5. Logout
        console.log('\n[PHASE 5] Logging out...');
        const logoutRes = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });
        const logoutData = await logoutRes.json();
        console.log('Logout Success:', logoutData.success);

    } catch (e) {
        console.error('Test Failed:', e.message);
    }

    console.log('\n--- Token Rotation Testing Complete ---');
}

testTokenRotation();
