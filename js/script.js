let tasks = [];

function addTask() {
  const input = document.getElementById("taskInput");
  const date = document.getElementById("dateInput");
  if (input.value.trim() === "") return;

  tasks.push({
    name: input.value,
    date: date.value || "-",
    completed: false,
  });

  input.value = "";
  date.value = "";
  renderTasks();
}

function renderTasks() {
  const list = document.getElementById("taskList");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const status = document.getElementById("statusFilter").value;

  const filtered = tasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(search);
    const matchesStatus =
      status === "all" ||
      (status === "completed" && task.completed) ||
      (status === "pending" && !task.completed);
    return matchesSearch && matchesStatus;
  });

  list.innerHTML = "";

  if (filtered.length === 0) {
    list.innerHTML = "<tr><td colspan='4'>No task found</td></tr>";
    updateStats();
    return;
  }

  filtered.forEach((task, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.date}</td>
      <td class="${task.completed ? "status-done" : "status-pending"}">
        ${task.completed ? "Completed" : "Pending"}
      </td>
      <td>
        <button class="action-btn complete-btn" onclick="toggleComplete(${index})">
          ✓
        </button>
        <button class="action-btn delete-btn-small" onclick="deleteTask(${index})">
          🗑
        </button>
      </td>
    `;
    list.appendChild(row);
  });

  updateStats();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  renderTasks();
}

function deleteAllTasks() {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    renderTasks();
  }
}

function sortTasksByDate() {
  tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTasks();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("totalCount").innerText = total;
  document.getElementById("completedCount").innerText = completed;
  document.getElementById("pendingCount").innerText = pending;
  document.getElementById("progressPercent").innerText = progress + "%";
}

// Jalankan render saat pengguna mengetik di kolom search
document.getElementById("searchInput").addEventListener("input", renderTasks);

