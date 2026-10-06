const requestForm = document.getElementById("requestForm");

const requestId = document.getElementById("requestId");

const studentName = document.getElementById("studentName");

const email = document.getElementById("email");

const category = document.getElementById("category");

const description = document.getElementById("description");

const priority = document.getElementById("priority");

const submitButton = document.getElementById("submitButton");

const cancelButton = document.getElementById("cancelButton");

const formTitle = document.getElementById("formTitle");

const requestsContainer =
    document.getElementById("requestsContainer");


// ==========================================
// GET ALL REQUESTS
// ==========================================

async function loadRequests() {

    try {

        const response = await fetch("/api/requests");

        const requests = await response.json();

        displayRequests(requests);

    } catch (error) {

        console.error(error);

        requestsContainer.innerHTML =
            "<p>Unable to load requests.</p>";
    }
}


// ==========================================
// DISPLAY REQUESTS
// ==========================================

function displayRequests(requests) {

    if (requests.length === 0) {

        requestsContainer.innerHTML = `
            <div class="no-requests">
                No requests submitted yet.
            </div>
        `;

        return;
    }


    requestsContainer.innerHTML = "";


    requests.forEach(request => {

        const card = document.createElement("div");

        card.className = "request-card";


        card.innerHTML = `

            <h3>
                ${escapeHTML(request.category)}
            </h3>

            <p>
                <strong>ID:</strong>
                ${request.id}
            </p>

            <p>
                <strong>Student:</strong>
                ${escapeHTML(request.studentName)}
            </p>

            <p>
                <strong>Email:</strong>
                ${escapeHTML(request.email)}
            </p>

            <p>
                <strong>Description:</strong>
                ${escapeHTML(request.description)}
            </p>

            <p>
                <strong>Priority:</strong>
                <span class="priority ${escapeHTML(request.priority)}">
                    ${escapeHTML(request.priority)}
                </span>
            </p>

            <div class="card-buttons">

                <button
                    class="edit-btn"
                    onclick="editRequest(${request.id})"
                >
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteRequest(${request.id})"
                >
                    Delete
                </button>

            </div>
        `;


        requestsContainer.appendChild(card);

    });
}


// ==========================================
// SUBMIT / UPDATE REQUEST
// ==========================================

requestForm.addEventListener("submit", async function(event) {

    event.preventDefault();


    const requestData = {

        studentName: studentName.value.trim(),

        email: email.value.trim(),

        category: category.value,

        description: description.value.trim(),

        priority: priority.value

    };


    try {

        let response;


        // UPDATE
        if (requestId.value) {

            response = await fetch(
                `/api/requests/${requestId.value}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(requestData)
                }
            );

        }

        // CREATE
        else {

            response = await fetch(
                "/api/requests",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(requestData)
                }
            );

        }


        const result = await response.json();


        if (!response.ok) {

            alert(result.message || "Something went wrong.");

            return;
        }


        alert(result.message);


        resetForm();

        loadRequests();

    } catch (error) {

        console.error(error);

        alert("Server error. Please try again.");
    }

});


// ==========================================
// EDIT REQUEST
// ==========================================

async function editRequest(id) {

    try {

        const response =
            await fetch(`/api/requests/${id}`);

        const request = await response.json();


        if (!response.ok) {

            alert(request.message);

            return;
        }


        requestId.value = request.id;

        studentName.value = request.studentName;

        email.value = request.email;

        category.value = request.category;

        description.value = request.description;

        priority.value = request.priority;


        formTitle.textContent = "Update Request";

        submitButton.textContent = "Update Request";

        cancelButton.style.display = "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        console.error(error);

        alert("Unable to load request.");
    }
}


// ==========================================
// DELETE REQUEST
// ==========================================

async function deleteRequest(id) {

    const confirmed =
        confirm("Are you sure you want to delete this request?");


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(`/api/requests/${id}`, {
                method: "DELETE"
            });


        const result = await response.json();


        if (!response.ok) {

            alert(result.message);

            return;
        }


        alert(result.message);

        loadRequests();

    } catch (error) {

        console.error(error);

        alert("Unable to delete request.");
    }
}


// ==========================================
// CANCEL EDIT
// ==========================================

cancelButton.addEventListener("click", function() {

    resetForm();

});


// ==========================================
// RESET FORM
// ==========================================

function resetForm() {

    requestForm.reset();

    requestId.value = "";

    formTitle.textContent = "Submit a Request";

    submitButton.textContent = "Submit Request";

    cancelButton.style.display = "none";
}


// ==========================================
// BASIC HTML ESCAPING
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ==========================================
// LOAD DATA WHEN PAGE OPENS
// ==========================================

loadRequests();