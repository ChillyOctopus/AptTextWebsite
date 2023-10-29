// Add this code to your assistant.js file

document.addEventListener('DOMContentLoaded', function() {
    const textArea = document.getElementById('textAreaExample');
    const chatBody = document.getElementById('chat1');
  
    textArea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault(); // Prevents a newline from being added
  
        // Get the message from the textarea
        const message = textArea.value.trim();
  
        if (message) {
          // Create a new chat bubble
          const chatBubble = document.createElement('div');
          chatBubble.className = 'd-flex flex-row justify-content-end mb-4';
          chatBubble.innerHTML = `
            <div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;">
              <p class="small mb-0">${message}</p>
            </div>
            <img src="/assets/spyglas.png" alt="avatar 1" style="width: 45px; height: 100%; margin-top: 7px; padding: 3px;">
          `;
  
          // Append the chat bubble to the chat body
          chatBody.appendChild(chatBubble);
  
          // Clear the textarea
          textArea.value = '';
  
          // Scroll to the bottom of the chat body
          scrollChatToBottom();
        }
      }
    });
  });
  
  function scrollChatToBottom() {
    var fullChatCard = document.getElementById("fullChatCard");
    fullChatCard.scrollTop = fullChatCard.scrollHeight;
    }

  
  function createUserChatBubble(message) {
    const chatBubble = document.createElement('div');
    chatBubble.className = 'd-flex flex-row justify-content-end mb-4';
  
    const chatMessage = document.createElement('div');
    chatMessage.className = 'p-3 me-3 border';
    chatMessage.style.borderRadius = '15px';
    chatMessage.style.backgroundColor = '#fbfbfb';
    chatMessage.innerHTML = '<p class="small mb-0">' + message + '</p>';
  
    const userAvatar = document.createElement('img');
    userAvatar.src = '/assets/spyglas.png'; // Replace with the user's avatar image URL
    userAvatar.alt = 'User Avatar';
    userAvatar.style.width = '45px';
    userAvatar.style.height = '100%';
    userAvatar.style.marginTop = '7px';
    userAvatar.style.padding = '3px';
  
    chatBubble.appendChild(chatMessage);
    chatBubble.appendChild(userAvatar);
  
    return chatBubble;
  }
  