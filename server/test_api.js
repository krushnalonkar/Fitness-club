async function testApi() {
    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "test user",
                email: "testapp@example.com",
                password: "password123"
            })
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

testApi();
