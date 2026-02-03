function deleteCourse(courseid) {
    try {
        if(confirm("Are you sure you want to delete this course?")){ //Double confirming with user before triggering the delete operation
            // Calling the API and passing the data from the front end to the backend
            fetch('/delete-course', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ courseId: courseid })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(`Course ID: ${courseid} has been successfully deleted.`) // if the operation was successfull it will show this alert message
                    window.location.reload();
                } else {
                    alert(`Failed to delete Course ID: ${courseid} from the system as ${data.message}`) //if the operation was not successful it will show the error
                }
            })
        } else {
            // if the user decides to not confirm and press no the page will reload
            window.location.reload();
        }
    } catch (err) {
        console.error(err.message) //if the whole operation failed it will show the error message in the console
    }
}