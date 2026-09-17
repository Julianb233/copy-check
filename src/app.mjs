import { analyze } from "./core.mjs";

const copy = document.querySelector("#copy");
const allowProof = document.querySelector("#allow-proof");
const button = document.querySelector("#check");
const result = document.querySelector("#result");

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[character]);
}

function render(report) {
  result.hidden = false;
  if (report.status === "empty") {
    result.innerHTML = "<h2>Add some copy to review.</h2>";
    return;
  }
  const findings = report.groups.length
    ? report.groups.map((group) => "<li><strong>" + escapeHtml(group.title) + "</strong><br>" + group.hits.slice(0, 3).map((hit) => "“" + escapeHtml(hit.text) + "”").join(" · ") + (group.advisory ? " <em>Review only</em>" : "") + "</li>").join("")
    : "<li>No configured patterns found. Read it aloud before you ship it.</li>";
  result.innerHTML = "<p class='score'>" + report.score + "<span>/5</span></p><h2>" + (report.status === "clean" ? "No configured patterns found." : "Review before publishing.") + "</h2><p>" + report.wordCount + " words checked locally.</p><ul>" + findings + "</ul>";
}

button.addEventListener("click", () => render(analyze(copy.value, { allowProof: allowProof.checked })));
copy.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") render(analyze(copy.value, { allowProof: allowProof.checked }));
});
