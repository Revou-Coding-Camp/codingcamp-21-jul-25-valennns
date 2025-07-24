const form = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const todoList = document.getElementById("todo-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const searchInput = document.getElementById("search-input");
const sortBtn = document.getElementById("sort-btn");

let todos = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (task === "" || date === "") {
    alert("Please fill in both fields!");
    return;
  }

  const todo = {
    id: Date.now(),
    task,
    date,
    status: "Pending"
  };

  todos.push(todo);
  renderTodos();
  form.reset();
});

function renderTodos(list = todos) {
  todoList.innerHTML = "";

  if (list.length === 0) {
    todoList.innerHTML = `<tr><td colspan="4" style="text-align:center;">No task found</td></tr>`;
    updateStats();
    return;
  }

  list.forEach(todo => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${todo.task}</td>
      <td>${todo.date}</td>
      <td>${todo.status}</td>
      <td class="actions">
        <button class="${todo.status === 'Pending' ? 'done' : 'undo'}" onclick="toggleStatus(${todo.id})">
          ${todo.status === "Pending" ? "✔ Done" : "↩ Undo"}
        </button>
        <button class="delete" onclick="deleteTodo(${todo.id})">🗑</button>
      </td>
    `;
    todoList.appendChild(row);
  });

  updateStats();
}

function toggleStatus(id) {
  todos = todos.map(todo =>
    todo.id === id
      ? { ...todo, status: todo.status === "Pending" ? "Completed" : "Pending" }
      : todo
  );
  renderTodos();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  renderTodos();
}

deleteAllBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to delete all tasks?")) {
    todos = [];
    renderTodos();
  }
});

function updateStats() {
  const total = todos.length;
  const completed = todos.filter(t => t.status === "Completed").length;
  const pending = total - completed;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById("total-tasks").textContent = total;
  document.getElementById("completed-tasks").textContent = completed;
  document.getElementById("pending-tasks").textContent = pending;
  document.getElementById("progress-percent").textContent = `${progress}%`;
}

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = todos.filter(todo =>
    todo.task.toLowerCase().includes(query)
  );
  renderTodos(filtered);
});

sortBtn.addEventListener("click", () => {
  todos.sort((a, b) => new Date(a.date) - new Date(b.date));
  renderTodos();
});

renderTodos();
