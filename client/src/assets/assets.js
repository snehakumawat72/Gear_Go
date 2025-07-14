import logo from "./logo.png";
import gmail_logo from "./gmail_logo.svg";
import facebook_logo from "./facebook_logo.svg";
import instagram_logo from "./instagram_logo.svg";
import twitter_logo from "./twitter_logo.svg";
import menu_icon from "./menu_icon.svg";
import search_icon from "./search_icon.svg"
import close_icon from "./close_icon.svg"
import users_icon from "./users_icon.svg"
import car_icon from "./car_icon.svg"
import location_icon from "./location_icon.svg"
import fuel_icon from "./fuel_icon.svg"
import addIcon from "./addIcon.svg"
import carIcon from "./carIcon.svg"
import carIconColored from "./carIconColored.svg"
import dashboardIcon from "./dashboardIcon.svg"
import dashboardIconColored from "./dashboardIconColored.svg"
import addIconColored from "./addIconColored.svg"
import listIcon from "./listIcon.svg"
import listIconColored from "./listIconColored.svg"
import cautionIconColored from "./cautionIconColored.svg"
import arrow_icon from "./arrow_icon.svg"
import star_icon from "./star_icon.svg"
import check_icon from "./check_icon.svg"
import tick_icon from "./tick_icon.svg"
import delete_icon from "./delete_icon.svg"
import eye_icon from "./eye_icon.svg"
import eye_close_icon from "./eye_close_icon.svg"
import filter_icon from "./filter_icon.svg"
import edit_icon from "./edit_icon.svg"
import calendar_icon_colored from "./calendar_icon_colored.svg"
import location_icon_colored from "./location_icon_colored.svg"
import testimonial_image_1 from "./testimonial_image_1.png"
import testimonial_image_2 from "./testimonial_image_2.png"
import main_car from "./main_car.jpg"
import banner_car_image from "./banner_car_image.png"
import user_profile from "./user_profile.png"
import upload_icon from "./upload_icon.svg"
import car_image1 from "./car_image1.png"
import car_image2 from "./car_image2.png"
import car_image3 from "./car_image3.png"
import car_image4 from "./car_image4.png"
import transport from "./transport.png"
import insert from "./insert.png"
import backpack from "./backpack.png"
import gear_icon from "./gear_icon.png"
import gear_tent from "./gear_tent.png"
import gear_sleeping_bag from "./gear_sleeping_bag.png"
import gear_camping_kit from "./gear_camping_kit.png"


export const cityList = ['Delhi', 'Mumbai', 'Indore', 'Goa',  'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Jaipur']

export const assets = {
    logo,
    gmail_logo,
    facebook_logo,
    instagram_logo,
    twitter_logo,
    menu_icon,
    search_icon,
    close_icon,
    users_icon,
    edit_icon,
    car_icon,
    location_icon,
    fuel_icon,
    addIcon,
    carIcon,
    carIconColored,
    dashboardIcon,
    dashboardIconColored,
    addIconColored,
    listIcon,
    listIconColored,
    cautionIconColored,
    calendar_icon_colored,
    location_icon_colored,
    arrow_icon,
    star_icon,
    check_icon,
    tick_icon,
    delete_icon,
    eye_icon,
    eye_close_icon,
    filter_icon,
    testimonial_image_1,
    testimonial_image_2,
    main_car,
    banner_car_image,
    car_image1,
    upload_icon,
    user_profile,
    car_image2,
    car_image3,
    car_image4,
    insert,
    backpack,
    transport,
    gear_icon,
     gear_tent,
  gear_sleeping_bag,
  gear_camping_kit
}

export const menuLinks = [
  { name: "Home", path: "/" },
  { name: "Cars", path: "/cars" },
  { name: "Trip Gears", path: "/trip-gears" },
  { name: "My Bookings", path: "/my-bookings" },
];

export const ownerMenuLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardIcon, coloredIcon: dashboardIconColored },
    { name: "Add car", path: "/owner/add-car", icon: addIcon, coloredIcon: addIconColored },
    { name: "Manage Cars", path: "/owner/manage-cars", icon: carIcon, coloredIcon: carIconColored },
     { name: "List Gear", path: "/owner/add-gear", icon: gear_icon, coloredIcon: gear_icon },
     { name: "Manage Bookings", path: "/owner/manage-bookings", icon: listIcon, coloredIcon: listIconColored },
]

export const dummyUserData = {
  "_id": "6847f7cab3d8daecdb517095",
  "name": "Sneha",
  "email": "admin@example.com",
  "role": "owner",
  "image": user_profile,
}

export const dummyCarData = [
    {
        "_id": "67ff5bc069c03d4e45f30b77",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Mahindra",
        "model": "Thar",
        "image": car_image1,
        "year": 2023,
        "category": "SUV",
        "seating_capacity": 4,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "pricePerDay": 2500,
        "location": "Mumbai",
        "description": "The Mahindra Thar is a rugged off-road SUV that's perfect for adventure trips. Known for its excellent ground clearance and 4WD capability.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T07:26:56.215Z",
    },
    {
        "_id": "67ff6b758f1b3684286a2a65",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Maruti Suzuki",
        "model": "Swift Dzire",
        "image": car_image2,
        "year": 2022,
        "category": "Sedan",
        "seating_capacity": 5,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "pricePerDay": 1200,
        "location": "Delhi",
        "description": "The Maruti Suzuki Swift Dzire is a compact sedan known for its fuel efficiency and comfortable ride. Perfect for city driving.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:33:57.993Z",
    },
    {
        "_id": "67ff6b9f8f1b3684286a2a68",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Hyundai",
        "model": "Creta",
        "image": car_image3,
        "year": 2024,
        "category": "SUV",
        "seating_capacity": 5,
        "fuel_type": "Petrol",
        "transmission": "Automatic",
        "pricePerDay": 2200,
        "location": "Bangalore",
        "description": "The Hyundai Creta is a popular compact SUV offering excellent features, comfort, and style. Ideal for both city and highway drives.",
        "isAvaliable": true,
        "createdAt": "2025-04-16T08:34:39.592Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e34",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Tata",
        "model": "Nexon",
        "image": car_image4,
        "year": 2023,
        "category": "SUV",
        "seating_capacity": 5,
        "fuel_type": "Electric",
        "transmission": "Automatic",
        "pricePerDay": 1800,
        "location": "Pune",
        "description": "The Tata Nexon EV is an electric compact SUV that offers zero emissions and modern features. Perfect for eco-conscious travelers.",
        "isAvaliable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e35",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Honda",
        "model": "City",
        "image": car_image1,
        "year": 2022,
        "category": "Sedan",
        "seating_capacity": 5,
        "fuel_type": "Petrol",
        "transmission": "CVT",
        "pricePerDay": 1500,
        "location": "Chennai",
        "description": "The Honda City is a premium sedan known for its spacious interior, smooth performance, and advanced safety features.",
        "isAvaliable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e36",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Kia",
        "model": "Seltos",
        "image": car_image2,
        "year": 2023,
        "category": "SUV",
        "seating_capacity": 5,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "pricePerDay": 2000,
        "location": "Hyderabad",
        "description": "The Kia Seltos is a feature-rich compact SUV with bold design and excellent connectivity options. Great for long drives.",
        "isAvaliable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e37",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Maruti Suzuki",
        "model": "Baleno",
        "image": car_image3,
        "year": 2023,
        "category": "Hatchback",
        "seating_capacity": 5,
        "fuel_type": "Petrol",
        "transmission": "Manual",
        "pricePerDay": 1000,
        "location": "Ahmedabad",
        "description": "The Maruti Suzuki Baleno is a premium hatchback offering excellent fuel economy and modern features. Perfect for city commuting.",
        "isAvaliable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    },
    {
        "_id": "68009c93a3f5fc6338ea7e38",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "brand": "Mahindra",
        "model": "Scorpio N",
        "image": car_image4,
        "year": 2024,
        "category": "SUV",
        "seating_capacity": 7,
        "fuel_type": "Diesel",
        "transmission": "Manual",
        "pricePerDay": 2800,
        "location": "Jaipur",
        "description": "The Mahindra Scorpio N is a powerful 7-seater SUV designed for both adventure and comfort. Ideal for family trips and off-road adventures.",
        "isAvaliable": true,
        "createdAt": "2025-04-17T06:15:47.318Z",
    }
];
export const dummyGearData = [
  {
    _id: "GEAR001",
    name: "Camping Tent",
    image: gear_tent,
    location: "Indore",
    pricePerDay: 50,
    description:
      "Spacious waterproof camping tent for 2-4 people. Ideal for weekend trips and mountain camps.",
    category: "Tent",
    isAvailable: true,
    createdAt: "2025-05-01T10:00:00.000Z",
    features: ["Waterproof", "UV Protection", "Easy Setup", "Lightweight"]
  },
  {
    _id: "GEAR002",
    name: "Sleeping Bag",
    image: gear_sleeping_bag,
    location: "Mumbai",
    pricePerDay: 20,
    description:
      "Warm and compact sleeping bag suitable for all seasons. Lightweight and durable.",
    category: "Sleeping Gear",
    isAvailable: true,
    createdAt: "2025-05-02T09:30:00.000Z",
    features: ["All-season use", "Compact Design", "Machine Washable", "Thermal Insulation"]
  },
  {
    _id: "GEAR003",
    name: "Camping Kit Combo",
    image: gear_camping_kit,
    location: "Delhi",
    pricePerDay: 75,
    description:
      "Complete camping combo with tent, mat, cooking stove, and tools. Perfect for beginners.",
    category: "Camping Kit",
    isAvailable: true,
    createdAt: "2025-05-03T08:45:00.000Z",
    features: ["Complete Set", "Multi-tool Included", "Easy to Pack", "Durable Build"]
  }
];

export const dummyMyBookingsData = [
    {
        "_id": "68482bcc98eb9722b7751f70",
        "car": dummyCarData[0],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2025-06-13T00:00:00.000Z",
        "returnDate": "2025-06-14T00:00:00.000Z",
        "status": "confirmed",
        "price": 440,
        "createdAt": "2025-06-10T12:57:48.244Z",
    },
    {
        "_id": "68482bb598eb9722b7751f60",
        "car": dummyCarData[1],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2025-06-12T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "pending",
        "price": 130,
        "createdAt": "2025-06-10T12:57:25.613Z",
    },
    {
        "_id": "684800fa0fb481c5cfd92e56",
        "car": dummyCarData[2],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "67fe3467ed8a8fe17d0ba6e2",
        "pickupDate": "2025-06-11T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "pending",
        "price": 600,
        "createdAt": "2025-06-10T09:55:06.379Z",
    },
    {
        "_id": "6847fe790fb481c5cfd92d94",
        "car": dummyCarData[3],
        "user": "6847f7cab3d8daecdb517095",
        "owner": "6847f7cab3d8daecdb517095",
        "pickupDate": "2025-06-11T00:00:00.000Z",
        "returnDate": "2025-06-12T00:00:00.000Z",
        "status": "confirmed",
        "price": 440,
        "createdAt": "2025-06-10T09:44:25.410Z",
    }
]

export const dummyDashboardData = {
    "totalCars": 4,
    "totalBookings": 2,
    "pendingBookings": 0,
    "completedBookings": 2,
    "recentBookings": [
        dummyMyBookingsData[0],
        dummyMyBookingsData[1]
    ],
    "monthlyRevenue": 840
}