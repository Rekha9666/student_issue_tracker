document.getElementById("loginBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Logged in as: " + userCredential.user.email);
    })
    .catch(error => {
      alert("Login failed: " + error.message);
    });
});

document.getElementById("signupBtn").addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      alert("Account created for: " + userCredential.user.email);
    })
    .catch(error => {
      alert("Signup failed: " + error.message);
    });
});