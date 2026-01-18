const authSection = document.getElementById("auth");
const appSection = document.getElementById("app");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const postList = document.getElementById("postList");

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
let users = JSON.parse(localStorage.getItem("users")) || {};
let posts = [];

/* ---------- AUTH ---------- */

function register() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    alert("All fields required");
    return;
  }

  if (users[email]) {
    alert("User already exists");
    return;
  }

  users[email] = { password, posts: [] };
  localStorage.setItem("users", JSON.stringify(users));
  alert("Registered successfully. You can now login.");
}

function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!users[email] || users[email].password !== password) {
    alert("Invalid credentials");
    return;
  }

  currentUser = email;
  localStorage.setItem("currentUser", JSON.stringify(email));
  loadUser();
}

function logout() {
  localStorage.removeItem("currentUser");
  location.reload();
}

/* ---------- BLOG ---------- */

function loadUser() {
  authSection.style.display = "none";
  appSection.style.display = "block";

  posts = users[currentUser].posts || [];
  renderPosts();
}

function savePost() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  posts.unshift({
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleString()
  });

  users[currentUser].posts = posts;
  localStorage.setItem("users", JSON.stringify(users));

  titleInput.value = "";
  contentInput.value = "";
  renderPosts();
}

function renderPosts() {
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
  posts = posts.filter(p => p.id !== id);
  users[currentUser].posts = posts;
  localStorage.setItem("users", JSON.stringify(users));
  renderPosts();
}

/* ---------- INIT ---------- */

if (currentUser && users[currentUser]) {
  loadUser();
}
