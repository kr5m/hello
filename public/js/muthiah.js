function updateStudent(matrix,event){
    event.preventDefault();
    const year = document.getElementById('year').value; //value from the input box with the id year is retrieved
    const phoneNumber = document.getElementById("phoneNumber").value;//value from the input box with the id phoneNumber is retrieved
    const diplomaCourse = document.getElementById("diplomaCourse").value;//value from the input box with the id diplomaCourse is retrieved
    const className = document.getElementById("class").value;//value from the input box with the id class is retrieved
    const address = document.getElementById('fulladdress').innerText;//value from the input box with the id fulladdress is retrieved

    fetch('/updatestudent',{ // this will call the updatestudent api and will pass in the following values listed
        method: 'PUT',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({matriculationNumber:matrix,phoneNumber:phoneNumber, courseID:diplomaCourse, houseAddress:address, year:year, className:className})
    })
    .then(response => response.json())//converting the response from the backend from raw response to json response
    .then(data => {//accessing the data returned by the api
        alert("Students details have been updated.") // if the message returned by the api states that operation was successful then this alret will be shown
        console.log(data);
        window.location.reload(); //it will then reload the page
    })
    .catch(err => {
        alert("Failed to update student details."); //will show if the function has failed
        console.error(err);
    })
}

