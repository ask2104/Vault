# Warranty & Bill Manager

A MERN stack application for managing warranties and bills with receipt upload functionality.

## Features

- Add warranty items and bills with details like title, description, purchase date, expiry date, and receipts
- Upload and preview receipts (images/PDFs)
- Search and filter entries by category or expiry date
- CRUD operations for all entries
- Responsive and modern UI

## Project Structure

```
/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/warranty-manager
   ```

4. Start the development servers:
   ```bash
   # Start backend server (from server directory)
   npm run dev

   # Start frontend server (from client directory)
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Technologies Used

- Frontend:
  - React.js
  - React Router
  - Axios
  - Material-UI
  - React Hooks

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - Mongoose
  - Multer (for file uploads)
  - CORS 