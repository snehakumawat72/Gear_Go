# 🚗 Gear Go - Car & Gear Rental Platform

A full-stack web application for car and camping gear rental services, built with React.js frontend and Node.js/Express backend.

## 🌟 Features

### For Customers
- **Car Rentals**: Browse and book available cars
- **Gear Rentals**: Rent camping equipment and outdoor gear
- **User Authentication**: Secure login and registration
- **Booking Management**: View and manage your bookings
- **Payment Integration**: Secure payments via Razorpay
- **Responsive Design**: Works seamlessly on all devices

### For Owners
- **Owner Dashboard**: Comprehensive management interface
- **Car Management**: Add, edit, and manage car listings
- **Gear Management**: Manage camping gear inventory
- **Booking Management**: Handle rental requests and bookings
- **Analytics**: Track rental performance and revenue

### General Features
- **Real-time Updates**: Live booking status updates
- **Image Management**: Powered by ImageKit for optimized media
- **Email Notifications**: Automated booking confirmations
- **Search & Filters**: Advanced filtering options
- **Reviews & Ratings**: Customer feedback system
- **Availability Calendar**: Visual calendar showing car availability and booked dates
- **Interactive Date Selection**: Click-to-select dates on calendar for booking

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Razorpay** - Payment gateway
- **ImageKit** - Image optimization and storage
- **Nodemailer** - Email service

## 📁 Project Structure

```
Gear_Go/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── assets/        # Images, icons, and media files
│   │   ├── components/    # Reusable React components
│   │   ├── context/       # React context providers
│   │   ├── hooks/         # Custom React hooks
│   │   └── pages/         # Page components
│   ├── package.json       # Frontend dependencies
│   └── vite.config.js     # Vite configuration
├── server/                # Backend Node.js application
│   ├── configs/           # Database and service configurations
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── package.json      # Backend dependencies
│   └── server.js         # Entry point
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/snehakumawat72/Gear_Go.git
   cd Gear_Go
   ```

2. **Install dependencies**

   For the server:
   ```bash
   cd server
   npm install
   ```

   For the client:
   ```bash
   cd ../client
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   EMAIL_USER=your_email_address
   EMAIL_PASS=your_email_password
   ```

4. **Start the Development Servers**

   Start the backend server:
   ```bash
   cd server
   npm run server
   ```

   Start the frontend development server:
   ```bash
   cd client
   npm run dev
   ```

   The application will be available at:
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:5000`

## 📱 Usage

### For Customers
1. **Registration/Login**: Create an account or login with existing credentials
2. **Browse Rentals**: Explore available cars and gear
3. **Make Bookings**: Select dates and complete payment
4. **Manage Bookings**: View booking history and status

### For Owners
1. **Owner Registration**: Sign up as a rental owner
2. **Add Listings**: Upload cars and gear with details and images
3. **Manage Inventory**: Update availability and pricing
4. **Handle Bookings**: Accept/reject rental requests

## 🔧 Available Scripts

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)
- `npm run server` - Start development server with nodemon
- `npm start` - Start production server

## 🔑 Key Features Implementation

### Authentication System
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control (Customer/Owner)

### Payment Integration
- Razorpay payment gateway integration
- Secure payment processing
- Payment history tracking

### File Upload & Management
- ImageKit integration for optimized image storage
- Multer middleware for file handling
- Automatic image optimization and CDN delivery

### Database Design
- MongoDB with Mongoose ODM
- Efficient schema design for scalability
- Proper indexing for performance

## 🌐 Deployment

The project is configured for deployment on Vercel with the included `vercel.json` configuration files.

### Frontend Deployment
- Automatically deploys from the `client/` directory
- Build command: `npm run build`
- Output directory: `dist/`

### Backend Deployment
- Serverless functions deployment
- Environment variables configuration required
- MongoDB Atlas recommended for production database

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

- **Sneha Kumawat** - *Initial work* - [@snehakumawat72](https://github.com/snehakumawat72)

## 🙏 Acknowledgments

- React.js team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- Razorpay for payment gateway integration
- ImageKit for image optimization services
- MongoDB team for the excellent database solution

## 📞 Support

For support, email snehakumawat72@gmail.com or create an issue in the GitHub repository.

---

**Made with ❤️ by ME**
