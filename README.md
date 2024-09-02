# Wallet API (Node.js)

This project implements a wallet system using Node.js, with a focus on API functionality. Users can manage their balances, perform transactions, and receive email notifications. Below, I've outlined the essential features and tasks included in this project:

## Features

1. **Strict ES6 Standards:**
   - The codebase adheres to modern ES6 syntax and best practices.
   - ESLint and Prettier are set up to maintain consistent code formatting.

2. **User Authentication and JWT:**
   - User sessions are managed using JSON Web Tokens (JWT).
   - Secure login supports both password and OTP (one-time password).

3. **Email Verification:**
   - Upon user signup, an email verification link is sent to the user's email address.
   - Users must verify their email before accessing wallet features.

4. **Fake Balance on Signup:**
   - New users receive an initial fake balance upon registration.
   - This balance allows them to perform transactions within the wallet.

5. **Transfer Functionality:**
   - Users can transfer funds between their accounts.
   - Appropriate validations ensure sufficient balance and a valid recipient.

6. **Transaction Details:**
   - Both users and administrators can view transaction history.
   - Transactions include details such as sender, recipient, amount, and timestamp.

7. **Email Notifications:**
   - Users receive email notifications for successful and failed transactions.
   - Transaction details are included in the email content.

## Installation and Setup

1. **Clone this repository:**
2. git clone <repository-url> cd wallet-api


2. **Install dependencies:**

npm install


3. **Set up environment variables:**
- Create a `.env` file with the following variables:
  ```
  SECRET_KEY=<your-secret-key>
  EMAIL_USER=<your-email@example.com>
  EMAIL_PASS=<your-email-password>
  ```

4. **Run the application:**

npm start


## API Endpoints

- `POST /signup`: User registration (name, email, password).
- `POST /login`: User login (password or OTP).
- `GET /user`: Get user details (requires authentication).
- `POST /transfer`: Perform a fund transfer (requires authentication).
- `GET /transactions`: View transaction history (requires authentication).

## Contributing

Contributions are welcome! Please follow the contribution guidelines.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
