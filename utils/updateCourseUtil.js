const fs = require('fs').promises; // it is important to have .promises to ensure that it runs without error due to async and await function
const path = require('path');

const DB_FILE = path.join('utils','courses.json');
const TEMPLATE_FILE = path.join('utils','courses.template.json');
async function updateCourse(req, res) {
    try {
        const { courseId, courseName, courseDesc, school } = req.body;

        if (!courseId) {
            return res
                .status(400)
                .json({ success: false, message: "courseId is required." });
        }

        let courses = [];
        try {
            const data = await fs.readFile(DB_FILE, "utf8");
            courses = data.trim() ? JSON.parse(data) : [];
        } catch (err) {
            if (err.code === "ENOENT") {
                try {
                    const templateData = await fs.readFile(TEMPLATE_FILE, "utf8");
                    courses = templateData.trim() ? JSON.parse(templateData) : [];
                } catch {
                    courses = [];
                }
                await fs.writeFile(DB_FILE, JSON.stringify(courses, null, 2), "utf8");
            } else {
                throw err;
            }
        }

        const index = courses.findIndex(
            (c) => c.courseId === courseId
        );

        if (index === -1) {
            return res
                .status(404)
                .json({ success: false, message: "Course not found" });
        }

        // only update fields that are provided
        if (courseName !== undefined) {
            courses[index].courseName = courseName;
        }
        if (courseDesc !== undefined) {
            courses[index].courseDesc = courseDesc;
        }
        if (school !== undefined) {
            courses[index].school = school;
        }

        await fs.writeFile(DB_FILE, JSON.stringify(courses, null, 2), "utf8");

        return res.status(200).json({
            success: true,
            message: "Course updated",
            data: courses[index],
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Server error" });
    }
}
module.exports = {updateCourse};
