document.addEventListener("DOMContentLoaded", () => {
    const courseName = document.getElementById("courseName");
    const courseCategory = document.getElementById("courseCategory");
    const coursePrice = document.getElementById("coursePrice");
    const courseDescription = document.getElementById("courseDescription");
    const courseCapacity = document.getElementById("courseCapacity");
    const clickButton = document.getElementById("click");
    const searchInput = document.getElementById("search");
    const dataTable = document.getElementById("data");
    const deleteBtn = document.getElementById("deleteBtn");

    let courses = JSON.parse(localStorage.getItem("courses")) || [];

    // Add course
    clickButton.addEventListener("click", (e) => {
        e.preventDefault();

        // Validation
        if (!validateInputs()) return;

        const course = {
            id: Date.now(),
            name: courseName.value.trim(),
            category: courseCategory.value.trim(),
            price: parseFloat(coursePrice.value.trim()),
            description: courseDescription.value.trim(),
            capacity: parseInt(courseCapacity.value.trim())
        };

        courses.push(course);
        localStorage.setItem("courses", JSON.stringify(courses));
        renderTable();
        clearForm();
        Swal.fire({
            icon: 'success',
            title: 'Course Added',
            text: 'Your course has been successfully added!',
        });
    });

    // Render table
    function renderTable() {
        dataTable.innerHTML = "";
        courses.forEach((course, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${course.name}</td>
                    <td>${course.category}</td>
                    <td>${course.price}</td>
                    <td>${course.description}</td>
                    <td>${course.capacity}</td>
                    <td><button class="btn btn-warning btn-sm" onclick="editCourse(${course.id})">Edit</button></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.id})">Delete</button></td>
                </tr>
            `;
            dataTable.insertAdjacentHTML("beforeend", row);
        });
    }

    // Edit course
    window.editCourse = (id) => {
        const course = courses.find((course) => course.id === id);
        if (!course) return;

        courseName.value = course.name;
        courseCategory.value = course.category;
        coursePrice.value = course.price;
        courseDescription.value = course.description;
        courseCapacity.value = course.capacity;

        deleteCourse(id);
    };

    // Delete course
    window.deleteCourse = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This will permanently delete the course.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                courses = courses.filter((course) => course.id !== id);
                localStorage.setItem("courses", JSON.stringify(courses));
                renderTable();
                Swal.fire('Deleted!', 'Course has been deleted.', 'success');
            }
        });
    };

    // Delete all courses
    deleteBtn.addEventListener("click", () => {
        if (courses.length > 0) {
            Swal.fire({
                title: 'Are you sure?',
                text: 'This will delete all courses!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete all!',
                cancelButtonText: 'Cancel',
            }).then((result) => {
                if (result.isConfirmed) {
                    courses = [];
                    localStorage.setItem("courses", JSON.stringify(courses));
                    renderTable();
                    Swal.fire('Deleted!', 'All courses have been deleted.', 'success');
                }
            });
        } else {
            Swal.fire({
                icon: 'info',
                title: 'No Courses',
                text: 'There are no courses to delete.',
            });
        }
    });

    // Search functionality
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filteredCourses = courses.filter((course) =>
            course.name.toLowerCase().includes(query) ||
            course.category.toLowerCase().includes(query) ||
            course.description.toLowerCase().includes(query)
        );

        renderFilteredTable(filteredCourses);
    });

    function renderFilteredTable(filteredCourses) {
        dataTable.innerHTML = "";
        filteredCourses.forEach((course, index) => {
            const row = `
                <tr>
                    <td>${index + 1}</td>
                    <td>${course.name}</td>
                    <td>${course.category}</td>
                    <td>${course.price}</td>
                    <td>${course.description}</td>
                    <td>${course.capacity}</td>
                    <td><button class="btn btn-warning btn-sm" onclick="editCourse(${course.id})">Edit</button></td>
                    <td><button class="btn btn-danger btn-sm" onclick="deleteCourse(${course.id})">Delete</button></td>
                </tr>
            `;
            dataTable.insertAdjacentHTML("beforeend", row);
        });
    }

    // Validation function
    function validateInputs() {
        return (
            courseName.value.trim().length >= 3 &&
            courseCategory.value.trim().length >= 3 &&
            !isNaN(coursePrice.value) &&
            coursePrice.value > 0 &&
            courseDescription.value.trim().length >= 10 &&
            !isNaN(courseCapacity.value) &&
            courseCapacity.value > 0
        );
    }

    // Clear form
    function clearForm() {
        courseName.value = "";
        courseCategory.value = "";
        coursePrice.value = "";
        courseDescription.value = "";
        courseCapacity.value = "";
    }

    // Initial render
    renderTable();
});
