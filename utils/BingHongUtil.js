// Use the Promise-based fs API for async file operations
const fs = require("fs").promises;
// Import the Course model (represents a single course object)
const { Course } = require("../models/Course");

// Path to the main "database" JSON file that stores courses
const DB_FILE = __dirname + "/courses.json";
// Path to a template JSON file used to initialize the database if it doesn't exist
const TEMPLATE_FILE = __dirname + "/courses.template.json";

// Express route handler to add a new course
async function addCourse(req, res) {
    try {
        // Safely extract fields from the request body
        const { courseId, courseName, courseDesc, school } = req.body || {};

        // Basic validation: required fields must be provided
        if (!courseId || !courseName || !school) {
            return res.status(400).json({
                success: false,
                message: "Course ID, Name and School are required"
            });
        }

        // Create a new Course instance from the request data
        const newCourse = new Course(courseId, courseName, courseDesc, school);

        // Will hold the list of existing courses
        let courses = [];
        try {
            // Try to read existing data from the main DB file
            const data = await fs.readFile(DB_FILE, "utf8");
            // If file is not empty, parse JSON; otherwise use an empty array
            courses = data.trim() ? JSON.parse(data) : [];
        } catch (err) {
            // If the DB file does not exist, try to initialize from template
            if (err.code === "ENOENT") {
                try {
                    // Read initial data from the template file, if available
                    const templateData = await fs.readFile(TEMPLATE_FILE, "utf8");
                    courses = templateData.trim() ? JSON.parse(templateData) : [];
                } catch {
                    // If template is also missing or invalid, start with an empty array
                    courses = [];
                }
                // Write the initial courses array to create the DB file
                await fs.writeFile(DB_FILE, JSON.stringify(courses, null, 2), "utf8");
            } else {
                // For any other error, rethrow and handle in the outer catch
                throw err;
            }
        }

        // Check for duplicate courseId (after trimming and string conversion)
        const exists = courses.find(
            (c) => String(c.courseId).trim() === String(newCourse.courseId).trim()
        );
        if (exists) {
            // If a course with the same ID already exists, return a 400 error
            return res.status(400).json({
                success: false,
                message: "Course with this courseId already exists"
            });
        }

        // Add the new course to the in-memory list
        courses.push(newCourse);
        // Persist the updated list back to the DB file
        await fs.writeFile(DB_FILE, JSON.stringify(courses, null, 2), "utf8");

        // Respond with 201 Created and include the updated courses list
        return res.status(201).json({
            success: true,
            message: "Course added",
            data: courses
        });
    } catch (error) {
        // Log any unexpected errors for debugging
        console.error(error);
        // Return a generic 500 Server Error response
        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
}

// Export the addCourse handler so it can be used in the route definitions
module.exports = { addCourse };
