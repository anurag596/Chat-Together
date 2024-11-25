const socket = io('http://localhost:3000'); 

const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const chatMessages = document.getElementById('chat-messages');


sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message.trim()) {
        socket.emit('chatMessage', message);
        addMessageToChat('You', message, 'user-message');
        messageInput.value = '';
    }
});


function addMessageToChat(sender, message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = `${sender}: ${message}`;
    messageDiv.classList.add(className);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

socket.on('chatMessage', ({ sender, message }) => {
    addMessageToChat(sender, message, 'other-message');
});
