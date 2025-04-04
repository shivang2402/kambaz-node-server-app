

import * as dao from "./dao.js";
import * as courseDao from "../Courses/dao.js";
import * as enrollmentsDao from "../Enrollments/dao.js";

export default function UserRoutes(app) {
  // Create a new user
  const createUser = (req, res) => {
    const newUser = dao.createUser(req.body);
    res.json(newUser);
  };

  // Delete user by ID
  const deleteUser = (req, res) => {
    const status = dao.deleteUser(req.params.userId);
    res.json(status);
  };

  // Return all users
  const findAllUsers = (req, res) => {
    const users = dao.findAllUsers();
    res.json(users);
  };

  // Return user by ID
  const findUserById = (req, res) => {
    const user = dao.findUserById(req.params.userId);
    res.json(user);
  };

  // Update user and sync session
  const updateUser = (req, res) => {
    const userId = req.params.userId;
    const userUpdates = req.body;
    dao.updateUser(userId, userUpdates);
    const currentUser = dao.findUserById(userId);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  // Signup: prevent duplicate usernames and store session
  const signup = (req, res) => {
    const existingUser = dao.findUserByUsername(req.body.username);
    if (existingUser) {
      res.status(400).json({ message: "Username already in use" });
      return;
    }
    const currentUser = dao.createUser(req.body);
    req.session["currentUser"] = currentUser;
    res.json(currentUser);
  };

  // Signin: validate credentials and store session
  const signin = (req, res) => {
    const { username, password } = req.body;
    const currentUser = dao.findUserByCredentials(username, password);
    if (currentUser) {
      req.session["currentUser"] = currentUser;
      res.json(currentUser);
    } else {
      res.status(401).json({ message: "Unable to login. Try again later." });
    }
  };

  // Signout: destroy session
  const signout = (req, res) => {
    req.session.destroy();
    res.sendStatus(200);
  };

  // Updated Profile: return current user or null (200 OK)
  const profile = (req, res) => {
    const currentUser = req.session["currentUser"];
    res.status(200).json(currentUser || null);
  };

  const findCoursesForEnrolledUser = (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    const courses = courseDao.findCoursesForEnrolledUser(userId);
    res.json(courses);
  };

  const createCourse = (req, res) => {
    const currentUser = req.session["currentUser"];

    if (!currentUser) {
      console.error("⚠️ No user in session! Cannot create course.");
      return res.status(401).json({ message: "Not logged in" });
    }

    const newCourse = courseDao.createCourse(req.body);
    enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
    res.json(newCourse);
  };

  const deleteCourseForCurrentUser = (req, res) => {
    const currentUser = req.session["currentUser"];
    if (!currentUser) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const { courseId } = req.params;
    courseDao.deleteCourse(courseId);
    res.sendStatus(204);
  };


  const findAllCourses = (req, res) => {
    const allCourses = courseDao.findAllCourses();
    res.json(allCourses);
  };
  
  app.get("/api/courses", findAllCourses);
  

  app.post("/api/users", createUser);
  app.get("/api/users", findAllUsers);
  app.get("/api/users/:userId", findUserById);
  app.put("/api/users/:userId", updateUser);
  app.delete("/api/users/:userId", deleteUser);
  app.post("/api/users/signup", signup);
  app.post("/api/users/signin", signin);
  app.post("/api/users/signout", signout);
  app.post("/api/users/profile", profile);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);

  app.post("/api/users/current/courses", createCourse);
  app.delete("/api/users/current/courses/:courseId", deleteCourseForCurrentUser);
}
