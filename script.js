document.addEventListener("DOMContentLoaded", () => {
    fetchTableData("frontend");
    fetchTableData("backend");

    document.getElementById("frontendForm").addEventListener("submit", (e) => submitForm(e, "frontend"));
    document.getElementById("backendForm").addEventListener("submit", (e) => submitForm(e, "backend"));
});

function submitForm(event, type) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    formData.append("type", type);

    fetch("crud.php", { method: "POST", body: formData })
        .then(response => response.text())
        .then(() => {
            fetchTableData(type);
            form.reset();
        });
}

function fetchTableData(type) {
    fetch(`crud.php?type=${type}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector(`#${type}Table tbody`);
            tableBody.innerHTML = "";
            data.forEach((row, index) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `<td>${index + 1}</td>` +
                    Object.values(row).map(value => `<td>${value}</td>`).join("");
                tableBody.appendChild(tr);
            });
        });
}
