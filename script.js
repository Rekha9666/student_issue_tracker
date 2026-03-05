// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, getDoc } 
  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase Config (replace with your values from Firebase Console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "student-issue-tracker-2.firebaseapp.com",
  projectId: "student-issue-tracker-2",
  storageBucket: "student-issue-tracker-2.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Login
document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Logged in as: " + userCredential.user.email);
      loadIssues(); // try to load issues after login
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
});

// Signup
document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Save role in Firestore (default student)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "student"   // later change to "mentor" in Console for mentors
      });

      alert("Account created for: " + user.email);
    })
    .catch(error => {
      alert("Signup failed: " + error.message);
    });
});

// Submit Issue
document.getElementById("submitIssueBtn").addEventListener("click", async () => {
  const title = document.getElementById("issueTitle").value;
  const desc = document.getElementById("issueDesc").value;

  if (!auth.currentUser) {
    alert("You must be logged in to submit an issue.");
    return;
  }

  try {
    await addDoc(collection(db, "issues"), {
      title,
      description: desc,
      createdBy: auth.currentUser.uid,
      timestamp: new Date()
    });
    alert("Issue submitted!");
    loadIssues();
  } catch (e) {
    console.error("Error adding issue: ", e);
  }
});

// Load Issues (only mentors should see)
async function loadIssues() {
  if (!auth.currentUser) return;

  // Get the user's role from Firestore
  const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  const userData = userDoc.data();

  if (!userData || userData.role !== "mentor") {
    document.getElementById("issuesList").innerHTML = 
      "You do not have permission to view submitted issues.";
    return;
  }

  // If mentor, load issues
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "issues"));
    querySnapshot.forEach(docSnap => {
      const issue = docSnap.data();
      const div = document.createElement("div");
      div.textContent = `${issue.title} - ${issue.description} (Submitted by: ${issue.createdBy})`;
      issuesList.appendChild(div);
    });
  } catch (e) {
    console.error("Error loading issues: ", e);
  }
}