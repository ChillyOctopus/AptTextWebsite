//Initialize websocket functionality
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

async function loadChat(){
  let chat = [];

  // Get the apartments from the service
  const response = await fetch('/api/chat');
  chat = await response.json();

  displayChat(chat);
}

async function displayChat(chat){

  const userObj = await fetch('/api/username');
  var userJson = await userObj.json();
  var username = userJson.username;

  for(const obj of chat){
    if(obj.speaker === "ai"){
      addBubble(createAIChatBubble(obj.message));
    } else if(obj.speaker === username){
      addBubble(createUserChatBubble(obj.message));
    } else {
      addBubble(createRandoChatBubble(obj.speaker, obj.message));
    }
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const textArea = document.getElementById('textAreaExample');  
  
  const userObj = await fetch('/api/username');
  var userJson = await userObj.json();
  var username = userJson.username;
  
  textArea.addEventListener('keydown', async function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents a newline from being added

      // Get the message from the textarea
      const message = textArea.value.trim();

      if (message) {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({speaker:username, message:message}),
        });

        addBubble(createUserChatBubble(message));
        sendMessageOverWebsocket(username, message);

      }

      // Clear the textarea
      textArea.value = '';
      // Scroll to the bottom of the chat body
      scrollChatToBottom();

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

function createRandoChatBubble(speaker, message){
  const chatBubble = document.createElement('div');
  chatBubble.className = 'd-flex flex-row justify-content-start mb-4';

  const chatMessage = document.createElement('div');
  chatMessage.className = 'p-3 ms-3'
  chatMessage.style.borderRadius = '15px'
  chatMessage.style.backgroundColor = 'rgba(57, 192, 237, .2)';
  chatMessage.innerHTML = '<p class="small mb-0">' + speaker + ': ' + message + '</p>';

  const randoAvatar = document.createElement('img')    
  randoAvatar.src = '/assets/randoLogo.png'; // Replace with the rando's avatar image URL
  randoAvatar.alt = speaker;
  randoAvatar.style.width = '45px';
  randoAvatar.style.height = '100%';
  randoAvatar.style.marginTop = '7px';
  randoAvatar.style.padding = '3px';

  chatBubble.appendChild(randoAvatar);
  chatBubble.appendChild(chatMessage);

  return chatBubble;
}

function addBubble(chatBubble){
  const chatBody = document.getElementById('chat1');
  chatBody.appendChild(chatBubble);
  return chatBubble;
}

function sendMessageOverWebsocket(speaker, message) {
  if (!!message) {
    socket.send(JSON.stringify({speaker:speaker, message:message}));
  }
}

socket.onmessage = async (event) => {
  const data = await JSON.parse(event.data);
  addBubble(createRandoChatBubble(data.speaker, data.message));
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({speaker:data.speaker, message:data.message}),
  });
};

loadChat();