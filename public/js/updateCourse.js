function updateCourse(courseId) {
    try {
        if (confirm("Are you sure you want to update this course details?")) {
            const courseNameInput = document.getElementById(`name-${courseId}`);
            const courseDescInput = document.getElementById(`desc-${courseId}`);
            const schoolSelect = document.getElementById(`school-${courseId}`);

            if (!courseNameInput || !courseDescInput || !schoolSelect) {
                alert("Form elements not found!");
                return;
            }

            const courseName = courseNameInput.value;
            const courseDesc = courseDescInput.value;
            const school = schoolSelect.value;
            fetch('/update-course', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ courseId: courseId, courseName: courseName, courseDesc: courseDesc, school: school })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert("Course Details have been successfully updated.")
                        window.location.reload();
                    } else {
                        alert(`Update failed: ${data.message}`)
                    }
                })
        } else {
            window.location.reload()
        }
    } catch (err) {
        console.error(err)
    }
}