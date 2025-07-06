document.addEventListener('DOMContentLoaded', function() {
    const predictionForm = document.getElementById('predictionForm');
    const resultContainer = document.getElementById('predictionResult');
  
    // Hide the result container initially
    resultContainer.style.display = 'none';
  
    predictionForm.addEventListener('submit', function(event) {
      event.preventDefault();
      
      const age = document.getElementById('age').value;
      const bmi = parseFloat(document.getElementById('bmi').value);
  
      let resultText = '';
  
      if (isNaN(bmi) || bmi <= 0) {
        resultText = 'Invalid BMI';
      } else if (bmi < 19) {
        resultText = 'Underweight';
      } else if (bmi >= 19 && bmi <= 24) {
        resultText = 'Normal weight';
      } else if (bmi >= 25 && bmi <= 29) {
        resultText = 'Overweight';
      } else if (bmi >= 30 && bmi <= 39) {
        resultText = 'Obesity';
      } else if (bmi >= 40) {
        resultText = 'Severe obesity';
      } else {
        resultText = 'Invalid BMI';
      }
  
      resultContainer.innerHTML = `For age ${age}, your BMI indicates: ${resultText}`;
      resultContainer.style.display = 'block'; // Show the result container
    });
  });
  