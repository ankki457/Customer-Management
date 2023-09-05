document.addEventListener('DOMContentLoaded', function () {
    // API Endpoint URLs
    const authURL = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp';
    const apiURL = 'https://qa2.sunbasedata.com/sunbase/portal/api/assignment.jsp';

    // Bearer Token obtained during login
    let authToken = '';

    // Helper function to send API requests with Bearer Token
    async function sendAuthorizedRequest(method, url, data = null) {
        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return response;
        } catch (error) {
            console.error('API Request Error:', error);
        }
    }

    // Login Form Submission
    document.getElementById('loginForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const credentials = {
            login_id: username,
            password: password
        };
        try {
            const response = await fetch(authURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            if (response.status === 200) {
                const data = await response.json();
                authToken = data.token;
                // Hide login form, show other forms/buttons
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('customerData').style.display = 'block';
            } else {
                document.getElementById('message').innerHTML = 'Login failed. Please check your credentials.';
            }
        } catch (error) {
            console.error('Login Error:', error);
        }
    });

    // Create Customer Form Submission
    document.getElementById('createCustomerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        // Add other input field values

        const customerData = {
            first_name: firstName,
            last_name: lastName,
            // Add other customer data fields
        };

        const response = await sendAuthorizedRequest('POST', `${apiURL}?cmd=create`, customerData);

        if (response.status === 201) {
            document.getElementById('message').innerHTML = 'Customer created successfully.';
            // Clear the form
            document.getElementById('createCustomerForm').reset();
        } else if (response.status === 400) {
            document.getElementById('message').innerHTML = 'First Name or Last Name is missing.';
        }
    });

    // Get Customer List
    async function getCustomerList() {
        const response = await sendAuthorizedRequest('GET', `${apiURL}?cmd=get_customer_list`);
        if (response.status === 200) {
            const customers = await response.json();
            // Display the list of customers in the UI
            // You can format it as a table or any other desired format
        } else {
            console.error('Failed to retrieve customer list.');
        }
    }

    getCustomerList();

    // Update Customer Form Submission
    document.getElementById('updateCustomerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        // Add other input field values

        const customerData = {
            first_name: firstName,
            last_name: lastName,
            // Add other customer data fields
        };

        const response = await sendAuthorizedRequest('POST', `${apiURL}?cmd=update`, customerData);

        if (response.status === 200) {
            document.getElementById('message').innerHTML = 'Customer updated successfully.';
            // Clear the form
            document.getElementById('updateCustomerForm').reset();
        } else if (response.status === 400) {
            document.getElementById('message').innerHTML = 'Body is Empty.';
        } else if (response.status === 500) {
            document.getElementById('message').innerHTML = 'UUID not found.';
        }
    });

    // Delete Customer Form Submission
    document.getElementById('deleteCustomerForm').addEventListener('submit', async function (e) {
        e.preventDefault();
        const customerId = document.getElementById('customerId').value;

        const response = await sendAuthorizedRequest('POST', `${apiURL}?cmd=delete&uuid=${customerId}`);

        if (response.status === 200) {
            document.getElementById('message').innerHTML = 'Customer deleted successfully.';
            // Clear the form
            document.getElementById('deleteCustomerForm').reset();
        } else if (response.status === 400) {
            document.getElementById('message').innerHTML = 'UUID not found.';
        } else if (response.status === 500) {
            document.getElementById('message').innerHTML = 'Error: Customer not deleted.';
        }
    });
});
