import { doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;

      // Save role in Firestore (default student)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "student"   // later change to "mentor" in Console
      });

      alert("Account created for: " + user.email);
    })
    .catch(error => {
      alert("Signup failed: " + error.message);
    });
});