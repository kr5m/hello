function deleteStudent(matriculationNumber) {
    try {
        //Double confirming with the user before executing the delete function
        let confirmation = confirm("Are you sure you want to delete? This action cant be undone. Misuse of the action will be a severe offence. Please Confirm")
        if (confirmation) {
            //calling the delete-student api and passing in the matriculation number for deletion
            fetch('/delete-student', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({matriculationNumber:matriculationNumber})
            })
                .then(response => response.json())
                .then(data => {
                    alert("Students has been deleted.") //if the delete was successful it will return a success alert message
                    window.location.reload(); //once the student has been delete it will reload the whole page
                })
        } else {
            window.location.reload() //if the user decides to cancel the delete operation it will reload the page
        }
    }
    catch(err){
        console.error(err.message)
        return res.status(500).json({ message: err.message }); // it will show any erorr in the console
    }

}