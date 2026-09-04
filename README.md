# KnowYourProduct

KnowYourProduct is a full-stack health and nutrition web application designed to help consumers make informed, data-driven dietary choices. By simply scanning a product's barcode with their device's camera, users can instantly view complex nutritional breakdowns, ingredient concern levels, and health scores.

## Features

- **Real-Time Barcode Scanning**: Uses your device's camera (via `html5-qrcode`) to scan physical products and instantly pull up their digital health profile.
- **In-Depth Nutritional Analysis**: View comprehensive breakdowns of calories, macros, additives, preservatives, and allergens.
- **Smart Scoring System**: Calculates health scores based on nutritional value, ingredient quality, and the level of food processing.
- **Search & Compare**: Manually search for items using an optimized MongoDB text index, and compare multiple products side-by-side to make the best choice.
- **Personalized Dashboards**: Secure user accounts (JWT authentication) allow users to save favorite products, track their scan history, and set dietary preferences.

## Tech Stack

**Frontend:**
- React 19 & Vite
- Tailwind CSS v4 for responsive, modern UI
- React Router DOM for routing
- Axios for API communication
- HTML5-QRCode for browser-based camera scanning

**Backend (REST API):**
- Node.js & Express.js
- MongoDB & Mongoose (complex schemas with text-indexing)
- JSON Web Tokens (JWT) & bcryptjs for secure authentication
- CORS for cross-origin security

## Running Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your machine.

### 1. Setup the Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Seed the database with sample product data (optional but recommended):
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```

### 2. Setup the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory and add your API URL:
```env
VITE_API_URL=http://localhost:5000
```

Start the Vite development server:
```bash
npm run dev
```

Your frontend should now be running on `http://localhost:5173`. Open it in your browser and start scanning!
