// Script to create admin user via API
const axios = require('axios');

const API_URL = 'https://healthapp-beta.eastus.cloudapp.azure.com/api';

async function createAdmin() {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            username: 'admin',
            email: 'admin@healthcare.com',
            password: 'AdminPortal@2025!',
            role: 'ADMIN',
            firstName: 'Admin',
            lastName: 'User'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Response:', response.data);
        console.log('\nYou can now login with:');
        console.log('Username: admin');
        console.log('Password: AdminPortal@2025!');
    } catch (error) {
        console.error('❌ Failed to create admin user');
        console.error('Error:', error.response?.data || error.message);
    }
}

createAdmin();
