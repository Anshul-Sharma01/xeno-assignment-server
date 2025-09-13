# Xeno Assignment - Multi-Tenant Analytics Platform

A comprehensive multi-tenant e-commerce analytics platform that integrates with Shopify to provide real-time dashboard analytics for merchants. The platform enables tenants to sync their Shopify store data and visualize key business metrics including revenue, customer analytics, order trends, and abandoned checkouts.

Client Repository : https://github.com/Anshul-Sharma01/xeno-assignment-client

Client Deployed Link : https://xeno-assignment-client.onrender.com



Server Repository : https://github.com/Anshul-Sharma01/xeno-assignment-server

Server Deployed Link : https://xeno-assignment-server.onrender.com

## High-Level Architecture

<img src="https://res.cloudinary.com/dqnzstk72/image/upload/v1757740825/Screenshot_2025-09-13_101945_bkzafd.png" alt="High-level diagram"/>

- This Xeno assignment is a multi-tenant e-commerce analytics platform that connects with shopify using the apis and ingests the shopify data into local database and then use that data to show real-time dashboard analytics using recharts library.
- It is a full stack application built on MERN ( MongoDb, ExpressJs, ReactJs, NodeJs) stack.
- I have followed jwt accesstoken + refreshtoken flow for authentication where accessToken is shortlived and refreshToken is long-lived.


### Frontend ( React + Typescript)
- Whole Frontend is inspired from Xeno's official website : <a href="https://getxeno.com">Xeno</a>
- Simple, Sleek, Eye-catchy UI using tailwindCSS
- Error boundary is used with toast for notifications.
- Key features : 
    + Authentication flow using redux toolkit and JWT,
    + real-time dashboard analytics visualized using charts, 
    + Socket.io for real-time communication between frontend and backend

### Backend ( NodeJs + ExpressJs)
- Whole Backend is built in MVC Architecture and follows OOPs Pillars and concepts as the backend is structured in the form of classess and objects
- ApiError class is maintained for strcutured error handling
- Zod is used for input validation for fields like name, email and password
- Node-Cron is used to set up the cron jobs for auto syncing of shopify data after a fixed interval


### DataBase 
- Database used : MySql(local development) / PostgreSQL ( Render Deployment )
- APis Used : Shopify APIs for data
- Data Models : Tenants, Products, customers, Orders, Checkouts

> For Tenant Isolation, I have used tenantId as the tenant unique Identifier to isolate each tenant's data with other tenants

### Authentication / Security
- JWT Tokens ( accessToken, refreshToken) for stateless authentication 
- For password hashing bcyrpt library is used
- Cookies are made httpOnly to enhance more secure tokens storage
- CORS are configured only for specific frontend origin

## Setup Instructions


### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   DATABASE_URL=postgresql://username:password@localhost:5432/xeno_db
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   ```

4. **Database Setup:**
   - Create a SQL database named `xeno_db`
   - The application will automatically create tables using Sequelize migrations

5. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Database Schema

The application uses a multi-tenant architecture with the following core entities:

### Entity Relationship Diagram ( Made on Eraser )

<img src="https://res.cloudinary.com/dqnzstk72/image/upload/v1757737050/diagram-export-9-13-2025-1_20_52-AM_i6umia.png" alt="entity-relationship-diagram" />



## API Endpoints

### Authentication Endpoints (`/api/v1/tenant`)
- `POST /register` - Register a new tenant
- `POST /login` - Tenant login
- `POST /refresh-token` - Refresh access token
- `POST /logout` - Tenant logout

### Dashboard Endpoints (`/api/v1/dashboard/:tenantId`)
- `GET /summary` - Get business summary (customers, orders, revenue)
- `GET /orders-by-date` - Get orders grouped by date
- `GET /top-customers` - Get top 5 customers by spending
- `GET /avg-order-value` - Get average order value
- `GET /abandoned-checkouts` - Get abandoned checkout data

### Data Ingestion Endpoints (`/api/v1/ingestion`)
- `POST /sync/:tenantId` - Sync tenant data from Shopify

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Sequelize** - ORM for database operations
- **PostgreSQL** - Primary database ( Render Deployment )
- **MySQL** - Primary database ( Local Deployment )
- **Socket.io** - Real-time communication
- **JWT** - Authentication tokens
- **Axios** - HTTP client for Shopify API
- **Cron Jobs** - Scheduled data synchronization
- **Zod** - Data validation

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **Redux Toolkit** - State management
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **Vite** - Build tool

## Known Limitations & Assumptions

### Assumptions Made:
1. **Shopify Integration**: Assumes all tenants use Shopify as their e-commerce platform
2. **Data Structure**: Assumes Shopify API data structure remains consistent
3. **Authentication**: Uses cookie-based authentication with JWT tokens
4. **Database**: Assumes mySQL availability and proper connection configuration
5. **Real-time Updates**: Assumes WebSocket connections are stable for real-time features

### Current Limitations:
1. **Single E-commerce Platform**: Only supports Shopify integration
2. **Error Handling**: Limited error recovery mechanisms for failed API calls
3. **Data Retention**: No data archival or cleanup policies
4. **Rate Limiting**: No API rate limiting implemented
5. **Caching**: No caching layer for frequently accessed data
6. **Monitoring**: Limited logging and monitoring capabilities

## Next Steps for Going Live  

### 1. **Setup & Deployment**
- Put app inside Docker for easy runs  
- Create CI/CD pipeline (GitHub Actions / GitLab CI)  
- Deploy on cloud (AWS / GCP / Azure)  
- Add load balancer and auto-scaling for traffic handling  

### 2. **Security**
- Add API rate limiting  
- Sanitize and validate all inputs  
- Use security headers + CSRF protection  
- Do regular security checks and update packages  

### 3. **Performance**
- Use Redis cache to speed things up  
- Add proper DB indexes  
- Serve static files with CDN  
- Optimize slow queries and track them  

### 4. **Monitoring**
- Add detailed logs  
- Use tools to monitor app performance  
- Track and alert on errors  
- Build dashboards for key metrics  

### 5. **Data Management**
- Automate data sync across systems  
- Add backup + recovery plan  
- Set clear data retention rules  
- Run validation/quality checks on data  
- Add tools for safe data migration  

### 6. **Features**
- Support more e-commerce platforms  
- Add better analytics and reports  
- Build role-based access (admin, user, etc.)  
- Write automated tests (unit, integration, e2e)  

## 📝 Project Structure

```
xeno-assignment/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts
│   │   ├── Pages/          # Application pages
│   │   ├── redux/          # State management
│   │   └── helpers/        # Utility functions
│   └── package.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   └── package.json
└── README.md
```


## 👨‍💻 Author

**Anshul Sharma** (2211985010)
- Codebase for Assignment of Xeno

---

*This project was developed as part of the Xeno placement drive assignment.*
