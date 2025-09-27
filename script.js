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