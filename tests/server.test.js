
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { createApp } = require("../src/server");

async function setup() {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), "taskflow-test-"));
    const dbPath = path.join(folder, "tasks.db");

    const { app, db } = createApp(dbPath);

    const server = app.listen(0, "127.0.0.1");
    await new Promise(resolve => server.once("listening", resolve));

    const url = `http://127.0.0.1:${server.address().port}`;

    return {
        url,
        cleanup: async () => {
            await new Promise((resolve, reject) => {
                server.close(error => error ? reject(error) : resolve());
            });
            db.close();
            fs.rmSync(folder, { recursive: true, force: true });
        }
    };
}

test("GET /api/health returns OK", async () => {
    const app = await setup();

    try {
        const response = await fetch(`${app.url}/api/health`);
        assert.equal(response.status, 200);
    } finally {
        await app.cleanup();
    }
});

test("POST /api/tasks creates a task", async () => {
    const app = await setup();

    try {
        const response = await fetch(`${app.url}/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "Finish assignment" })
        });

        assert.equal(response.status, 201);

        const tasks = await fetch(`${app.url}/api/tasks`);
        const data = await tasks.json();

        assert.equal(data.length, 1);
        assert.equal(data[0].title, "Finish assignment");
    } finally {
        await app.cleanup();
    }
});

test("POST /api/tasks rejects an empty title", async () => {
    const app = await setup();

    try {
        const response = await fetch(`${app.url}/api/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "" })
        });

        assert.equal(response.status, 400);
    } finally {
        await app.cleanup();
    }
});
