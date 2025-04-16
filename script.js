let words = [
 "Wednesday",
 "Pneumonia",
 "Queue",
 "Island",
 "Receipt",
 "Yacht",
 "Scissors",
 "Pharmacy",
 "Neighbor",
 "Restaurant",
 "February",
 "Knee",
 "Knife",
 "Ocean",
 "Banana",
 "Bicycle",
 "Giraffe",
 "Chocolate",
 "Breakfast",
 "Weight"
];

document.addEventListener("DOMContentLoaded", function() {
 const wordDisplay = document.getElementById('word-display');
 const userInput = document.getElementById('user-input');
 const checkButton = document.getElementById('check-button');
 const resultDiv = document.getElementById('result');

 let currentWord = words[Math.floor(Math.random() * words.length)];
const accessKey = '';
const url = `https://api.unsplash.com/search/photos?client_id=${accessKey}&query=${currentWord}`;
fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.results.length > 0) {
      const imageUrl = data.results[0].urls.regular;
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

 checkButton.addEventListener('click', function() {
 if (userInput.value.toLowerCase() === currentWord.toLowerCase()) {
 resultDiv.innerText = 'Richtig!';
 } else {
 resultDiv.innerText = `Falsch. Das richtige Wort war ${currentWord}.`;
 }
 });
});