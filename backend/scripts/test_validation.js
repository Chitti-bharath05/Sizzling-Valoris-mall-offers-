const API_URL = 'http://localhost:5000/api';

async function testValidation() {
    console.log('--- Testing Validation Enforcement (Native Fetch) ---');

    // Helper to log response
    const logRes = async (name, res) => {
        console.log(`\n[${name}] Status: ${res.status}`);
        const data = await res.json();
        if (data.errors) console.log('Errors:', data.errors);
        else if (data.message) console.log('Message:', data.message);
    };

    // 1. Invalid Registration (Short password, missing name)
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'bad@user.com',
                password: '123',
                role: 'customer'
            })
        });
        await logRes('TEST 1: Invalid Registration', res);
    } catch (e) { console.error('Test 1 failed:', e.message); }

    // 2. Invalid Login (Missing password)
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@test.com'
            })
        });
        await logRes('TEST 2: Invalid Login', res);
    } catch (e) { console.error('Test 2 failed:', e.message); }

    // 3. Invalid Store Creation (Invalid ownerId format)
    try {
        const res = await fetch(`${API_URL}/stores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                storeName: 'X',
                ownerId: 'short',
                location: 'Here',
                category: 'Fashion'
            })
        });
        await logRes('TEST 3: Invalid Store Creation', res);
    } catch (e) { console.error('Test 3 failed:', e.message); }

    console.log('\n--- Validation Testing Complete ---');
}

testValidation();
