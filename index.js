// -------------------- Imports --------------------
const express = require('express');
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 5050;

// -------------------- Middleware --------------------
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files safely (Windows/Jenkins compatible)
app.use(express.static(path.join(__dirname, "public")));

// ⚠️ IMPORTANT: Disable status monitor during tests
if (process.env.NODE_ENV !== 'test') {
    const statusMonitor = require('express-status-monitor');
    app.use(statusMonitor());
}

// -------------------- Home Page --------------------
/*istanbul ignore next*/
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// -------------------- Testing Data Routes --------------------
/*istanbul ignore next*/
app.get('/students', (req, res) => {
    res.sendFile(path.join(__dirname, "utils", "studentDetails.json"));
});

/*istanbul ignore next*/
app.get('/courses', (req, res) => {
    res.sendFile(path.join(__dirname, "utils", "courses.json"));
});

// -------------------- Student Routes --------------------
const { addStudent } = require('./utils/LanceGohUtil.js');
const { getStudent } = require('./utils/Muthiah--GetStudentUtil.js');
const { updatestudent } = require('./utils/MuthiahUtil.js');
const { deleteStudent } = require('./utils/deleteStudentUtil.js');

app.post('/add-student', addStudent);
app.post('/get-student', getStudent);
app.put('/updatestudent', updatestudent);
app.delete('/delete-student', deleteStudent);

// -------------------- Course Routes --------------------
const { getCourses } = require("./utils/viewCourseUtil.js");
const { addCourse } = require("./utils/BingHongUtil.js");
const { updateCourse } = require('./utils/updateCourseUtil.js');
const { deleteCourse } = require('./utils/deleteCourseUtil.js');

app.get("/courses", getCourses);
app.post("/add-course", addCourse);
app.put('/update-course', updateCourse);
app.delete('/delete-course', deleteCourse);

// -------------------- Server Startup --------------------
if (require.main === module) {
    const server = app.listen(PORT, () => {
        const address = server.address();
        const port = address ? address.port : PORT;
        const baseUrl = `http://localhost:${port}`;

        console.log(`Project URL: ${baseUrl}`);
        logger.info(`Demo project at: ${baseUrl}`);
    });
}

// -------------------- Export ONLY app --------------------
module.exports = { app };
