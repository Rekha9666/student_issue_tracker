// Load Issues (only mentors should see)
async function loadIssues() {
  if (!auth.currentUser) return;

  // Get the user's role from Firestore
  const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
  const userData = userDoc.data();

  if (userData.role !== "mentor") {
    // If not a mentor, don't show issues
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