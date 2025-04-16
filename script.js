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

document.addEventListener("DOMContentLoaded", function () {
    const wordDisplay = document.getElementById('word-display');
    const userInput = document.getElementById('user-input');
    const checkButton = document.getElementById('check-button');
    const resultDiv = document.getElementById('result');

    let currentWord = words[Math.floor(Math.random() * words.length)];
    let unsplashData = null; // Unsplash-Daten speichern
    const accessKey = '';
    const url = `/unsplash?query=${currentWord}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.results.length);
                unsplashData = data.results[randomIndex]; // Zufälliges Bild speichern
                const imageUrl = `${data.results[randomIndex].urls.raw}&w=640&h=480&fit=max&q=100`;
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

    userInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            checkInput();
        }
    });

    checkButton.addEventListener('click', checkInput);

    const newQuestionButton = document.getElementById('new-question-button');
    newQuestionButton.addEventListener('click', function () {
        location.reload();
    });

    function checkInput() {
        if (userInput.value.toLowerCase() === currentWord.toLowerCase()) {
            resultDiv.innerText = 'Richtig!';
            const infoDiv = document.getElementById('unsplash-info');
            if (infoDiv) infoDiv.remove();
        } else {
            resultDiv.innerText = `Falsch. Das richtige Wort war ${currentWord}.`;
            const img = wordDisplay.querySelector('img');
            if (img && unsplashData) {
                const oldInfo = document.getElementById('unsplash-info');
                if (oldInfo) oldInfo.remove();
                const infoDiv = document.createElement('div');
                infoDiv.id = 'unsplash-info';
                infoDiv.style.marginTop = '12px';
                let html = '';
                if (unsplashData.alternative_slugs && unsplashData.alternative_slugs.en) {
                    let formattedSlug = unsplashData.alternative_slugs.en.replace(/-/g, ' ');
                    let slugWords = formattedSlug.split(' ');
                    slugWords.pop();
                    formattedSlug = slugWords.join(' ');
                    html += `<div><strong>Alternative Slug (en):</strong> ${formattedSlug}</div>`;
                }
                if (unsplashData.description) {
                    html += `<div><strong>Beschreibung:</strong> ${unsplashData.description}</div>`;
                }
                if (unsplashData.alt_description) {
                    html += `<div><strong>Alt-Beschreibung:</strong> ${unsplashData.alt_description}</div>`;
                }
                infoDiv.innerHTML = html;
                img.after(infoDiv);
            }
            
        }
    }
});