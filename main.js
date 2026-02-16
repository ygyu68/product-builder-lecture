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
const URL = "https://teachablemachine.withgoogle.com/models/4J1XiLKgo/"; // Provided by user
let model, webcam, labelContainer, maxPredictions;
const startWebcamButton = document.getElementById('start-webcam-button');

// Function to initialize the webcam and load the model
async function init() {
    startWebcamButton.disabled = true; // Disable button while loading
    labelContainer = document.getElementById('label-container');
    labelContainer.innerHTML = "AI 모델 및 웹캠 로딩 중... (Loading AI Model and Webcam...)";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        // Convenience function to setup a webcam
        const flip = true; // whether to flip the webcam
        webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
        await webcam.setup(); // request access to the webcam
        await webcam.play();
        window.requestAnimationFrame(loop);

        // append elements to the DOM
        document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer.innerHTML = "웹캠 준비 완료! (Webcam Ready!)";
    } catch (error) {
        console.error("Error loading model or setting up webcam:", error);
        labelContainer.innerHTML = "모델 또는 웹캠을 불러오는 데 실패했습니다. (Failed to load model or webcam.)";
        startWebcamButton.disabled = false; // Re-enable button to try again
    }
}

// Loop function to continuously update webcam and predict
async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// Predict function to run the webcam image through the model
async function predict() {
    if (!model || !webcam || !webcam.canvas) {
        // Model or webcam not ready yet
        return;
    }
    const prediction = await model.predict(webcam.canvas);
    
    let highestPrediction = { className: '', probability: 0 };
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = prediction[i];
        }
    }

    let resultText = '';
    // Adapt result to Korean messages
    if (highestPrediction.className.includes("강아지")) { // Check for "강아지" within the class name
        resultText = `당신은 강아지상입니다! 멍멍! (${(highestPrediction.probability * 100).toFixed(2)}%)`;
    } else if (highestPrediction.className.includes("고양이")) { // Check for "고양이" within the class name
        resultText = `당신은 고양이상입니다! 야옹~ (${(highestPrediction.probability * 100).toFixed(2)}%)`;
    } else {
        resultText = `결과를 판독할 수 없습니다. (${highestPrediction.className}: ${(highestPrediction.probability * 100).toFixed(2)}%)`;
    }
    labelContainer.innerHTML = resultText;
}

// Event listener for the start button
startWebcamButton.addEventListener('click', init);
