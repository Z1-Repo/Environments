const GITHUB_USER = "Z1-Repo";
const REPO_NAME = "Environments";
const FILE_PATH = "data/db.json";
const TOKEN = "your-github-token";

// Fetch and display table data
async function fetchData() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const res = await fetch(url);
    const data = await res.json();
    const content = JSON.parse(atob(data.content));
    displayTables(content);
}

// Update GitHub data
async function updateData(updatedData) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO_NAME}/contents/${FILE_PATH}`;
    const shaResponse = await fetch(url);
    const { sha } = await shaResponse.json();

    await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `token ${TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: "Update data",
            content: btoa(JSON.stringify(updatedData, null, 2)),
            sha
        })
    });

    alert("Data updated!");
}

// Display tables
function displayTables(data) {
    populateTable("frontend-table", data.frontend);
    populateTable("backend-table", data.backend);
}

function populateTable(tableId, rows) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = "";

    rows.forEach((row, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.environment}</td>
            <td>${row.build}</td>
            <td>${row.developer}</td>
            <td>${row.qa}</td>
            <td><button onclick="deleteRow('${tableId}', ${index})">Delete</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Add new row
function addRow(table, form) {
    const newRow = {
        environment: form[0].value,
        build: form[1].value,
        developer: form[2].value,
        qa: form[3].value
    };

    const updatedData = { frontend: [], backend: [] };
    updatedData[table].push(newRow);
    updateData(updatedData);
}

// Delete row
function deleteRow(tableId, index) {
    const updatedData = { frontend: [], backend: [] };
    updatedData[tableId.includes("frontend") ? "frontend" : "backend"].splice(index, 1);
    updateData(updatedData);
}

// Form handlers
document.querySelector("#frontend-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addRow("frontend", e.target);
});

document.querySelector("#backend-form").addEventListener("submit", (e) => {
    e.preventDefault();
    addRow("backend", e.target);
});

// Initialize
fetchData();
