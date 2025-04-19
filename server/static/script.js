document.addEventListener("DOMContentLoaded", function () {
 const chatInput = document.getElementById('chat-input');
 const sendButton = document.getElementById('send-button');
 const chatDisplay = document.getElementById('chat-display');
 const wordDisplay = document.getElementById('word-display');
 const spinner = document.getElementById('spinner');

 let currentWord = null;
 let unsplashData = null;
 let imageDescription = null; // Zwischenspeicher für die Bildbeschreibung

 let failCount = 0; // Zähler für Fehlversuche
 let chatHistory = []; // Array zur Speicherung des Gesprächsverlaufs
 let guessedWords = []; // Array zur Speicherung der geratenen Wörter

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
           imageDescription = descText; // Bildbeschreibung zwischenspeichern
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

  // KI-Bildbeschreibung abrufen und alt_description ggf. überschreiben
  // KEIN weiterer Request an /describe, sondern zwischengespeicherte Beschreibung verwenden
  if (imageDescription) {
    imageData.alt_description = imageDescription;
  }
 
  if (message) {
   displayMessage('user', message);
  
   if (message.toLowerCase() === currentWord.toLowerCase()) {
    displayMessage('ai', 'Glückwunsch, das ist korrekt!');
    failCount = 0; // Zähler zurücksetzen bei korrekter Lösung

    // Countdown-Overlay einblenden und Seite nach 5 Sekunden neu laden
    const countdownOverlay = document.getElementById('countdown-overlay');
    let countdown = 5;
    if (countdownOverlay) {
      countdownOverlay.style.display = 'flex';
      countdownOverlay.textContent = `Glückwunsch das war richtig! \n\n\nNeue Augabe in ${countdown} Sekunden...`;
      const interval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
          countdownOverlay.textContent = `Neustart in ${countdown} Sekunden...`;
        } else {
          clearInterval(interval);
          countdownOverlay.textContent = 'Seite wird neu geladen...';
          setTimeout(() => {
            location.reload();
          }, 500);
        }
      }, 1000);
    }
   } else {
   failCount++;
   // Geratenes Wort zur Liste hinzufügen, wenn es falsch ist und nicht das letzte Wort ist
   if (failCount < 4) {
     guessedWords.push(message);
   }

   if (failCount >= 4) {
     displayMessage('ai', 'Das richtige Wort war: ' + currentWord);
     failCount = 0;
     guessedWords = []; // Geratene Wörter zurücksetzen
     chatHistory = []; // Gesprächsverlauf zurücksetzen
   } else {
     try {
       spinner.style.display = 'block';
       const response = await fetch('/ai_chat', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json'
         },
         body: JSON.stringify({
           user_input: message,
           image_info: imageData,
           chat_history: chatHistory, // Gesprächsverlauf hinzufügen
           guessed_words: guessedWords, // Geratene Wörter hinzufügen
           fail_count: failCount // Fehlerzähler hinzufügen
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
      } finally {
        spinner.style.display = 'none';
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

 // Nachricht zum Gesprächsverlauf hinzufügen
 chatHistory.push({ role: sender, content: message });
 }

 chatInput.addEventListener('keydown', function (event) {
 if (event.key === 'Enter') {
 sendButton.click();
 }
 });
  // Event-Listener für den "Hilfe"-Button, um die Bildbeschreibung anzuzeigen
  const helpButton = document.getElementById('help-button');
  if (helpButton) {
    helpButton.addEventListener('click', function () {
      const descElem = wordDisplay.querySelector('.image-description');
      if (descElem) {
        descElem.style.display = 'block';
      }
    });
  }
});