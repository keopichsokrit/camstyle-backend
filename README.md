Project Overview: CamStyle E-commerce Backend
Goal: To build a secure, scalable, and cost-effective REST API for an Android mobile application using Node.js, Express, and MongoDB.

1. Core Technical Requirements
Backend Framework: Node.js with Express.

Database: MongoDB Atlas (NoSQL Cloud Database).

Image Storage: Cloudinary (For hosting product images).

Authentication: JWT (JSON Web Tokens) with Role-Based Access Control (User vs. Admin).

Note: Tokens are issued only upon Login, not Signup.

Architecture: Model-View-Controller (MVC) Monolith (Single-server deployment).

Deployment: Render (Free tier).

Frontend Integration: Designed specifically for a Flutter mobile application.

2. System Architecture (MVC Structure)
To ensure the project remains organized and scalable as more services are added, the project follows this directory structure.

MVC CamStyle project structure: 
``` bash
camstyle-backend/
├── src/
│   ├── config/             # Connection logic
│   │   ├── db.js           # MongoDB Atlas connection
│   │   └── cloudinary.js   # Cloudinary setup
│   ├── controllers/        # The "Brain" (Logic for each route)
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── categoryController.js   # Logic for CRUD (Create, Read, Update, Delete) categories
│   │   ├── cartController.js
│   │   └── paymentController.js
│   ├── middleware/         # Security & Rules
│   │   ├── authMiddleware.js  # JWT verification & Role checking
│   │   └── errorMiddleware.js # Handles API errors gracefully
│   ├── models/             # Database Blueprints (Schemas)
│   │   ├── User.js         # Roles: 'user' and 'admin'
│   │   ├── Product.js      # Includes Category
│   │   ├── Category.js     # Schema (Name, Image, Description)
│   │   └── Cart.js
│   ├── routes/             # API Endpoints definition
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── cartRoutes.js
│   │   └── paymentRoutes.js
│   └── utils/              # Small helper tools
│       └── generateToken.js # Logic to create JWT
├── .env                    # Hidden API Keys (DB_URI, CLOUDINARY_KEY, etc.)
├── .gitignore              # Tells Git to ignore node_modules and .env
├── package.json            # Dependencies and Scripts
└── server.js               # THE ONLY ENTRY POINT (Starts everything)
```
3. Essential DependenciesTo make this project work, you will need the following "Free to Use" packages:PackagePurposeexpressThe core web framework.mongooseTo interact with MongoDB Atlas.dotenvTo manage secret API keys and environment variables.jsonwebtokenTo handle secure authentication (JWT).bcryptjsTo hash and secure user passwords.cloudinaryTo upload and manage product images.multerMiddleware for handling image uploads.corsTo allow your Flutter app to communicate with the server.nodemon(Dev tool) Restarts the server automatically during coding.

4. Necessary command:
npm init -y
npm install express mongoose dotenv jsonwebtoken bcryptjs cloudinary multer cors
npm install --save-dev nodemon 