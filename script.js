const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const postList = document.getElementById("postList");

let posts = JSON.parse(localStorage.getItem("posts")) || [];

function savePost() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert("Title and content are required.");
    return;
  }

  posts.unshift({
    id: Date.now(),
    title,
    content,
    date: new Date().toLocaleString()
  });

  localStorage.setItem("posts", JSON.stringify(posts));
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
      <div class="post-actions">
        <button onclick="editPost(${post.id})">Edit</button>
        <button onclick="deletePost(${post.id})">Delete</button>
      </div>
    `;

    postList.appendChild(li);
  });
}

function deletePost(id) {
  posts = posts.filter(post => post.id !== id);
  localStorage.setItem("posts", JSON.stringify(posts));
  renderPosts();
}

function editPost(id) {
  const post = posts.find(p => p.id === id);
  titleInput.value = post.title;
  contentInput.value = post.content;
  deletePost(id);
}

renderPosts();
