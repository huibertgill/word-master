document.addEventListener("DOMContentLoaded", function () {
 const chatInput = document.getElementById('chat-input');
 const sendButton = document.getElementById('send-button');
 const chatDisplay = document.getElementById('chat-display');
 const wordDisplay = document.getElementById('word-display');

 let currentWord = null;
 let unsplashData = null;

 let failCount = 0; // Zähler für Fehlversuche

 // Hole das aktuelle Wort vom Backend
 fetch('/random_word')
   .then(response => response.json())
   .then(data => {
     currentWord = data.word;
     failCount = 0; // Zähler zurücksetzen bei neuem Spiel

     const url = `/unsplash?query=${currentWord}`;
     fetch(url)
       .then(response => response.json())
       .then(data => {
         unsplashData = data;
         const imageUrl = `${unsplashData.urls.raw}&w=640&h=480&fit=max&q=100`;
         const img = document.createElement('img');
         img.src = imageUrl;
         wordDisplay.innerHTML = '';
         wordDisplay.appendChild(img);
         // Fetch AI-generated image description by sending the actual image URL
         fetch('/describe', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ image_url: imageUrl })
         })
         .then(res => res.json())
         .then(descData => {
           const descText = descData.description || '';
           const p = document.createElement('p');
           p.classList.add('image-description');
           p.innerText = descText;
           wordDisplay.appendChild(p);
         })
         .catch(err => console.error('Error fetching image description:', err));
       })
       .catch(error => {
         console.error('Error fetching image from Unsplash:', error);
         wordDisplay.innerText = currentWord;
       });
   })
   .catch(error => {
     console.error('Fehler beim Laden des Wortes:', error);
     wordDisplay.innerText = 'Fehler beim Laden des Wortes';
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
  
   if (message.toLowerCase() === currentWord.toLowerCase()) {
    displayMessage('ai', 'Glückwunsch, das ist korrekt!');
    failCount = 0; // Zähler zurücksetzen bei korrekter Lösung
   } else {
    failCount++;
    if (failCount >= 4) {
      displayMessage('ai', 'Das richtige Wort war: ' + currentWord);
      failCount = 0;
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
        if (data.choices && data.choices.length > 0) {
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