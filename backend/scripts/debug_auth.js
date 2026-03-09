const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAuth() {
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    console.log(`--- Testing Registration with ${testEmail} ---`);
    try {
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test user',
            email: testEmail,
            password: testPassword,
            role: 'customer'
        });
        console.log('Registration Success:', regRes.data.success);
        console.log('User ID:', regRes.data.user.id);
        
        console.log(`\n--- Testing Login with ${testEmail} ---`);
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testEmail,
            password: testPassword
        });
        console.log('Login Success:', loginRes.data.success);
        console.log('Token:', loginRes.data.user.token ? 'Received' : 'MISSING');
        
    } catch (error) {
        console.error('Test Failed!');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    }
}

testAuth();
