const firebaseConfig = {
  apiKey: "AIzaSyAPQTzr0CcR6xGqds2gV-VbopQl4x5Bi0o",
  authDomain: "student-issuetracker.firebaseapp.com",
  projectId: "student-issuetracker",
  storageBucket: "student-issuetracker.appspot.com",
  messagingSenderId: "440865318009",
  appId: "1:440865318009:web:8e553c0271f5e5c36c60a8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const ADMIN_EMAIL = "rekha.example@gmail.com";

window.addEventListener("DOMContentLoaded", () => {
  const authSection = document.getElementById("authSection");
  const trackerSection = document.getElementById("trackerSection");
  const loginBtn = document.getElementById("loginBtn");
  const signupBtn = document.getElementById("signupBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const submitBtn = document.getElementById("submitBtn");
  const issuesList = document.getElementById("issuesList");

  auth.onAuthStateChanged((user) => {
    console.log("Auth state changed:", user?.email);
    if (user) {
      authSection.classList.add("hidden");
      trackerSection.classList.remove("hidden");
      loadIssues();
    } else {
      authSection.classList.remove("hidden");
      trackerSection.classList.add("hidden");
    }
  });

  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    auth.signInWithEmailAndPassword(email, password)
      .then(() => alert("Logged in!"))
      .catch((err) => alert(err.message));
  });

  signupBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => alert("Account created!"))
      .catch((err) => alert(err.message));
  });

  logoutBtn.addEventListener("click", () => {
    auth.signOut();
  });

  submitBtn.addEventListener("click", async () => {
    const name = document.getElementById("name").value.trim();
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!name || !title || !description) {
      alert("Please fill out all fields.");
      return;
    }

    try {
      await db.collection("issues").add({
        name,
        title,
        description,
        status: "open",
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });
      alert("Issue submitted!");
      document.getElementById("issueForm").reset();
    } catch (error) {
      console.error("Error submitting issue:", error);
      alert("Submission failed.");
    }
  });

  function loadIssues() {
    db.collection("issues").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
      issuesList.innerHTML = "";
      const currentUserEmail = auth.currentUser?.email;

      let total = 0;
      let open = 0;
      let resolved = 0;

      snapshot.forEach((doc) => {
        const issue = doc.data();
        console.log("Issue loaded:", issue);

        total++;

        const status = issue.status?.toLowerCase() || "unknown";
        if (status === "open") open++;
        else if (status === "resolved") resolved++;

        const item = document.createElement("div");
        item.className = "issue";

        let adminButtons = "";
        if (currentUserEmail === ADMIN_EMAIL) {
          adminButtons = `<button data-id="${doc.id}" class="deleteBtn">Delete</button>`;
        }

        item.innerHTML = `
          <h3>${issue.title}</h3>
          <p>${issue.description}</p>
          <small><strong>Submitted by:</strong> ${issue.name}</small><br>
          <small><strong>Status:</strong> ${issue.status}</small><br>
          ${status === "open" ? `<button data-id="${doc.id}" class="resolveBtn">Mark as Resolved</button>` : ""}
          ${adminButtons}
        `;
        issuesList.appendChild(item);
      });

      document.getElementById("totalCount").textContent = total;
      document.getElementById("openCount").textContent = open;
      document.getElementById("resolvedCount").textContent = resolved;
      document.getElementById("debugLog").textContent = `Loaded ${total} issues`;

      document.querySelectorAll(".resolveBtn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          try {
            await db.collection("issues").doc(id).update({ status: "resolved" });
            alert("Issue marked as resolved!");
          } catch (error) {
            console.error("Error updating issue:", error);
            alert("Failed to update issue.");
          }
        });
      });

      document.querySelectorAll(".deleteBtn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const id = btn.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this issue?")) {
            try {
              await db.collection("issues").doc(id).delete();
              alert("Issue deleted.");
            } catch (error) {
              console.error("Error deleting issue:", error);
              alert("Failed to delete issue.");
            }
          }
        });
      });
    });
  }
});