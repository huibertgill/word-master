document.addEventListener("DOMContentLoaded", function () {
 const chatInput = document.getElementById('chat-input');
 const sendButton = document.getElementById('send-button');
 const chatDisplay = document.getElementById('chat-display');
 const wordDisplay = document.getElementById('word-display');

 let words = ["Wednesday", "Pneumonia", "Queue", "Island", "Receipt", "Yacht", "Scissors", "Pharmacy", "Neighbor", "Restaurant", "February", "Knee", "Knife", "Ocean", "Banana", "Bicycle", "Giraffe", "Chocolate", "Breakfast", "Weight"];
 let currentWord = words[Math.floor(Math.random() * words.length)];
 let unsplashData = null;
 const url = `/unsplash?query=${currentWord}`;
 fetch(url)
 .then(response => response.json())
 .then(data => {
 if (data.results && data.results.length >0) {
 const randomIndex = Math.floor(Math.random() * data.results.length);
 unsplashData = data.results[randomIndex];
 const imageUrl = `${unsplashData.urls.raw}&w=640&h=480&fit=max&q=100`;
 const img = document.createElement('img');
 img.src = imageUrl;
 wordDisplay.innerHTML = '';
 wordDisplay.appendChild(img);
 } else {
 wordDisplay.innerText = currentWord;
 }
 })
 .catch(error => {
 console.error('Error fetching image from Unsplash:', error);
 wordDisplay.innerText = currentWord;
 });

 sendButton.addEventListener('click', async function () {
  const message = chatInput.value.trim();
  const imageData = {
  word: currentWord,
  title: unsplashData ? unsplashData.alt_description : '',
  description: unsplashData ? unsplashData.description : '',
  alt_description: unsplashData ? unsplashData.alt_description : ''
  };
 
  if (message) {
   displayMessage('user', message);
  
   if (message === currentWord) {
   displayMessage('ai', 'Glückwunsch, das ist korrekt!');
   } else {
   try {
   const response = await fetch('/ai_chat', {
   method: 'POST',
   headers: {
   'Content-Type': 'application/json'
   },
   body: JSON.stringify({
   user_input: message,
   image_info: imageData
   })
   });
  
   const data = await response.json();
   if (data.choices && data.choices.length >0) {
   const aiResponse = data.choices[0].message.content;
   displayMessage('ai', aiResponse);
   } else {
   displayMessage('ai', 'Entschuldigung, ich konnte nicht antworten.');
   }
   } catch (error) {
   console.error('Fehler beim Senden der Anfrage:', error);
   displayMessage('ai', 'Ein Fehler ist aufgetreten.');
   }
   }
  
   chatInput.value = '';
  }
 });

 function displayMessage(sender, message) {
 const messageElement = document.createElement('div');
 messageElement.classList.add('message', sender);
 messageElement.innerText = message;
 chatDisplay.appendChild(messageElement);
 chatDisplay.scrollTop = chatDisplay.scrollHeight;
 }

 chatInput.addEventListener('keydown', function (event) {
 if (event.key === 'Enter') {
 sendButton.click();
 }
 });
});