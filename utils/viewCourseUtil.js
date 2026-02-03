const fs = require("fs").promises;
const { Course } = require("../models/Course");

const DB_FILE = __dirname + "/courses.json";
const TEMPLATE_FILE = __dirname + "/courses.template.json";

async function getCourses(req, res) {
    try {
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

        return res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ success: false, message: error.message || "Server error" });
    }
}

module.exports = { getCourses };