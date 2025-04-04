import * as dao from "./dao.js";
import * as modulesDao from "../Modules/dao.js"; 
import * as assignmentsDao from "../Assignments/dao.js";




// Defines routes related to courses
export default function CourseRoutes(app) {
  // GET all courses
  app.get("/api/courses", (req, res) => {
    const courses = dao.findAllCourses();
    res.send(courses);
  });

  app.delete("/api/courses/:courseId", (req, res) => { 
    const { courseId } = req.params; 
    dao.deleteCourse(courseId); 
    res.sendStatus(204); 
  }); 

  app.put("/api/courses/:courseId", (req, res) => { 
    const { courseId } = req.params; 
    const courseUpdates = req.body; 
    const status = dao.updateCourse(courseId, courseUpdates); 
    res.send(status); 
  }); 


  app.get("/api/courses/:courseId/modules", (req, res) => { 
    const { courseId } = req.params; 
    const modules = modulesDao.findModulesForCourse(courseId); 
    res.json(modules); 
  }); 

  app.post("/api/courses/:courseId/modules", async (req, res) => {
    try {
      const { courseId } = req.params;
  
      if (!req.body.name) {
        return res.status(400).send("Module name is required.");
      }
  
      const module = {
        ...req.body,
        course: courseId,
      };
  
      console.log("Creating module:", module);
  
      const newModule = await modulesDao.createModule(module);
      res.send(newModule);
    } catch (err) {
      console.error("Error creating module:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  app.get("/api/courses/:courseId/assignments", (req, res) => {
    const { courseId } = req.params;
    const courses = assignmentsDao.findAssignmentsForCourse(courseId);
    res.send(courses);
  });

app.post("/api/courses/:courseId/assignments", (req, res) => {
  const assignment = {
    ...req.body,
    course: req.params.courseId,
  };
  const newAssignment = assignmentsDao.createAssignment(assignment);
  // console.log("hello 2");
  
  res.send(newAssignment);
});
 
}
