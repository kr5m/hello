class Course {
    constructor(courseId, courseName, courseDesc) {
        this.courseId = String(courseId).trim();
        this.courseName = String(courseName).trim();
        this.courseDesc = (courseDesc || "").trim();
    }
}
module.exports = { Course };