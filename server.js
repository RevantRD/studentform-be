const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
app.use(cors());
app.use(express.json());

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "userdata",
});
conn.connect((err) => {
  if (err) {
    console.log("Error connecting to database");
  }
  console.log("Database connected");
});

app.post("/add", (req, res) => {
  const query =
    "insert into students (id,name,department, location) values(?,?,?,?)";
  const { id, name, department, location } = req.body;
  conn.query(`select * from students where id = ?`, [id], (error, result) => {
    if (error) {
      res.status(500).send("Error while checking for duplicate entries");
    } else if (result.length > 0) {
      res.status(400).send("User already added");
    } else if (id == "" || name == "" || department == "" || location == "") {
      console.log("Add fields must be filled");
      res.status(401).send("All fields must be filled");
    } else {
      conn.query(query, [id, name, department, location], (error, result) => {
        if (error) {
          console.log(error);
          res.send("Error while adding data");
        }
        console.log(result);
        res.status(201).send("User added successfully");
      });
    }
  });
});
// app.put("/id", (req, res) => {
//   const userid = req.params.id;
//   const { id, name, department, location } = req.body;
//   const query = `update students set ? = ? where userid = ?`;
//   conn.query(query, [id, name, department, location], (error, result) => {});
// });

app.get("/get", (req, res) => {
  const query = "select * from students";
  conn.query(query, (error, result) => {
    if (error) {
      console.log("Error getting data");
      res.send("Error");
    }
    console.log(result);
    res.send(result);
  });
});

app.delete("/:id", (req, res) => {
  const id = req.params.id;
  const query = `delete from students where id = ?`;
  conn.query(query, id, (error, result) => {
    if (error) {
      console.log(error);
      res.send("Error while deleting data");
    }
    console.log(`User  deleted successfully`);
    res.send("User deleted");
  });
});

app.listen(5000, () => {
  console.log("Server started");
});
