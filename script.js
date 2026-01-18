const authSection = document.getElementById("auth");
const appSection = document.getElementById("app");

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const postList = document.getElementById("postList");
const editingIdInput = document.getElementById("editingId");
const cancelBtn = document.getElementById("cancelBtn");

/* ---------- STORAGE ---------- */

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
    alert("Email and password required");
    return;
  }

  const users = getUsers();

  if (users[email]) {
    alert("User already exists");
    return;
  }

  users[email] = { password, posts: [] };
  setUsers(users);

  emailInput.value = "";
  passwordInput.value = "";

  alert("Registered successfully. Please login.");
}

function login() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const users = getUsers();

  if (!users[email] || users[email].password !== password) {
    alert("Invalid credentials");
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
  const editingId = editingIdInput.value;
  const email = localStorage.getItem("currentUser");

  if (!title || !content) {
    alert("Title and content required");
    return;
  }

  const users = getUsers();
  const posts = users[email].posts;

  if (editingId) {
    // UPDATE EXISTING POST
    const post = posts.find(p => p.id == editingId);
    post.title = title;
    post.content = content;
  } else {
    // CREATE NEW POST
    posts.unshift({
      id: Date.now(),
      title,
      content,
      date: new Date().toLocaleString()
    });
  }

  users[email].posts = posts;
  setUsers(users);

  resetEditor();
  renderPosts(posts);
}

function renderPosts(posts) {
  postList.innerHTML = "";

  posts.forEach(post => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h3>${post.title}</h3>
      <small>${post.date}</small>
      <p>${post.content.substring(0, 120)}...</p>
      <button onclick="openPost(${post.id})">Open</button>
      <button onclick="editPost(${post.id})">Edit</button>
      <button onclick="deletePost(${post.id})">Delete</button>
    `;
    postList.appendChild(li);
  });
}

/* ---------- OPEN / EDIT ---------- */

function openPost(id) {
  const email = localStorage.getItem("currentUser");
  const users = getUsers();
  const post = users[email].posts.find(p => p.id === id);

  titleInput.value = post.title;
  contentInput.value = post.content;

  editingIdInput.value = "";
  cancelBtn.style.display = "none";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function editPost(id) {
  const email = localStorage.getItem("currentUser");
  const users = getUsers();
  const post = users[email].posts.find(p => p.id === id);

  titleInput.value = post.title;
  contentInput.value = post.content;
  editingIdInput.value = id;

  cancelBtn.style.display = "inline-block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cancelEdit() {
  resetEditor();
}

function deletePost(id) {
  const email = localStorage.getItem("currentUser");
  const users = getUsers();

  users[email].posts = users[email].posts.filter(p => p.id !== id);
  setUsers(users);

  renderPosts(users[email].posts);
}

function resetEditor() {
  titleInput.value = "";
  contentInput.value = "";
  editingIdInput.value = "";
  cancelBtn.style.display = "none";
}

/* ---------- INIT ---------- */

const currentUser = localStorage.getItem("currentUser");
if (currentUser) {
  loadUser(currentUser);
}
