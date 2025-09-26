const SERVER_URL="https://todoappv1-19kz.onrender.com";
const token = localStorage.getItem("token");

// Login
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${SERVER_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(async response => {
      const text = await response.text(); // read raw response first
      let data;

      try {
        data = JSON.parse(text); // try parsing JSON
      } catch {
        data = { message: text }; // fallback if it's plain text
      }

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    })
    .then(data => {
      localStorage.setItem("token", data.token);
      window.location.href = "todos.html";
    })
    .catch(error => {
      alert(error.message);
    });
}

// Register
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  fetch(`${SERVER_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(response => {
      if (response.ok) {
        alert("Registration successful !!! , please login");
        window.location.href = "login.html";
      } else {
        return response.json().then(data => {
          throw new Error(data.message || "Registration failed");
        });
      }
    })
    .catch(error => {
      alert(error.message);
  })
}

// Create Todo Card
function createTodoCard(todo) {

  const card = document.createElement("div");
  card.className = "todo-card";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = todo.isCompleted;
  checkbox.addEventListener("change", function(){
    const updateTodo={ ...todo, isCompleted: checkbox.checked }
    updateTodoStatus(updateTodo);
  } );

  const span = document.createElement("span");
  span.textContent = todo.title;
  if (todo.isCompleted) {
    span.style.textDecoration = "line-through";
    span.style.color = "#aaa";
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.onclick = function(){deleteTodo(todo.id);} ;
  card.appendChild(checkbox);
  card.appendChild(span);
  card.appendChild(deleteBtn);
  return card;
}

// Load Todos
function loadTodos() {
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  fetch(`${SERVER_URL}/api/v1/todo`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Failed to get todos");
        });
      }
      return response.json();
    })
    .then(todos => {
      const todoList = document.getElementById("todo-list");
      todoList.innerHTML = "";
      if (!todos || todos.length === 0) {
        todoList.innerHTML = `<p id="empty-message">No Todos yet. Add one below!</p>`;
      } else {
        todos.forEach(todo => todoList.appendChild(createTodoCard(todo)));
      }
    })
    .catch(error => {
      alert(error.message);
      document.getElementById("todo-list").innerHTML = '';
    });
}

// Add Todo
function addTodo() {
  const input = document.getElementById("new-todo");
  const todoText = input.value.trim();
  if (!todoText) return;

  fetch(`${SERVER_URL}/api/v1/todo/create`, {   // ✅ use correct backend path
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title: todoText, isCompleted: false })
  })
    .then(async response => {
  if (!response.ok) {
    const text = await response.text();
    let err;
    try { err = JSON.parse(text); } catch { err = { message: text }; }
    throw new Error(err.message || "Failed to add todo");
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {};
})
    .then(() => {
      input.value = "";
      loadTodos();
    })
    .catch(error => alert(error.message));
}

// Update Todo
function updateTodoStatus(todo) {
  fetch(`${SERVER_URL}/api/v1/todo`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(todo)
  })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Failed to update todo");
        });
      }
      return response.json();
    })
    .then(() => loadTodos())
    .catch(error => alert(error.message));
}

// Delete Todo
function deleteTodo(id) {
  fetch(`${SERVER_URL}/api/v1/todo/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(response => {
  if (!response.ok) {
    return response.json().then(err => {
      throw new Error(err.message || "Failed to delete todo");
    });
  }
  return response.text();   // ❌ here backend returns string, so keep text OR unify as safe parse
})

    .then(() => loadTodos())
    .catch(error => alert(error.message));
}

// Page init
document.addEventListener("DOMContentLoaded", function(){
  if (document.getElementById("todo-list")) {
    loadTodos();
  }
});
