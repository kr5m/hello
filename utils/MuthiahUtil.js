const fs = require('fs').promises; // it is important to have .promises to ensure that it runs without error due to async and await function
const path = require('path'); 

const RESOURCES_FILE = path.join('utils', 'studentDetails.json');//reading the studentDetails.json file
const TEMPLATE_FILE = path.join('utils', 'students.template.json');//reading the student.template.json file

async function updatestudent(req, res) {
    try {
        const { matriculationNumber, year, className, phoneNumber, courseID, houseAddress } = req.body; //retrievin all the fileds parsed by the backend 
        if (!matriculationNumber) { //if the matriculation number is empty it will show this error
            return res.status(400).json({ message: "Matriculation Number is required." })
        }
        let students = []; //creation of students dyanmic array
        try {
            const data = await fs.readFile(RESOURCES_FILE, 'utf8');//reading the studentDetails.json data file that was retrieved and ensuring that the encoding type is utf8
            students = JSON.parse(data);//parsing the retrieved data from the studentDetails.json file and storing it in the students dynamic data array
        } catch (err) {
            if (err.code === 'ENOENT') {
                // If studentDetails.json doesn't exist, create it from the template
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                students = JSON.parse(templateData);
                await fs.writeFile(RESOURCES_FILE, JSON.stringify(students, null, 2), 'utf8');
            } else {
                throw err;
            }
        }
        // this will find the students record in the students dynamic data array based on the matricualtion number
        const matixnumber = students.findIndex(student => student.matriculationNumber === matriculationNumber);
        if(matixnumber === -1){ //if there is no data retrieved then it will show this error message
            return res.status(404).json({message: "Student not found."});
        }
        //This code creates a new student object by copying the existing student data and only updating the fields that have new values entered from the front end
        //this block of code below will create a new student object and first copy existing the student data and then update all the values based on the values parsed from the front end
        const updatedStudent = { 
            ...students[matixnumber],
            ...(year && {year}),
            ...(className && {className}),
            ...(phoneNumber && {phoneNumber}),
            ...(courseID && {courseID}),
            ...(houseAddress && {houseAddress})
        };
        students[matixnumber] = updatedStudent;
        await fs.writeFile(RESOURCES_FILE,JSON.stringify(students,null,2),'utf8'); //will directly update the specific student data with the new values
        return res.status(200).json({
            message:`Student ${matriculationNumber} has been successfully updated`, //if update was successfull then this message will be shown
            student: updatedStudent //the updated data will be printed
        });
    } catch (error) { //this block of code runs when the whole code in this file fails execution
        console.error(error);
        return res.status(500).json({message: error.message});
    }
};

module.exports = {updatestudent};//exporting the function so that other files can invoke this function 