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
          // flip a coin to see if its the ai or us.
          const coin = flipCoin();
          if(coin){

            const chatBubble = createUserChatBubble(message);
            chatBody.appendChild(chatBubble);

          } else {
            const chatBubble = createAIChatBubble(message);
            chatBody.appendChild(chatBubble);
          }

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
  
  function createAIChatBubble(message){
    const chatBubble = document.createElement('div');
    chatBubble.className = 'd-flex flex-row justify-content-start mb-4';

    const chatMessage = document.createElement('div');
    chatMessage.className = 'p-3 ms-3'
    chatMessage.style.borderRadius = '15px'
    chatMessage.style.backgroundColor = 'rgba(57, 192, 237, .2)';
    chatMessage.innerHTML = '<p class="small mb-0">' + message + '</p>';

    const AIAvatar = document.createElement('img')    
    AIAvatar.src = '/assets/openAiLogo.png'; // Replace with the AI's avatar image URL
    AIAvatar.alt = 'AI Avatar';
    AIAvatar.style.width = '45px';
    AIAvatar.style.height = '100%';
    AIAvatar.style.marginTop = '7px';
    AIAvatar.style.padding = '3px';
  
    chatBubble.appendChild(AIAvatar);
    chatBubble.appendChild(chatMessage);
  
    return chatBubble;
  }

// Function to simulate flipping a coin
function flipCoin() {
    // Generate a random number between 0 and 1
    const randomValue = Math.random();

    // Use the random value to determine the result
    if (randomValue < 0.5) {
        return 1;
    } else {
        return 0;
    }
}