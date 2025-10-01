// Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.3.1/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPQTzr0CcR6xGqds2gV-VbopQl4x5Bi0o",
  authDomain: "student-issuetracker.firebaseapp.com",
  projectId: "student-issuetracker",
  storageBucket: "student-issuetracker.appspot.com",
  messagingSenderId: "440865318009",
  appId: "1:440865318009:web:8e553c0271f5e5c36c60a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit issue to Firestore
document.getElementById("submitBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.trim();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !title || !description) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    await addDoc(collection(db, "issues"), {
      name,
      title,
      description,
      status: "open",
      timestamp: serverTimestamp()
    });
    alert("Issue submitted!");
    document.getElementById("issueForm").reset();
  } catch (error) {
    console.error("Error submitting issue:", error);
    alert("Submission failed. Check console for details.");
  }
});

// Load and display issues
function loadIssues() {
  const issuesList = document.getElementById("issuesList");
  const q = query(collection(db, "issues"), orderBy("timestamp", "desc"));

  onSnapshot(q, (snapshot) => {
    issuesList.innerHTML = "";
    if (snapshot.empty) {
      issuesList.innerHTML = "<p>No issues submitted yet.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const issue = doc.data();
      const item = document.createElement("div");
      item.className = "issue";
      item.innerHTML = `
        <h3>${issue.title}</h3>
        <p>${issue.description}</p>
        <small><strong>Submitted by:</strong> ${issue.name}</small>
      `;
      issuesList.appendChild(item);
    });
  }, (error) => {
    console.error("Error loading issues:", error);
    issuesList.innerHTML = "<p>Failed to load issues.</p>";
  });
}

window.onload = loadIssues;