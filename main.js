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

// Disqus comments loading (add this at the end of main.js)
var disqus_config = function () {
  this.page.url = window.location.href;  // Replace PAGE_URL with your page's canonical URL variable
  this.page.identifier = 'lotto-generator-page'; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
};

(function() { // DON'T EDIT BELOW THIS LINE
  var d = document, s = d.createElement('script');
  s.src = 'https://product-builder-a57sshtpbn.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
})();
