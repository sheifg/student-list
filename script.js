// CRUD OPERATIONS WITH API EXAMPLE

const modal = document.getElementById('studentModal')
const form = document.getElementById('student-form')

const url = "https://cwbarry.pythonanywhere.com/student/";
let students;
const operation = {
    type: "Add",
    id: null
}



// Display the students
function displayStudents(data){
    const studentContainer = document.getElementById("student-container")
    const html = data.map( (student) => `  
    <li
              data-id="${student.id}"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              ${student.number} ${student.first_name} ${student.last_name}
              <div class="btn-group" role="group">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#studentModal"
                  type="button"
                  class="btn btn-warning"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <button type="button" class="btn btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
    </li>`)

    studentContainer.innerHTML = html.join("")
}

// Fetch the students from API and use displayStudents function

async function getData(){
    const response = await axios.get(url)
    students = response.data;
    displayStudents(students)
}


// when website started we automatically fetch the data and display it 
window.addEventListener("DOMContentLoaded", ()=>{
    getData()
})


// Modal form submit
form.addEventListener("submit",(event)=>{
    // prevent refreshing page
    event.preventDefault()

    // collect information from form inputs
    const first_name = document.getElementById("first-name").value;
    const last_name = document.getElementById("last-name").value;
    const number = document.getElementById("number").value;
    const path = document.getElementById("path").value;

    console.log(first_name,last_name,number,path)

    if( operation.type === "Add"){
        addStudent(first_name,last_name,number,path)
    }else{
        updateStudent(operation.id,first_name,last_name,number,path)
        // Reseting opeartion logic after updating the student.
        operation.id = null;
        operation.type = "Add";
    }

    // Close the modal window after button is clicked
    const modalBS = bootstrap.Modal.getInstance("#studentModal");
    modalBS.hide();



})

// CRUD OPERATIONS
// Add a student

async function addStudent(first_name,last_name,number,path){
    const response = await axios({
        method: "post",
        url: url,
        data: { first_name,last_name,number,path}
    })

    getData();
}

// Update a student

async function updateStudent(id, first_name, last_name,number,path){
    const response = await axios({
        method: "put",
        url: url + id + "/",
        data: { first_name,last_name,number,path}
    })

    getData();
}

// Delete a student

async function deleteStudent(id){
    const response = await axios({
        method: "delete",
        url: url + id + "/",
    })

    getData();
}

document.getElementById("student-container").addEventListener("click", (event)=>{

    // Delete button handling
    if( event.target.classList.contains("btn-danger") || event.target.classList.contains("bi-trash")){
        const id = event.target.closest("li").dataset.id;
        deleteStudent(id);
    }

    // Edit button handling
    // If update button is clicked then we will pass the data into form and set the form into edit mode
    if(event.target.classList.contains("btn-warning") || event.target.classList.contains("bi-pencil")){
        const id = event.target.closest("li").dataset.id;
        operation.id = id;
        operation.type = "Update";

        const student = students.find( (student)=> student.id === +id)

        document.getElementById("first-name").value = student.first_name;
        document.getElementById("last-name").value = student.last_name;
        document.getElementById("number").value = student.number;
        document.getElementById("path").value = student.path;

    }

})


// Modal changing for edit and add
// shown.bs.modal is a bootstrap event which is trigging when modal is opened
modal.addEventListener("shown.bs.modal",()=>{
        form.querySelector("button").textContent = operation.type;
        document.getElementById("studentModalLabel").textContent = `${operation.type} a Student` 
})

document.getElementById("add-student-btn").addEventListener("click",()=>{
    // Reseting opeartion logic after updating the student when clicked to create student button.
    operation.id = null;
    operation.type = "Add";
    form.reset()
})