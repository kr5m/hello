function addStudent() {
    var response = "";
    // Create an object to hold form data
    var jsonData = new Object();
    jsonData.name = document.getElementById("name").value;
    jsonData.matriculationNumber = document.getElementById("matriculationNumber").value.toUpperCase().trim();
    jsonData.courseID = document.getElementById("courseID").value;
    jsonData.houseAddress = document.getElementById("houseAddress").value;
    jsonData.phoneNumber = document.getElementById("phoneNumber").value;
    jsonData.email = document.getElementById("email").value;
    jsonData.year = document.getElementById("year").value;
    jsonData.className = document.getElementById("className").value;
    // Validate required fields (all must be filled in)
    if (jsonData.name == "" || jsonData.matriculationNumber == "" || jsonData.courseID == "" || jsonData.houseAddress == "" || jsonData.phoneNumber == "" || jsonData.email == "" || jsonData.year == "" || jsonData.className == "") {
        alert('All fields are required!');
        return; // Stop execution if validation fails
    }
    // Configure the request to POST data to /create-student
    var request = new XMLHttpRequest();
    request.open("POST", "/add-student", true);
    request.setRequestHeader('Content-Type', 'application/json');
    // Define what happens when the server responds
    request.onload = function () {
        response = JSON.parse(request.responseText); // Parse JSON response
        console.log(response)
        // If no error message is returned it means its success
        if (response.message == undefined) {
            alert('Added Student: ' + jsonData.name + '!');
            // Clear form fields after success
            document.getElementById("name").value = "";
            document.getElementById("matriculationNumber").value = "";
            document.getElementById("courseID").value = "";
            document.getElementById("houseAddress").value = "";
            document.getElementById("phoneNumber").value = "";
            document.getElementById("email").value = "";
            document.getElementById("year").value = "";
            document.getElementById("className").value = "";
            // Close modal
            $('#studentModal').modal('hide');
            // Reload table content
            viewResources();
        } else {
            // Show error if student could not be added
            alert('Unable to add student!');
        }
    };
    // Send the request with JSON-formatted data
    request.send(JSON.stringify(jsonData));
}