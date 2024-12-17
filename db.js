const express = require('express');
const cors = require('cors');
const mysql2 = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql2.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    database: 'form1',
    port: '3306'
});

db.connect((error) => {
    if (error) {
        console.log(error);
    }
    console.log('connected');
});

app.post("/", (req, res) => {
    const { firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role } = req.body;

    const checkQuery = `SELECT * FROM employees WHERE employeeID = ? OR email = ?`;
    db.query(checkQuery, [employeeID, email], (err, result) => {
        if (err) {
            return res.status(500).json({ success: false, message: "Database error", error: err });
        }

        if (result.length > 0) {
            return res.json({ success: false, message: "Employee already exists." });
        }


        const query = `INSERT INTO employees 
                       (firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role) 
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        db.query(
            query,
            [firstName, lastName, employeeID, email, phoneNumber, department, dateOfJoining, role],
            (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Failed to insert employee", error: err });
                }
                res.json({ success: true, message: "Employee added successfully" });
            }
        );
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`listening to port ${PORT}...`);
});
