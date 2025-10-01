document.getElementById('issueForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('studentName').value;
  const title = document.getElementById('issueTitle').value;
  const desc = document.getElementById('issueDesc').value;

  const issueHTML = `
    <div class="issue">
      <h3>${title}</h3>
      <p>${desc}</p>
      <small>Submitted by: ${name}</small>
    </div>
  `;

  document.getElementById('issueList').innerHTML += issueHTML;
  document.getElementById('issueForm').reset();
});
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

function submitIssue() {
  const name = document.getElementById("name").value;
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;

  db.collection("issues").add({
    name,
    title,
    description,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => {
    alert("Issue submitted!");
  });
}
