const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join('utils','courses.json');
const DB_TEMPLATE_FILE = path.join('utils','courses.template.json');
async function deleteCourse(req, res) {
    try {
        const {courseId} = req.body;

        if (!courseId) {
            return res
                .status(400)
                .json({ success: false, message: "course Id is required" });
        }

        let courses = [];
        try {
            const data = await fs.readFile(DB_FILE, "utf8");
            courses = data.trim() ? JSON.parse(data) : [];
        } catch (err) {
            if (err.code === "ENOENT") {
                try {
                    const templateData = await fs.readFile(DB_FILE, "utf8");
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

        const deleted = courses.splice(index, 1)[0];
        await fs.writeFile(DB_FILE, JSON.stringify(courses, null, 2), "utf8");

        return res.status(200).json({
            success: true,
            message: "Course deleted",
            data: deleted,
        });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Server error" });
    }
}
module.exports = {deleteCourse}
