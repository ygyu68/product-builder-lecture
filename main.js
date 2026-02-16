const generateBtn = document.getElementById('generate');
const numbersDiv = document.getElementById('numbers');
const themeToggleBtn = document.getElementById('theme-toggle');

function getColorClass(number) {
  if (number <= 10) return 'color-band-1';
  if (number <= 20) return 'color-band-2';
  if (number <= 30) return 'color-band-3';
  if (number <= 40) return 'color-band-4';
  return 'color-band-5';
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
});

// Apply saved theme on page load
(function () {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
})();
