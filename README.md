# Restaurant Management System

A complete restaurant management system with QR code-based table ordering, real-time order tracking, and comprehensive admin dashboard.

## 🚀 Features

### Customer Features
- **QR Code Ordering**: Scan QR code at table to view menu and place orders
- **Multiple Service Types**: Dining, Takeaway, Delivery
- **Real-time Order Tracking**: Live updates on order status
- **Menu Browsing**: Search, filter by categories, view priority items
- **Cart Management**: Add, remove, modify quantities
- **Payment Integration**: Multiple payment options

### Restaurant Admin Features
- **Dashboard**: Real-time analytics, order statistics, revenue tracking
- **Table Management**: Create tables with unique QR codes, track status
- **Menu Management**: Categories, items, pricing, availability
- **Order Management**: View, update, track all orders
- **Staff Management**: Add staff with different roles and permissions
- **Analytics & Reports**: Sales reports, popular items, performance metrics

### Technical Features
- **Real-time Updates**: Socket.io for live order notifications
- **QR Code Generation**: Auto-generated unique QR codes for each table
- **Responsive Design**: Mobile-first design for all devices
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Type Safety**: Full TypeScript support
- **Database**: MongoDB with Mongoose ODM

## 🏗️ Architecture

```
restaurant-management/
├── frontend/          # React + TypeScript + Vite frontend
│   ├── components/    # Reusable UI components
│   ├── pages/        # Page components
│   ├── context/      # React contexts
│   ├── lib/          # Utilities and API service
│   └── styles/       # CSS and styling
├── backend/          # Node.js + Express + MongoDB backend
│   ├── src/
│   │   ├── models/   # MongoDB schemas
│   │   ├── routes/   # API endpoints
│   │   ├── controllers/ # Business logic
│   │   ├── middleware/  # Custom middleware
│   │   ├── utils/    # Utility functions
│   │   └── config/   # Database and app configuration
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **React Router** - Client-side routing
- **Lucide React** - Icons
- **Radix UI** - Accessible UI components
- **Socket.io Client** - Real-time communication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **QRCode** - QR code generation
- **Bcrypt** - Password hashing

## ⚡ Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd restaurant-management
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

4. **Setup Database**
- Start MongoDB locally or use MongoDB Atlas
- Update `MONGODB_URI` in backend/.env
- The application will create collections automatically

### Environment Variables

#### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/restaurant_management
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## 📱 Usage

### For Restaurant Owners

1. **Setup Restaurant**
   - Register an admin account
   - Create your restaurant profile
   - Add menu categories and items

2. **Configure Tables**
   - Create tables with seating capacity
   - Generate unique QR codes for each table
   - Print and place QR codes on tables

3. **Manage Operations**
   - Monitor orders in real-time
   - Update order status
   - View analytics and reports
   - Manage staff and permissions

### For Customers

1. **Scan QR Code**
   - Use any QR scanner to scan table QR code
   - Automatically redirected to restaurant menu

2. **Place Order**
   - Browse menu by categories
   - Add items to cart
   - Choose service type (dining/takeaway/delivery)
   - Place order and track status

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Restaurant
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/:id/menu` - Get restaurant menu

### Tables
- `GET /api/tables/restaurant/:id` - Get restaurant tables
- `POST /api/tables` - Create table
- `PUT /api/tables/:id` - Update table
- `PATCH /api/tables/:id/status` - Update table status

### QR Codes
- `GET /api/qr/table/:id` - Generate table QR code
- `GET /api/qr/restaurant/:id/tables` - Generate all table QR codes
- `POST /api/qr/table/:id/regenerate` - Regenerate table QR code

### Orders
- `GET /api/orders/restaurant/:id` - Get restaurant orders
- `POST /api/orders` - Create order
- `PATCH /api/orders/:id/status` - Update order status
- `GET /api/orders/analytics/:id` - Get order analytics

### Admin
- `GET /api/admin/dashboard/:id` - Dashboard statistics
- `GET /api/admin/staff/:id` - Get staff members
- `GET /api/admin/reports/:id` - Generate reports

## 🔄 Real-time Features

The system uses Socket.io for real-time updates:

- **New Order Notifications**: Instantly notify kitchen and admin
- **Order Status Updates**: Live status changes for customers
- **Table Status Changes**: Real-time table availability updates
- **Kitchen Dashboard**: Live order queue for kitchen staff

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Role-based Access**: Different permissions for different user roles
- **Rate Limiting**: API rate limiting to prevent abuse
- **Helmet**: Security headers for Express app
- **Input Validation**: Comprehensive input validation

## 📊 Database Schema

### Key Collections
- **restaurants** - Restaurant information and settings
- **tables** - Table details with QR codes
- **categories** - Menu categories
- **menuitems** - Menu items with pricing and details
- **orders** - Customer orders and status
- **users** - User accounts and staff
- **extracharges** - Additional charges (tax, service, delivery)

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or cloud MongoDB
2. Deploy to services like Heroku, Railway, or DigitalOcean
3. Update environment variables
4. Set up process manager (PM2) for production

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy to Netlify, Vercel, or any static hosting
3. Update API URLs to production backend

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

## 🎯 Future Enhancements

- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with payment gateways
- [ ] Multi-language support
- [ ] Kitchen display system
- [ ] Customer loyalty program
- [ ] Integration with food delivery platforms
- [ ] Advanced reporting and insights
