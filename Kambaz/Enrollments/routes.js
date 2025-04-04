import db from "../Database/index.js";

let { users, courses, enrollments } = db;

export default function EnrollmentRoutes(app) {
  const enrollUser = (req, res) => { 
    let { userId , courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }
    // check if user is valid 
    const user = users.filter((user) => user._id === userId)[0];
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // check if course is valid 
    const course = courses.filter((course) => course._id === courseId)[0];
    if (!course) {
      res.status(404).send("Course not found");
      return
    }

    // check if the user is already enrolled, if enrolled return error 
    const enrollment = enrollments.filter((enrollment) => enrollment.user === userId && enrollment.course === courseId)[0];
    if (enrollment) {
      res.status(400).send("User already enrolled");
      return;
    }

    // otherwise enroll user
    enrollments.push({"_id": Math.random().toString(36).substr(2, 9), "user": userId, "course": courseId});
    res.status(200).send("User enrolled");
  };
  
  const unenrollUser = (req, res) => { 
    let { userId, courseId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    // Check if user exists
    const user = users.find((user) => user._id === userId);
    if (!user) {
      res.status(404).send("User not found");
      return;
    }

    // Check if course exists
    const course = courses.find((course) => course._id === courseId);
    if (!course) {
      res.status(404).send("Course not found");
      return;
    }

    // Find index of the enrollment
    const index = enrollments.findIndex((enrollment) => enrollment.user === userId && enrollment.course === courseId);
    if (index === -1) {
      res.status(404).send("No enrollment found");
      return;
    }

    // Remove the enrollment from the original array
    enrollments.splice(index, 1);
    res.status(200).send("User unenrolled");
  };

  app.post("/api/users/:userId/courses/:courseId/enroll", enrollUser);
  
  app.delete("/api/users/:userId/courses/:courseId/unenroll", unenrollUser);
}