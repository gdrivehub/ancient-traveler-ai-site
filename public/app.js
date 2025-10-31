const form = document.getElementById('chat-form');
});
timestamp.appendChild(copyBtn);
}


msg.appendChild(avatar);
msg.appendChild(bubble);


const meta = document.createElement('div');
meta.appendChild(timestamp);
msg.appendChild(meta);


messages.appendChild(msg);
messages.scrollTop = messages.scrollHeight;


if (animated && who === 'bot') {
typeText(bubble, text);
} else {
bubble.textContent = text;
}
}


function typeText(el, text, speed=20) {
let i = 0;
const interval = setInterval(() => {
el.textContent += text[i];
i++;
if (i >= text.length) clearInterval(interval);
}, speed);
}


form.addEventListener('submit', async (e) => {
e.preventDefault();
const text = input.value.trim();
if (!text) return;


appendMessage(text, 'user');
input.value = '';
appendMessage('Thinking...', 'bot');


try {
const res = await fetch('/.netlify/functions/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ message: text })
});


const temp = Array.from(messages.querySelectorAll('.msg.bot')).pop();
if (temp && temp.querySelector('.bubble').textContent === 'Thinking...') temp.remove();


if (!res.ok) {
const txt = await res.text();
appendMessage('Error: ' + txt, 'bot');
return;
}


const json = await res.json();
const reply = json.reply || 'No answer';
appendMessage(reply, 'bot', true);
} catch (err) {
appendMessage('Error: ' + err.message, 'bot');
}
});


input.addEventListener('keydown', (e) => {
if (e.key === 'Enter' && !e.shiftKey) {
e.preventDefault();
form.requestSubmit();
}
});
