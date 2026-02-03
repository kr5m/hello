function updateSearchfunction() {
    var matricsid = "";
    const searchbar = document.getElementById('searchbar').value.toUpperCase(); //ensures that the values return by the html page is capitalised by default
    const student = document.getElementById('studenttab');
    student.innerHTML = ''
    fetch('http://localhost:5050/get-student', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ matriculationNumber: searchbar })
    })
        .then(response => response.json())
        .then(data => {
            if (!data.student) {
                alert("Student Not found. Please enter the correct Matriculation Number");
                location.reload()
                return;
            }
            const row = data.student;//the student array in the data is being access(note: there are two arrays student and course returned by the server)
            const courserow = data.course
            fetch('/courses')
                .then(response => response.json())//converting the response from the backend from raw response to json response
                .then(courses => {
                    let options = '';
                    courses.forEach((course) => {
                        const selected = course.courseId === courserow.courseId ? 'selected' : '' //the current course id of the student will be retrieved and that specific option will be selected by default
                        options += `<option value="${course.courseId}" ${selected}>${course.courseId}: ${course.courseName}</option>`// for each course retrieved from the data base it will show as a new option
                    });
                    const studentdiv = document.createElement('div');//a new dynamic div tag is created for each row of data that is returned
                    matricsid = `${row.matriculationNumber}`;//the variable matrics id is assigned to the matriculation number of the student
                    studentdiv.id = `${row.matriculationNumber}`;//the id of the dynamic div tag is assigned to the matriculation number of the student
                    studentdiv.innerHTML = `
                            <div class="searchResult">
                                <div style="white-space:nowrap;">
                                    <h3>Student Name: ${row.name}</h3>
                                    <h3>Class: ${row.class}</h3>
                                    <h3>Current Year: ${row.year}</h3>
                                    <h3>Diploma Course: ${courserow.courseName}</h3>
                                    <h3>School: ${courserow.school}</h3>
                                </div>
                                <div style="margin-left: 30%;">
                                    <div style="margin-left: 30%;">
                                        <button type="button" onclick="popup()" style="width:150px;border-radius: 10px;background-color: #bfa053;border: none;padding: 10px;font-weight: bold;">Update Student Details</button>    
                                    </div>
                                    <br>
                                    <div style="margin-left: 30%;">
                                        <button type="button" onclick="deleteStudent('${row.matriculationNumber}')" style="width:150px;border-radius: 10px;background-color: #bfa053;border: none;padding: 10px;font-weight: bold;">Delete Student</button>    
                                    </div>
                                </div>
                            </div>
                            <div id="popupdiv">
                                <div class="popupsmalldiv">
                                    <div style="position: relative;">
                                        <hr>
                                        <center>
                                            <h2 style="text-decoration: underline;">Update Student Particulars</h2>
                                        </center>
                                        <button onclick="closepopup()" class="closeButton">&times;</button>
                                        <hr style="margin-bottom: 10px;">
                                    </div>
                                <form>
                                    <p><span class="popupform">Student Name : </span>${row.name}</p>
                                    <p><span class="popupform">Matriculation Number : </span>${row.matriculationNumber}</p>
                                    <p><span class="popupform">Year : </span><input type="number" value='${row.year}' id="year" max="3" min="1"></p>
                                    <p><span class="popupform">Phone Number : </span> +65 <input type="tel" value='${row.phoneNumber}' id="phoneNumber"></p>
                                    <p><span class="popupform">Diploma Course : </span>
                                    <select id="diplomaCourse">
                                        ${options}
                                    </select>
                                    </p>
                                    <p><span style="font-size: large;">Class : </span><input type="text" value="${row.class}" id="class"></p>
                
                                    <br><br>
                                    <span style="font-size: large;">House Address : <br>${row.houseAddress}</span>
                                    <button type="button" onclick="editaddress()">Edit</button>
                                    <div style="height: 20px;"></div>
                                    <br>
                                    <div style="display: none;" id="newaddress">
                                        <span style="font-size: large;">New House Address Postal Code: </span><input type="text" id="newpostcode">
                                        <div style="height: 10px;"></div>
                                        <div id="addressResult"></div>
                                        <span style="font-size: large;">New Unit Number: </span><input type="text" id="unitNumbers">
                                        <button onclick="searchPostalCode()">Search</button>
                                        <div style="height: 10px;"></div>
                                        <span style="font-size: large;">New House Address: <div id="fulladdress"></div></span>
                                    </div>
                                    <center style="padding-top: 30px;"><button type="button" onclick="updateStudent('${row.matriculationNumber}',event)">Submit</button></center>
                                </form>
                            </div>
                        </div>
                    `
                    //styling for the dynamic div tag
                    studentdiv.style.display = 'flex';
                    studentdiv.style.alignItems = 'center';
                    studentdiv.style.justifySelf = 'center';
                    studentdiv.style.height = 'fit-content';
                    studentdiv.style.paddingRight = '40px'
                    studentdiv.style.width = '750px';
                    studentdiv.style.backgroundColor = '#061424';
                    studentdiv.style.color = "white"
                    studentdiv.style.paddingTop = '5px';
                    studentdiv.style.paddingBottom = '5px';
                    studentdiv.style.paddingLeft = '20px';
                    studentdiv.style.borderRadius = '20px';
                    // all the styling and the elements in the dynamic div tag will be appended into the main student div tag(this tag will allow the data to appear)
                    student.appendChild(studentdiv);
                },
                )
        })
};