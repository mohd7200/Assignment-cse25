const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Location of JSON file
const dataFile = path.join(__dirname, "requests.json");

// Read requests from JSON file
function readRequests() {
    try {
        const data = fs.readFileSync(dataFile, "utf8");

        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading requests.json:", error);
        return [];
    }
}

// Write requests to JSON file
function writeRequests(requests) {
    fs.writeFileSync(
        dataFile,
        JSON.stringify(requests, null, 2),
        "utf8"
    );
}


// ==========================================
// GET ALL REQUESTS
// GET /api/requests
// ==========================================

app.get("/api/requests", (req, res) => {
    const requests = readRequests();

    res.json(requests);
});


// ==========================================
// GET SINGLE REQUEST
// GET /api/requests/:id
// ==========================================

app.get("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const id = Number(req.params.id);

    const request = requests.find(item => item.id === id);

    if (!request) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    res.json(request);
});


// ==========================================
// CREATE REQUEST
// POST /api/requests
// ==========================================

app.post("/api/requests", (req, res) => {
    const requests = readRequests();

    const {
        studentName,
        email,
        category,
        description,
        priority
    } = req.body;

    // Validation
    if (
        !studentName ||
        !email ||
        !category ||
        !description ||
        !priority
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    // Generate new ID
    const newId =
        requests.length > 0
            ? Math.max(...requests.map(item => item.id)) + 1
            : 1;

    const newRequest = {
        id: newId,
        studentName,
        email,
        category,
        description,
        priority
    };

    requests.push(newRequest);

    writeRequests(requests);

    res.status(201).json({
        message: "Request created successfully",
        request: newRequest
    });
});


// ==========================================
// UPDATE REQUEST
// PUT /api/requests/:id
// ==========================================

app.put("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const id = Number(req.params.id);

    const index = requests.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    const {
        studentName,
        email,
        category,
        description,
        priority
    } = req.body;

    // Validation
    if (
        !studentName ||
        !email ||
        !category ||
        !description ||
        !priority
    ) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    requests[index] = {
        id,
        studentName,
        email,
        category,
        description,
        priority
    };

    writeRequests(requests);

    res.json({
        message: "Request updated successfully",
        request: requests[index]
    });
});


// ==========================================
// DELETE REQUEST
// DELETE /api/requests/:id
// ==========================================

app.delete("/api/requests/:id", (req, res) => {
    const requests = readRequests();

    const id = Number(req.params.id);

    const index = requests.findIndex(item => item.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Request not found"
        });
    }

    const deletedRequest = requests.splice(index, 1)[0];

    writeRequests(requests);

    res.json({
        message: "Request deleted successfully",
        request: deletedRequest
    });
});


// ==========================================
// START SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`Campus Help Desk running at http://localhost:${PORT}`);
});