---

# E-Commerce Backend API

This project is a Node.js backend application for an e-commerce platform. It provides APIs for user authentication, product management and order handling.

## Features

- **User Authentication**: Allows users to register, login, and logout. Implements JWT (JSON Web Token) for authentication and authorization.
- **Product Management**: Enables CRUD operations for managing products, including creation, retrieval, update, and deletion.
- **Order Handling**: Supports creating, retrieving, updating, and deleting orders. Provides functionalities for getting all orders, getting orders by user, and getting a single order.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework for Node.js used for handling HTTP requests.
- **MongoDB**: NoSQL database used for storing product, user, order, and review data.
- **Mongoose**: MongoDB object modeling tool used for schema validation and modeling.
- **JWT (JSON Web Token)**: Authentication mechanism for securing APIs.
- **HTTP Status Codes**: Standard response codes used by HTTP to indicate the status of API requests.
- **Express-rate-limit**: Middleware for limiting repeated requests to public APIs.
- **Helmet**: Middleware for securing Express apps by setting various HTTP headers.
- **Cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing) in Express apps.

## Getting Started

To run this project locally, follow these steps:

1. Clone this repository to your local machine.
2. Navigate to the project directory.
3. Install dependencies using `npm install`.
4. Set up environment variables by creating a `.env` file and providing the necessary configuration (e.g., database connection string, JWT secret).
5. Start the server using `npm start`.
6. The server will start running at the specified port, and you can access the APIs using tools like Postman or any REST client.

## API Documentation

For detailed documentation on the available APIs and their usage, refer to the link [here](https://e-commerceapi-2cg6.onrender.com/)! .


---



