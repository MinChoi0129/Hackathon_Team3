document.getElementById('send-button').addEventListener('click', function() {
    var chatWindow = document.getElementById('chat-window');
    var chatInput = document.getElementById('chat-input');
    var message = chatInput.value;

    if (message.trim() !== '') {
        addMessage(message, 'sent-message');
        chatInput.value = '';
        // 임의의 수신 메시지를 추가하여 테스트
        setTimeout(function() {
            addMessage('임의의 수신 메시지입니다.', 'received-message');
        }, 1000);
    }
});

function addMessage(text, className) {
    var chatWindow = document.getElementById('chat-window');
    var messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', className);
    messageElement.textContent = text;
    chatWindow.insertBefore(messageElement, chatWindow.firstChild);
}
