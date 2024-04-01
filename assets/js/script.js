// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;



// Todo: create a function to generate a unique task id
//adds 1 to each item creating the unique task for each input
function generateTaskId() {
    return nextId++;
}


// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = `
        <div class="task-card p-3" data-id="${task.id}">
            <h3>${task.title}</h3>
            <p>${task.description}</p>
            <p>Due Date: ${task.dueDate}</p>
            <button class="delete-btn">Delete</button>
        </div>
    `;
    return taskCard;
}


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

    // Loop through the task list
    taskList.forEach(function (task) {
        const taskCard = createTaskCard(task);
        $("#to-do").append(taskCard);
    });

    $(".task-card").draggable({
        containment: ".container",
        revert: "invalid",
        stack: ".task-card"
    });
}


// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault()

    // Retrieve task data from the form
    const title = $("#title").val()
    const description = $("#description").val()
    const dueDate = $("#dueDate").val()
    const id = generateTaskId()


    const newTask = {
        id: id,
        title: title,
        description: description,
        dueDate: dueDate
    };

    // Add the new task to the task list
    taskList.push(newTask);

    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList))
    localStorage.setItem("nextId", JSON.stringify(nextId))

    // Render the updated task list by creating the task card
    const taskCard = createTaskCard(newTask);
    $("#to-do").append(taskCard) 

    // Clear the forms
    $("#title").val("")
    $("#description").val("")
    $("#date").val("")
}


// Todo: create a function to handle deleting a task
function handleDeleteTask() {
    // Find the task card associated with the clicked delete button
    var taskCard = $(this).closest('.task-card')

    // Retrieve the task ID from the data-id attribute of the task card
    var taskId = taskCard.data('id')

    // Remove the task from the task list
    taskList = taskList.filter(function (task) {
        return task.id !== taskId;
    });

    // Update localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList))

    // Remove the task card from the DOM
    taskCard.remove()
}



// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const droppedTask = ui.draggable; // Get the dragged task card element
    const targetLane = $(this) // Get the droppable lane where the task is dropped

    // Append the dropped taskcard to the target lane
    droppedTask.appendTo(targetLane)

    // Adjust the dropped taskcard's position
    droppedTask.css({ top: 0, left: 0 })

    const newStatus = targetLane.attr("id")
    const taskId = droppedTask.data("id")

    // Update the task status in the task list
    const updatedTaskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });

    // Update the task list and nextId in localStorage
    localStorage.setItem("tasks", JSON.stringify(updatedTaskList));
}

// Function to make the lanes droppable
function makeLanesDroppable() {
    $(".lane").droppable({
        accept: ".task-card",
        tolerance: "pointer",
        drop: handleDrop
    });
}



// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
function checkDate() {
    const today = dayjs();

    // Loop through each task in the task list
    taskList.forEach(function (task) {
        const taskDueDate = dayjs(task.dueDate);

        // Select the task card with corresponding data-id and check the due date
        const taskCard = $(`.task-card[data-id="${task.id}"]`);

        // Check if the due date is today
        if (taskDueDate.isSame(today, 'day')) {
            taskCard.addClass("today")
        }
        // Check if the due date is in the past
        else if (taskDueDate.isBefore(today, 'day')) {
            taskCard.addClass("past").removeClass("today")
        }
        // Clear classes for future dates
        else {
            taskCard.removeClass("today past")
        }
    });
}

$(document).ready(function () {
    $("#submitBtn").click(function () {
        console.log("submit button clicked")
        $("formModal").modal("hide")
    })

     $(".btn-primary").click(handleAddTask)
    
    renderTaskList()

    $(document).on('click', '.delete-btn', handleDeleteTask)

    makeLanesDroppable()
    
    checkDate()
    
    $(".btn-primary").click(checkDate)

})
