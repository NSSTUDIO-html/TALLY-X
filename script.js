let entries = [];

// Load data on page load
window.onload = () => {
  loadData();
};

// Create company
function createCompany() {
  const name = document.getElementById("companyName").value.trim();
  if (name) {
    document.getElementById("companyHeader").textContent = name;
    document.getElementById("companyName").value = "";
  }
}

// Add new entry
function addEntry() {
  const date = document.getElementById("entryDate").value;
  const particulars = document.getElementById("particulars").value.trim();
  const debit = parseFloat(document.getElementById("debit").value) || 0;
  const credit = parseFloat(document.getElementById("credit").value) || 0;

  if (!date || !particulars || (debit === 0 && credit === 0)) {
    alert("Please fill all required fields correctly.");
    return;
  }

  entries.push({ date, particulars, debit, credit });
  saveData();
  renderTable();
  clearInputs();
}

// Clear input fields
function clearInputs() {
  document.getElementById("entryDate").value = "";
  document.getElementById("particulars").value = "";
  document.getElementById("debit").value = "";
  document.getElementById("credit").value = "";
}

// Render ledger table
function renderTable() {
  const tableBody = document.querySelector("#ledgerTable tbody");
  tableBody.innerHTML = "";

  let totalDebit = 0;
  let totalCredit = 0;

  entries.forEach((entry, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.particulars}</td>
      <td>${entry.debit.toFixed(2)}</td>
      <td>${entry.credit.toFixed(2)}</td>
      <td><button onclick="deleteEntry(${index})">Delete</button></td>
    `;
    totalDebit += entry.debit;
    totalCredit += entry.credit;
    tableBody.appendChild(row);
  });

  document.getElementById("totalDebit").textContent = totalDebit.toFixed(2);
  document.getElementById("totalCredit").textContent = totalCredit.toFixed(2);
}

// Delete entry by index
function deleteEntry(index) {
  if (confirm("Delete this entry?")) {
    entries.splice(index, 1);
    saveData();
    renderTable();
  }
}

// Save to localStorage
function saveData() {
  localStorage.setItem("ledgerEntries", JSON.stringify(entries));
}

// Load from localStorage
function loadData() {
  const data = localStorage.getItem("ledgerEntries");
  if (data) {
    entries = JSON.parse(data);
    renderTable();
  }
}

// Export to CSV
function exportCSV() {
  if (entries.length === 0) {
    alert("No data to export!");
    return;
  }

  let csv = "Date,Particulars,Debit,Credit\n";
  entries.forEach(entry => {
    csv += `${entry.date},${entry.particulars},${entry.debit},${entry.credit}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ledger.csv";
  link.click();
}