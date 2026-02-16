const generateBtn = document.getElementById('generate');
const numbersDiv = document.getElementById('numbers');
const themeToggleBtn = document.getElementById('toggle-theme'); // Updated ID

function getColorClass(number) {
  if (number <= 10) return 'color-band-1';
  if (number <= 20) return 'color-band-2';
  if (number <= 30) return 'color-band-3';
  if (number <= 40) return 'color-band-4';
  return 'color-band-5';
}

function updateThemeToggleButtonText() {
  if (document.body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = '화이트모드'; // White Mode
  } else {
    themeToggleBtn.textContent = '다크모드'; // Dark Mode
  }
}

// Lotto number generation
generateBtn.addEventListener('click', () => {
  const lottoNumbers = new Set();

  while (lottoNumbers.size < 6) {
    const randomNumber = Math.floor(Math.random() * 45) + 1;
    lottoNumbers.add(randomNumber);
  }

  const sortedNumbers = Array.from(lottoNumbers).sort((a, b) => a - b);

  numbersDiv.innerHTML = ''; // Clear previous numbers
  sortedNumbers.forEach(number => {
    const numberCircle = document.createElement('div');
    numberCircle.classList.add('number-circle', getColorClass(number));
    numberCircle.textContent = number;
    numbersDiv.appendChild(numberCircle);
  });
});

// Theme toggle functionality
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  
  // Save theme preference to localStorage
  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
  updateThemeToggleButtonText(); // Update button text after toggling
});

// Apply saved theme on page load
(function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  updateThemeToggleButtonText(); // Set initial button text
})();

// Disqus comments loading
var disqus_config = function () {
  this.page.url = window.location.href;
  this.page.identifier = 'lotto-generator-page';
};

(function() { // DON'T EDIT BELOW THIS LINE
  var d = document, s = d.createElement('script');
  s.src = 'https://product-builder-a57sshtpbn.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();


// Teachable Machine Animal Face Test Logic
const tmModelURL = 'https://teachablemachine.withgoogle.com/models/4J1XiLKgo/';
let model, labelContainer, maxPredictions;

async function initTM() {
    const modelURL = tmModelURL + 'model.json';
    const metadataURL = tmModelURL + 'metadata.json';

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    labelContainer = document.getElementById('label-container');
}
initTM();

const imageUpload = document.getElementById('image-upload');
const imagePreviewContainer = document.getElementById('image-preview-container');
const imagePreview = document.getElementById('image-preview');
const predictButton = document.getElementById('predict-button');

imageUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreviewContainer.style.display = 'block';
      predictButton.style.display = 'block';
      labelContainer.innerHTML = ''; // Clear previous results
    };
    reader.readAsDataURL(file);
  }
});

predictButton.addEventListener('click', async () => {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(imagePreview);
    
    // Find the prediction with the highest probability
    let highestPrediction = { className: '', probability: 0 };
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = prediction[i];
        }
    }

    // Display the result
    let resultText = '';
    if (highestPrediction.className === "강아지") {
        resultText = "당신은 강아지상입니다! 멍멍!";
    } else if (highestPrediction.className === "고양이") {
        resultText = "당신은 고양이상입니다! 야옹~";
    } else {
        resultText = "결과를 판독할 수 없습니다.";
    }
    labelContainer.innerHTML = resultText;
});
