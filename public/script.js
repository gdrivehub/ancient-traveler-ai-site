const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("user-input");
const chatContainer = document.getElementById("chat-container");

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const userMessage = chatInput.value.trim();
  if (!userMessage) return;

  addMessage("user", userMessage);
  chatInput.value = "";

  try {
    const res = await fetch("/.netlify/functions/query", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage }),
    });

    const data = await res.json();
    if (data.reply) addMessage("bot", data.reply);
    else addMessage("bot", "⚠️ Sorry, I couldn’t get a reply from the ancient traveler.");
  } catch (err) {
    addMessage("bot", "❌ Error: Unable to reach the AI server.");
  }
});

function addMessage(role, text) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", role);
  msgDiv.innerHTML = `<p>${text}</p><span class="timestamp">${new Date().toLocaleTimeString()}</span>`;
  chatContainer.appendChild(msgDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}
