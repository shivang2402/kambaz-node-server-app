import * as dao from "./dao.js";

export default function AssignmentsRoutes(app) {
  app.delete("/api/assignments/:assignmentId", (req, res) => {
    const { courseId, assignmentId } = req.params;
    const status = dao.deleteAssignment(assignmentId);
    res.send(status);
    // console.log("hello 3");
    
  });
  
  app.put("/api/assignments/:assignmentId", (req, res) => {
    const { assignmentId } = req.params;
    const assignmentUpdates = req.body;
    const status = dao.updateAssignment(assignmentId, assignmentUpdates);
    res.send(status);
  });
}