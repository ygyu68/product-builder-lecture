const URL = "https://teachablemachine.withgoogle.com/models/4J1XiLKgo/"; // Provided by user
let model, labelContainer, maxPredictions;
let uploadedImage = null; // To store the uploaded image element

const imageUploadInput = document.getElementById('image-upload');
const startTestButton = document.getElementById('start-test-button');
const imagePreviewContainer = document.getElementById('image-preview-container');
labelContainer = document.getElementById('label-container');


// Function to load the model
async function init() {
    startTestButton.disabled = true; // Disable button while loading
    labelContainer.innerHTML = "AI 모델 로딩 중... (Loading AI Model...)";

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        labelContainer.innerHTML = "모델 준비 완료! 이미지를 업로드해주세요. (Model Ready! Please upload an image.)";
    } catch (error) {
        console.error("Error loading model:", error);
        labelContainer.innerHTML = "모델을 불러오는 데 실패했습니다. (Failed to load model.)";
    }
}

// Predict function to run the uploaded image through the model
async function predict() {
    if (!model || !uploadedImage) {
        labelContainer.innerHTML = "이미지를 업로드하고 모델을 로드해주세요. (Please upload an image and load the model.)";
        return;
    }

    labelContainer.innerHTML = "결과 분석 중... (Analyzing results...)";
    const prediction = await model.predict(uploadedImage);
    
    let highestPrediction = { className: '', probability: 0 };
    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestPrediction.probability) {
            highestPrediction = prediction[i];
        }
    }

    let resultText = '';
    // Adapt result to Korean messages
    if (highestPrediction.className.includes("강아지")) {
        resultText = `당신은 강아지상입니다! 멍멍! (${(highestPrediction.probability * 100).toFixed(2)}%)`;
    } else if (highestPrediction.className.includes("고양이")) {
        resultText = `당신은 고양이상입니다! 야옹~ (${(highestPrediction.probability * 100).toFixed(2)}%)`;
    } else {
        resultText = `결과를 판독할 수 없습니다. (${highestPrediction.className}: ${(highestPrediction.probability * 100).toFixed(2)}%)`;
    }
    labelContainer.innerHTML = resultText;
}

// Event listener for file upload
imageUploadInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Clear previous image and prediction
            imagePreviewContainer.innerHTML = '';
            labelContainer.innerHTML = '';

            uploadedImage = new Image();
            uploadedImage.src = e.target.result;
            uploadedImage.onload = () => {
                // Resize image to 200x200 if it's not already
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 200;
                canvas.height = 200;
                ctx.drawImage(uploadedImage, 0, 0, 200, 200);
                
                // Replace uploadedImage with the canvas to ensure correct dimensions for the model
                uploadedImage = canvas; 
                imagePreviewContainer.appendChild(uploadedImage); // Append the canvas for preview

                startTestButton.disabled = false; // Enable the test button
                labelContainer.innerHTML = "이미지 업로드 완료! '결과 확인' 버튼을 눌러주세요.";
            };
        };
        reader.readAsDataURL(file);
    } else {
        startTestButton.disabled = true;
        imagePreviewContainer.innerHTML = '<p>사진을 업로드하면 여기에 표시됩니다.</p>';
        labelContainer.innerHTML = "이미지를 업로드해주세요.";
    }
});

// Event listener for the start test button
startTestButton.addEventListener('click', predict);

// Initialize the model when the page loads
init();
