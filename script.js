const authSection = document.getElementById("auth");
const appSection = document.getElementById("app");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const postList = document.getElementById("postList");

/* ---------- STORAGE HELPERS ---------- */

function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || {};
}

function setUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

/* ---------- AUTH ---------- */

function register() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("Email and password are required");
    return;
  }

  const users = getUsers();

  if (users[email]) {
    alert("User already exists");
    return;
  }

  users[email] = {
    password: password,
    posts: []
  };

  setUsers(users);

  emailInput.value = "";
  passwordInput.value = "";

  alert("Registration successful. Please login.");
}

function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const users = getUsers();

  if (!users[email]) {
    alert("User not found");
    return;
  }

  if (users[email].password !== password) {
    alert("Incorrect password");
    return;
  }

  localStorage.setItem("currentUser", email);
  loadUser(email);
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

/* ---------- BLOG ---------- */

function loadUser(email) {
  authSection.style.display = "none";
  appSection.style.display = "block";

  const users = getUsers();
  renderPosts(users[email].posts);
}

function savePost() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  const email = localStorage.getItem("currentUser");
  const users = getUsers();

  users[email].posts.unshift({
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleString()
  });

  setUsers(users);

  titleInput.value = "";
  contentInput.value = "";

  renderPosts(users[email].posts);
}

function renderPosts(posts) {
  postList.innerHTML = "";

  posts.forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${post.title}</h3>
      <small>${post.date}</small>
      <p>${post.content.substring(0, 150)}...</p>
      <button onclick="deletePost(${post.id})">Delete</button>
    `;
    postList.appendChild(li);
  });
}

function deletePost(id) {
  const email = localStorage.getItem("currentUser");
  const users = getUsers();

  users[email].posts = users[email].posts.filter(p => p.id !== id);
  setUsers(users);

  renderPosts(users[email].posts);
}

/* ---------- INIT ---------- */

const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
  loadUser(currentUser);
}
