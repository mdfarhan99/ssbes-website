document.addEventListener("DOMContentLoaded", function () {
    // Toggle Button (labeled "Chabot")
    const chatbotToggleButton = document.createElement("button");
    chatbotToggleButton.innerText = "Chabot";
    chatbotToggleButton.id = "chatbot-toggle";
    chatbotToggleButton.style.position = "fixed";
    chatbotToggleButton.style.bottom = "20px";
    chatbotToggleButton.style.right = "20px";
    chatbotToggleButton.style.background = "#0f0"; // Neon green
    chatbotToggleButton.style.color = "#000";
    chatbotToggleButton.style.padding = "10px 15px";
    chatbotToggleButton.style.border = "none";
    chatbotToggleButton.style.borderRadius = "5px";
    chatbotToggleButton.style.cursor = "pointer";
    document.body.appendChild(chatbotToggleButton);

    // Chatbot Container (Larger Size with Rounded Corners)
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    chatbotContainer.style.display = "none"; // Initially hidden
    chatbotContainer.style.position = "fixed";
    chatbotContainer.style.bottom = "60px";
    chatbotContainer.style.right = "20px";
    chatbotContainer.style.width = "500px";    // Increased width
    chatbotContainer.style.height = "400px";   // Increased height
    chatbotContainer.style.background = "#111";  // Dark background
    chatbotContainer.style.border = "2px solid #0f0"; // Neon border
    chatbotContainer.style.borderRadius = "15px";  // More rounded corners
    chatbotContainer.style.boxShadow = "0 4px 12px rgba(0, 255, 0, 0.2)"; // Neon glow
    chatbotContainer.style.overflow = "hidden";
    chatbotContainer.style.fontFamily = "monospace";

    // Chatbot Header with Title and a Close Icon
    chatbotContainer.innerHTML = `
        <div id="chatbot-header" style="background: #000; color: #0f0; padding: 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #0f0;">
            <div style="display: flex; align-items: center;">
                <img src="static/aibot.gif" alt="Bot" style="width:30px; height:30px; margin-right: 10px; border-radius:50%;">
                <div>
                    <div>Neon Chatbot</div>
                    <small style="font-size: 14px; color: #0f0;">What can I help with? Ask anything about college.</small>
                </div>
            </div>
            <div id="chatbot-close" style="cursor: pointer; font-size: 20px; color: #0f0;">✕</div>
        </div>
        <div id="chatbot-messages" style="height: 280px; overflow-y: auto; padding: 10px; background: #111;"></div>
        <div id="chatbot-input-area" style="display: flex; border-top: 2px solid #0f0;">
            <input type="text" id="chatbot-input" placeholder="Type a message..." style="flex: 1; padding: 10px; border: none; outline: none; background: #222; color: #0f0; font-size: 14px;">
            <button id="chatbot-send" style="background: #0f0; color: #000; border: none; padding: 0 15px; cursor: pointer;">Send</button>
        </div>
    `;
    document.body.appendChild(chatbotContainer);

    const chatbotMessages = document.getElementById("chatbot-messages");
    const chatbotInput = document.getElementById("chatbot-input");
    const chatbotSend = document.getElementById("chatbot-send");
    const chatbotClose = document.getElementById("chatbot-close");

    // Toggle chatbot visibility when clicking the toggle button
    chatbotToggleButton.addEventListener("click", function () {
        chatbotContainer.style.display = "block";
    });

    // Close chatbot when clicking the close icon in the header
    chatbotClose.addEventListener("click", function () {
        chatbotContainer.style.display = "none";
    });

    // Function to add a chat bubble (for both user and chatbot)
    function addChatBubble(content = "", align = "left", bgColor = "#ff1493") {
        const bubble = document.createElement("div");
        bubble.style.margin = "8px 0";
        bubble.style.textAlign = align;
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.background = bgColor;
        span.style.color = "#fff";
        span.style.padding = "8px 12px";
        span.style.borderRadius = "16px";
        span.style.maxWidth = "80%";
        span.style.wordWrap = "break-word";
        span.innerHTML = content;
        bubble.appendChild(span);
        chatbotMessages.appendChild(bubble);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        return span; // Return the span for further updates (for typewriter effect)
    }

    // Function to simulate typewriter effect on an element
    function typeWriter(element, text, delay = 50) {
        element.innerHTML = "";
        let i = 0;
        const interval = setInterval(() => {
            element.innerHTML += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(interval);
            }
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, delay);
    }

    // Function to send message to the Flask backend and display the response
    function sendMessage() {
        const userMessage = chatbotInput.value.trim();
        if (userMessage === "") return;
        
        // Append user's message as a right-aligned chat bubble (Neon Cyan)
        addChatBubble(`<strong>You:</strong> ${userMessage}`, "right", "#0ff");
        chatbotInput.value = "";

        // Append a "typing" indicator for a realistic delay effect
        const typingBubbleSpan = addChatBubble(`<strong>Chatbot:</strong> is typing...`, "left", "#ff1493");

        // Send the user message to the Flask backend using fetch
        fetch("/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            // Remove typing indicator by clearing its content and display the reply with typewriter effect
            typingBubbleSpan.innerHTML = "";
            typeWriter(typingBubbleSpan, `<strong>Chatbot:</strong> ${data.response}`, 50);
        })
        .catch(error => {
            console.error("Error:", error);
            typingBubbleSpan.innerHTML = `<strong>Error:</strong> Unable to fetch response.`;
        });
    }

    chatbotSend.addEventListener("click", sendMessage);
    chatbotInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });
});
