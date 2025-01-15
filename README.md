# Food Delivery System

A web-based food delivery system with user authentication, menu management, and order processing capabilities.

## Features

### Authentication

-   User registration
-   User login with JWT authentication
-   Protected routes for authenticated users

### Menu Management

-   View all menu items
-   Add new menu items
-   Update menu item availability
-   Delete menu items
-   Filter menu by category
-   Sort menu by price
-   Pagination support

### Order System

-   Place new orders
-   View order history
-   Real-time order status tracking
-   Calculate order totals

## API Endpoints

### Authentication

```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
```

### Menu

```
GET /api/menu - Get menu items (supports pagination, filtering, sorting)
POST /api/menu - Add new menu item
PUT /api/menu/:id - Update menu item
DELETE /api/menu/:id - Delete menu item
GET /api/menu/categories - Get all menu categories
```

### Orders

```
GET /api/order - Get user orders
POST /api/order - Place new order
GET /api/order/pending - Get pending orders
```

## Menu Item Structure

```json
{
    "name": "String",
    "category": "String",
    "price": "Number",
    "availability": "Boolean"
}
```

## Order Structure

```json
{
    "items": [
        {
            "menuId": "String",
            "name": "String",
            "quantity": "Number"
        }
    ],
    "totalAmount": "Number"
}
```

## Technology Stack

-   Backend: Node.js with Express
-   Database: MongoDB
-   Authentication: JWT (JSON Web Tokens)

## Getting Started

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Start the server
5. Access the application through the browser

## Environment Variables

```
MONGODB_URI=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret
```

## License

MIT License
