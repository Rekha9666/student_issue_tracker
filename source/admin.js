import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnrUO4Z91eHJ4lEzhAflHVzd4qO7Hc7uY",
  authDomain: "student-issue-tracker-2.firebaseapp.com",
  projectId: "student-issue-tracker-2",
  databaseURL: "https://student-issue-tracker-2-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Access denied. Please log in as admin.");
    window.location.href = "index.html";
  } else {
    loadIssues();
  }
});

function loadIssues() {
  const filter = document.getElementById("statusFilter").value;
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";

  onValue(ref(db, "issues"), (snapshot) => {
    const data = snapshot.val();
    for (let id in data) {
      const issue = data[id];
      if (filter !== "all" && issue.status !== filter) continue;

      const item = document.createElement("div");
      item.className = "issue" + (issue.status === "resolved" ? " resolved" : "");
      item.innerHTML = `
        <h3>${issue.title}</h3>
        <p>${issue.description}</p>
        <p><strong>Submitted by:</strong> ${issue.name}</p>
        <p><strong>Status:</strong> ${issue.status || "open"}</p>
        <textarea placeholder="Admin comment" id="comment-${id}">${issue.adminComment || ""}</textarea><br>
        <select id="status-${id}">
          <option value="open" ${issue.status === "open" ? "selected" : ""}>Open</option>
          <option value="in progress" ${issue.status === "in progress" ? "selected" : ""}>In Progress</option>
          <option value="resolved" ${issue.status === "resolved" ? "selected" : ""}>Resolved</option>
        </select>
        <button onclick="updateIssue('${id}')">Update</button>
        <hr>
      `;
      issuesList.appendChild(item);
    }
  });
}

function updateIssue(id) {
  const status = document.getElementById(`status-${id}`).value;
  const comment = document.getElementById(`comment-${id}`).value;

  update(ref(db, `issues/${id}`), {
    status,
    adminComment: comment,
    resolvedAt: status === "resolved" ? Date.now() : null
  });

  alert("Issue updated!");
}

function signOut() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}