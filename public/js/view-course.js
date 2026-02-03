function viewCourses() {
    var response = "";

    var request = new XMLHttpRequest();
    request.open("GET", "/courses", true);

    request.onload = function () {
        try {
            response = JSON.parse(request.responseText);
        } catch (e) {
            alert("Unexpected server response.");
            console.error("Failed to parse /courses response:", e);
            return;
        }

        console.log("View Courses response:", response);

        if (request.status === 200) {
            renderCoursesTable(response || []);
            var msg = document.getElementById("viewMsg");
            if (msg) { msg.textContent = ""; }
        } else {
            var errMsg = "Unable to load courses!";
            alert(errMsg);
            var msg = document.getElementById("viewMsg");
            if (msg) { msg.textContent = errMsg; msg.style.color = "red"; }
        }
    };

    request.onerror = function () {
        alert("Network or server error.");
        var msg = document.getElementById("viewMsg");
        if (msg) { msg.textContent = "Network or server error."; msg.style.color = "red"; }
    };

    request.send();
}

function renderCoursesTable(courses) {
    var tableBody = document.getElementById("coursesTableBody");
    if (!tableBody) return;
    const container = document.getElementById('updateForm');
    container.innerHTML = ''
    tableBody.innerHTML = "";

    if (!courses || courses.length === 0) {
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.colSpan = 4;
        cell.textContent = "No courses found.";
        row.appendChild(cell);
        tableBody.appendChild(row);
        return;
    }

    courses.forEach(function (course) {
        var row = document.createElement("tr");

        var tdId = document.createElement("td");
        tdId.textContent = course.courseId || "";

        var tdName = document.createElement("td");
        tdName.textContent = course.courseName || "";

        var tdSchool = document.createElement("td");
        tdSchool.textContent = course.school || "N/A";

        var tdDesc = document.createElement("td");
        tdDesc.textContent = course.courseDesc || "";

        var tdActions = document.createElement("td");
        var updateBtn = document.createElement('button');
        updateBtn.textContent = "Update Course Details";
        updateBtn.style.color = 'white'
        updateBtn.style.fontWeight = 'bold'
        updateBtn.style.width = "100%"
        updateBtn.style.backgroundColor = '#4682b4'
        updateBtn.className = "updateBtn";
        updateBtn.onclick = function () {
            const popup = document.getElementById(`updateCoursePopup-${course.courseId}`);
            popup.style.display = 'flex';
        }
        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete Course";
        deleteBtn.className = "deleteBtn";
        deleteBtn.style.width = "100%"
        deleteBtn.style.color = 'white'
        deleteBtn.style.fontWeight = 'bold'
        deleteBtn.style.backgroundColor = '#4682b4'
        deleteBtn.onclick = function () {
            deleteCourse(course.courseId)
        }
        tdActions.appendChild(updateBtn);
        tdActions.appendChild(deleteBtn);

        row.appendChild(tdId);
        row.appendChild(tdName);
        row.appendChild(tdSchool);
        row.appendChild(tdDesc);
        row.appendChild(tdActions);

        tableBody.appendChild(row);
    });
    courses.forEach(courses => {
        const popup = document.createElement('div');
        popup.id = `updateCoursePopup-${courses.courseId}`
        popup.style.display = "none"
        popup.className = "popup-overlay"
        popup.innerHTML = `
        <div class="card p-4 shadow-sm">
            <div style="display:flex;justify-content:space-between;">
                <h4>Update Course Details</h4>
                <button onclick="document.getElementById('updateCoursePopup-${courses.courseId}').style.display = 'none'">&times</button>
            </div>
            <hr>
            <form>
            


                <div class="form-group">
                    <label for="id">Course ID</label>
                    <input type="text" id="id" class="form-control" value="${courses.courseId}" disabled />
                </div>

                <div class="form-group">
                    <label for="name">Course Name</label>
                    <input type="text" id="name-${courses.courseId}" class="form-control" value="${courses.courseName}"/>
                </div>

                <div class="form-group">
                    <label for="desc">Description</label>
                    <textarea id="desc-${courses.courseId}" class="form-control">${courses.courseDesc}</textarea>
                </div>

                <div class="form-group">
                    <label for="school">School</label>
                    <select id="school-${courses.courseId}" class="form-control">
                        <option value="School Of Design">School Of Design</option>
                        <option value="School Of Business">School Of Business</option>
                        <option value="School Of Engineering">School Of Engineering</option>
                        <option value="School Of Applied Sciences">School Of Applied Sciences</option>
                        <option value="School of Informatics & IT">School Of Informatics And IT</option>
                        <option value="School Of Humanities And Social Sciences">School Of Humanities And Social Sciences</option>
                    </select>

                </div>

                <button type="button" class="btn btn-primary btn-block" onclick="updateCourse('${courses.courseId}')">Update Course</button>
            </form>

            <p id="msg" class="text-center mt-3 font-weight-bold"></p>
        </div>
    </div>
    `
        container.appendChild(popup)
        const select = popup.querySelector(`#school-${courses.courseId}`);
        select.value = courses.school;
        
    })

}


document.addEventListener("DOMContentLoaded", function () {
    viewCourses();
});

