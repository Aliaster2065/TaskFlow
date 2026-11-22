
const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

function createApp(databasePath) {
    const app = express();

    const dbPath = databasePath ||
        path.join(__dirname, "../database/tasks.db");

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    const db = new Database(dbPath);

    db.exec(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            completed INTEGER NOT NULL DEFAULT 0
        )
    `);

    app.use(express.json());
    app.use(express.static(path.join(__dirname, "../public")));

    app.get("/api/health", (req, res) => {
        res.json({
            status: "OK",
            message: "TaskFlow backend is running!"
        });
    });

    app.get("/api/tasks", (req, res) => {
        const tasks = db.prepare("SELECT * FROM tasks").all();
        res.json(tasks);
    });

    app.post("/api/tasks", (req, res) => {
        const { title } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                error: "Task title is required"
            });
        }

        const result = db.prepare(
            "INSERT INTO tasks (title) VALUES (?)"
        ).run(title.trim());

        res.status(201).json({
            id: result.lastInsertRowid,
            title: title.trim(),
            completed: 0
        });
    });

    app.patch("/api/tasks/:id", (req, res) => {
        const id = Number(req.params.id);
        const { completed } = req.body;

        if (!Number.isInteger(id) || id <= 0 ||
            typeof completed !== "boolean") {
            return res.status(400).json({
                error: "Invalid task ID or completion status"
            });
        }

        const result = db.prepare(
            "UPDATE tasks SET completed = ? WHERE id = ?"
        ).run(completed ? 1 : 0, id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({ message: "Task updated successfully" });
    });

    app.delete("/api/tasks/:id", (req, res) => {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid task ID"
            });
        }

        const result = db.prepare(
            "DELETE FROM tasks WHERE id = ?"
        ).run(id);

        if (result.changes === 0) {
            return res.status(404).json({
                error: "Task not found"
            });
        }

        res.json({ message: "Task deleted successfully" });
    });

    return { app, db };
}

if (require.main === module) {
    const { app } = createApp();
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`TaskFlow running on port ${PORT}`);
    });
}

module.exports = { createApp };
