// Handles adding a new course by sending form data to the server
function addCourse() {
    // Holds the parsed response from the server
    var response = "";

    // Build a JSON object from the form fields
    var jsonData = new Object();
    jsonData.courseId = document.getElementById("id").value.trim();      // Course ID input
    jsonData.courseName = document.getElementById("name").value.trim();  // Course Name input
    jsonData.courseDesc = document.getElementById("desc").value.trim();  // Course Description input (optional)
    jsonData.school = document.getElementById("school").value.trim();    // School input

    // Basic form validation: required fields must not be empty
    if (jsonData.courseId === "" || jsonData.courseName === "" || jsonData.school === "") {
        alert("Course ID, Course Name and School are required!");
        return; // Stop execution if required fields are missing
    }

    // Create a new AJAX request object
    var request = new XMLHttpRequest();
    // Configure the request: POST to the /add-course endpoint, async enabled
    request.open("POST", "/add-course", true);
    // Tell the server that we are sending JSON in the request body
    request.setRequestHeader("Content-Type", "application/json");

    // This function runs when the server responds
    request.onload = function () {
        try {
            // Attempt to parse the JSON response from the server
            response = JSON.parse(request.responseText);
        } catch (e) {
            // If parsing fails, show a generic error and stop
            alert("Unexpected server response.");
            return;
        }

        // Log the server response in the console for debugging
        console.log("Add Course response:", response);

        // If the server returns HTTP 201 and a success flag, treat as success
        if (request.status === 201 && response && response.success) {
            // Notify the user that the course was added successfully
            alert("Added Course: " + jsonData.courseName + "!");

            // Clear the form fields after a successful submission
            document.getElementById("id").value = "";
            document.getElementById("name").value = "";
            document.getElementById("desc").value = "";
            document.getElementById("school").value = "";

            // Optionally display a success message in a <span>/<div> with id="msg"
            var msg = document.getElementById("msg");
            if (msg) {
                msg.textContent = response.message || "Course added";
                msg.style.color = "green";
            }
        } else {
            // When the request fails, show the error message from the server (if any)
            var errMsg = (response && response.message) || "Unable to add course!";
            alert(errMsg);

            // Optionally display an error message in the "msg" element
            var msg = document.getElementById("msg");
            if (msg) {
                msg.textContent = errMsg;
                msg.style.color = "red";
            }
        }
    };

    // This function runs if there is a network error or the request cannot be completed
    request.onerror = function () {
        alert("Network or server error.");

        // Optionally show the error message in the "msg" element
        var msg = document.getElementById("msg");
        if (msg) {
            msg.textContent = "Network or server error.";
            msg.style.color = "red";
        }
    };

    // Convert the jsonData object to JSON string and send it to the server
    request.send(JSON.stringify(jsonData));
}

// Wait until the DOM is fully loaded before attaching event listeners
document.addEventListener("DOMContentLoaded", function () {
    // Get the form element by its id
    var form = document.getElementById("addCourseForm");
    if (!form) return; // If the form is not found, do nothing

    // Intercept the form submission to use our custom addCourse() function
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Prevent the browser from doing a full page reload
        addCourse();        // Call our function to handle the AJAX submission
    });
});
