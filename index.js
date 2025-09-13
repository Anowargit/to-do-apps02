const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const PORT = process.env.PORT || 4000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

let todos = [];

app.get("/", (req, res) => {
    res.render("index", { todos });
});

// Add Todo
app.post("/add", (req, res) => {
    const { task, completed } = req.body;
    if (!task) {
        return res.send("<script>alert('Task cannot be empty'); window.location='/';</script>");
    }
    todos.push({ id: Date.now(), task, completed: completed === "on" });
    res.redirect("/");
});

// Toggle Completion
app.put("/toggle/:id", (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    res.redirect("/");
});

// Edit Todo Page
app.get("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    res.render("edit", { todo });
});

// Update Todo
app.put("/edit/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { task } = req.body;
    todos = todos.map(t => t.id === id ? { ...t, task } : t);
    res.redirect("/");
});

// Delete Todo
app.delete("/delete/:id", (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter(t => t.id !== id);
    res.redirect("/");
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
