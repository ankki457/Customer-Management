from flask import Flask, request, jsonify

app = Flask(__name__)

# Simulated user data for authentication (replace with your actual logic)
users = {
    'test@sunbasedata.com': {
        'password': 'Test@123',
        'token': 'your_secret_token'
    }
}

@app.route('/auth', methods=['POST'])
def authenticate():
    data = request.get_json()
    username = data.get('login_id')
    password = data.get('password')

    if username in users and users[username]['password'] == password:
        return jsonify({'token': users[username]['token']}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

if __name__ == '__main__':
    app.run(debug=True)
