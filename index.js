//importing the relevant modules
var express = require('express'); //enables front end and back end communication
var bodyParser = require("body-parser"); //it helps express to understand the data that is being sent from the front end to the backend
var cors = require("cors")
var app = express(); //creates an express application and stores it in the variable 'app'
const PORT = process.env.PORT || 5050;
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true })); // allows the frontend to parse nested objects in form data
app.use(bodyParser.json()); //extracts the data from the JSON Payload and put req.body in front for the backend to access the values


//to allow the express node module to access the public folder so that normal user can access the files in the public folder
app.use(express.static("./public"));
/*istanbul ignore next*/
// ---------- HOME PAGE ----------
var startPage = "index.html";
/*istanbul ignore next*/
app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
})
/*istanbul ignore next*/
// --------- Retrieval of data files for TESTING --------
app.get('/students', (req, res) => {
    res.sendFile(__dirname + "/utils/studentDetails.json");
})
/*istanbul ignore next*/
app.get('/courses', (req, res) => {
    res.sendFile(__dirname + "/utils/courses.json");
})


// ---------- Importing of Student backend files from utils folder ----------
const { addStudent } = require('./utils/LanceGohUtil.js'); //this file stores the main backend logic to add new student to the datafile
const { getStudent } = require('./utils/Muthiah--GetStudentUtil.js'); //this file stores the main backend logic to get student details
const { updatestudent } = require('./utils/MuthiahUtil.js'); //this file stores the main backend logic to update student details
const { deleteStudent } = require('./utils/deleteStudentUtil.js') // this file stores the main backend logic to delete a student's record from the data file

// ---------- Creating of API Calles for carrying out Student CRUD Operations ----------
/* These line will bind the API with the backend function so that 
when the API is called the server will call this function*/

//Adding New Student
app.post('/add-student', addStudent);
//Getting Student Records
app.post('/get-student', getStudent);
//Updating Of Student Records
app.put('/updatestudent', updatestudent);
//Deleting of specific student record
app.delete('/delete-student', deleteStudent)


// ---------- COURSE ROUTES (FIXED) ----------
const { getCourses } = require("./utils/viewCourseUtil.js");     // file where getCourses lives
const { addCourse } = require("./utils/BingHongUtil.js");
const { updateCourse } = require('./utils/updateCourseUtil.js')
const { deleteCourse } = require('./utils/deleteCourseUtil.js')

// READ all courses
app.get("/courses", getCourses);

// CREATE new course
app.post("/add-course", addCourse);

// UPDATE existing course
app.put('/update-course', updateCourse);
//app.put("/courses/:courseId", updateCourse);

// DELETE existing course
app.delete('/delete-course', deleteCourse)
//app.delete("/courses/:courseId", deleteCourse);


// index.js
const server = app.listen(PORT, function () {
    const address = server.address(); // 'server' must be assigned before this runs
    const baseUrl = `http://localhost:${address.port}`;
    console.log(`Project URL: ${baseUrl}`);
});

// IMPORTANT: Ensure you export both for your tests to work
module.exports = { app, server };
