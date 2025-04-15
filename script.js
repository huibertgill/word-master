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
 wordDisplay.innerText = currentWord;

 checkButton.addEventListener('click', function() {
 if (userInput.value.toLowerCase() === currentWord.toLowerCase()) {
 resultDiv.innerText = 'Richtig!';
 } else {
 resultDiv.innerText = `Falsch. Das richtige Wort war ${currentWord}.`;
 }
 });
});