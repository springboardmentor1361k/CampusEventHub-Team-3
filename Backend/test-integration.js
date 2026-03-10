const http = require('http');

const request = (options, postData) => {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({
                status: res.statusCode,
                body: JSON.parse(data || '{}')
            }));
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
};

(async () => {
    console.log("Starting tests...");
    try {
        const rand = Math.floor(Math.random() * 100000);
        // Test Register
        const regRes = await request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/register',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }, JSON.stringify({
            name: 'Test Admin',
            email: `admin${rand}@test.com`,
            password: 'Password@123',
            role: 'college_admin',
            college: 'Test College'
        }));
        console.log("Register:", regRes.status, regRes.body.message || regRes.body);

        let token = regRes.body.token;

        if (!token) {
            console.log("Register failed, trying login");
            const loginRes = await request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/auth/login',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, JSON.stringify({
                email: `admin${rand}@test.com`,
                password: 'Password@123'
            }));
            token = loginRes.body.token;
            console.log("Login:", loginRes.status, !!token ? "Success" : "Failed");
        }

        if (token) {
            // Test Create Event
            const eventRes = await request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/events',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }, JSON.stringify({
                title: 'Integration Test Event',
                description: 'Testing if backend route works',
                category: 'workshop',
                college: 'Test College',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 86400000).toISOString(),
                venue: 'Main Hall'
            }));
            console.log("Create Event:", eventRes.status, eventRes.body.message || eventRes.body);

            // Test Get Events
            const getEventsRes = await request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/events',
                method: 'GET'
            });
            console.log("Get Events:", getEventsRes.status, `Found ${getEventsRes.body.events?.length || 0} events`);
        }
    } catch (err) {
        console.error("Test error:", err);
    }
})();
