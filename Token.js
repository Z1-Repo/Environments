async function saveTableData() {
    const tables = document.querySelectorAll('table');
    const data = [];

    tables.forEach((table, tableIndex) => {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row) => {
            const cells = row.querySelectorAll('td');
            const rowData = {
                table: tableIndex + 1,
                srNo: cells[0].innerText,
                environment: cells[1].innerText,
                developer: cells[2].innerText,
                qa: cells[3].innerText
            };
            data.push(rowData);
        });
    });

    const jsonData = JSON.stringify(data, null, 2);

    // Replace 'YOUR_PERSONAL_ACCESS_TOKEN' with your actual GitHub Personal Access Token
    const token = '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'; 

    // API endpoint to create/update a file in the repository
    const apiUrl = 'https://api.github.com/repos/Z1-Repo/Environments/contents/data.json';

    // Fetch the existing file SHA if updating the file
    let sha = '';
    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (response.ok) {
            const fileData = await response.json();
            sha = fileData.sha; // Get the SHA of the existing file
        }
    } catch (error) {
        console.error('Error fetching file SHA:', error);
    }

    // Commit the JSON data to the repository
    const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update table data',
            content: btoa(jsonData),
            sha: sha // Provide the SHA of the existing file if updating
        })
    });

    if (response.ok) {
        alert('Table data saved successfully!');
    } else {
        alert('Failed to save table data.');
    }
}
