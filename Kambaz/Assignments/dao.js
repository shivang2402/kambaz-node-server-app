import Database from "../Database/index.js";
import { v4 as uuidv4 } from 'uuid';

export function findAllAssignments() {
  return Database.assignments;
}

export function findAssignmentsForCourse(courseId) {
  const { assignments } = Database;
  // console.log("hello");

  const courseAssignments = assignments.filter((assignment) =>
    assignment.course === courseId
  
  );
  return courseAssignments;
}

export function createAssignment(assignment) {
  const newAssignment = { ...assignment, _id: uuidv4() };
  Database.assignments = [...Database.assignments, newAssignment];
  return newAssignment;
}

export function deleteAssignment(assignmentId) {
  const { assignments } = Database;
  Database.assignments = assignments.filter((assignment) => assignment._id !== assignmentId);
}

export function updateAssignment(assignmentId, assignmentUpdates) {
  const { assignments } = Database;
  const assignment = assignments.find((a) => a._id === assignmentId);
  
  if (!assignment) {
    // You can throw an error, return null, or return a status object
    throw new Error(`Assignment with ID ${assignmentId} not found`);
  }

  Object.assign(assignment, assignmentUpdates);
  return assignment;
}
