document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggleButton");
  const label = document.getElementById("toggleButtonLabel");

  const savedMode = localStorage.getItem("mode");

  if (savedMode === "dark") {
    document.body.classList.add("dark-mode");
    if (toggle) toggle.checked = true;
    if (label) label.textContent = "Light Mode"; // Clicking it would switch to light
  } else {
    if (label) label.textContent = "Dark Mode"; // Clicking it would switch to dark
  }

  if (toggle) {
    toggle.addEventListener("change", () => {
      const isDark = toggle.checked;
      document.body.classList.toggle("dark-mode", isDark);
      localStorage.setItem("mode", isDark ? "dark" : "light");
      if (label) label.textContent = isDark ? "Light Mode" : "Dark Mode";
    });
  }
});

fetch('/api/savescore', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, score })
})
.then(res => res.json())
.then(data => {
    const popup = document.getElementById('popupMessage');
    const text = document.getElementById('popupText');
    text.textContent = data.message || 'Score saved!';
    popup.style.display = 'block';
  
    loadLeaderboard();
    
    // Hide automatically after 2.5 seconds
    setTimeout(() => {
      popup.style.display = 'none';
    }, 2500);
  })
  