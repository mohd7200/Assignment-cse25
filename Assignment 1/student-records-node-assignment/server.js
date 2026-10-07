const http = require("http");
const fs = require("fs");

const PORT = 3000;
const DATA_FILE = "students.json";

function readStudents() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }

  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStudents(students) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
}

function formPage(message = "") {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Student Records</title>
</head>
<body>
  <h1>Student Record Manager</h1>
  ${message ? `<p>${message}</p>` : ""}
  <form method="POST" action="/students">
    <label>Student Name:</label><br>
    <input type="text" name="name" required><br><br>

    <label>Roll Number:</label><br>
    <input type="text" name="rollNumber" required><br><br>

    <label>Course:</label><br>
    <input type="text" name="course" required><br><br>

    <label>Email:</label><br>
    <input type="email" name="email" required><br><br>

    <button type="submit">Add Student</button>
  </form>

  <p><a href="/students">View Student Records</a></p>
</body>
</html>`;
}

function studentsPage() {
  const students = readStudents();

  const rows = students.map(student => `
    <tr>
      <td>${student.name}</td>
      <td>${student.rollNumber}</td>
      <td>${student.course}</td>
      <td>${student.email}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Student Records</title>
</head>
<body>
  <h1>Student Records</h1>
  <table border="1" cellpadding="8">
    <tr>
      <th>Student Name</th>
      <th>Roll Number</th>
      <th>Course</th>
      <th>Email</th>
    </tr>
    ${rows || "<tr><td colspan='4'>No students added yet.</td></tr>"}
  </table>
  <p><a href="/">Back to Form</a></p>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(formPage("Welcome to the Student Record Manager!"));
    return;
  }

  if (req.method === "GET" && req.url === "/students") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(studentsPage());
    return;
  }

  if (req.method === "POST" && req.url === "/students") {
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const params = new URLSearchParams(body);

      const student = {
        name: params.get("name") || "",
        rollNumber: params.get("rollNumber") || "",
        course: params.get("course") || "",
        email: params.get("email") || ""
      };

      const students = readStudents();
      students.push(student);
      saveStudents(students);

      res.writeHead(302, { Location: "/students" });
      res.end();
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("404 - Page Not Found");
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
