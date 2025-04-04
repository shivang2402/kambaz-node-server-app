import express from "express"; 
import cors from "cors";
import session from "express-session";
import "dotenv/config"; 

import Hello from "./Hello.js";
import Lab5 from "./Lab5/index.js";
import UserRoutes from "./Kambaz/Users/routes.js";
import CourseRoutes from "./Kambaz/Courses/routes.js";
import ModuleRoutes from "./Kambaz/Modules/routes.js"; 
import AssignmentsRoutes from './Kambaz/Assignments/routes.js';
import EnrollmentRoutes from "./Kambaz/Enrollments/routes.js";



const app = express();

// // CORS config to support cookies and restrict to frontend
// app.use(cors({
//   credentials: true,
//   origin: process.env.NETLIFY_URL || "http://localhost:5173"
// }));


const allowedOrigins = [
  "http://localhost:5173",
  "https://kambaz-react-web.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin:", origin);

    // Accept if no origin (server-side, curl) or origin matches a known one
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
      callback(null, true);
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));



app.use(express.json()); 

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,         
    sameSite: "lax"        
  }
};

if (process.env.NODE_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.NODE_SERVER_DOMAIN,
  };
}

app.use(session(sessionOptions));


// Route registration
Hello(app);
Lab5(app);
UserRoutes(app);
CourseRoutes(app);
ModuleRoutes(app); 
AssignmentsRoutes(app);
EnrollmentRoutes(app)



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
