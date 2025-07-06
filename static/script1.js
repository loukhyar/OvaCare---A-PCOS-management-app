document.getElementById('submit-btn').addEventListener('click', function () {
  // Get the checked symptoms
  const symptoms = Array.from(document.querySelectorAll('input[name="symptoms"]:checked')).map(input => input.value);

  // Diagnosis condition based on the selected symptoms
  const missedPeriods = symptoms.includes("Missed periods, irregular periods, or very light periods");
  const acneOrOilySkin = symptoms.includes("Acne or oily skin");
  const largeOvaries = symptoms.includes("Ovaries that are large or have many cysts");
  const baldness = symptoms.includes("Male-pattern baldness or thinning hair");
  const infertility = symptoms.includes("Infertility");

  let isPCOS = false;
  let diagnosisMessage = ""; // To store the diagnosis message

  // Define the PCOS diagnosis conditions
  if (missedPeriods && (acneOrOilySkin && symptoms.length === 2)) {
    isPCOS = false;
  } else if (largeOvaries && baldness && infertility && (symptoms.length === 4 || symptoms.length === 5)) {
    isPCOS = true;
  } else if ((largeOvaries || baldness || infertility) && symptoms.length > 1) {
    isPCOS = true;
  }

  // Set the diagnosis message based on the symptoms
  if (isPCOS) {
    diagnosisMessage = "Based on your symptoms, you may have PCOS. Please consult a doctor.";
  } else {
    diagnosisMessage = "No significant PCOS symptoms detected. Keep monitoring.";
  }

  // Display the diagnosis in the content box
  document.getElementById('diagnosis-results').innerHTML = `<h3>Diagnosis Result:</h3><p>${diagnosisMessage}</p>`;
});

document.getElementById('upload-submit-btn').addEventListener('click', () => {
  const fileInput = document.getElementById('sonography-file');
  const file = fileInput.files[0];

  if (!file) {
    // Simply update the content box instead of showing toast
    document.getElementById('diagnosis-results').innerHTML = `<h3>Diagnosis Result:</h3><p>Please select a file to upload!</p>`;
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  fetch('http://127.0.0.1:5000/upload', {
    method: 'POST',
    body: formData,
    headers: { "Accept": "application/json" }
  })
  .then(response => response.json())
  .then(data => {
    console.log("🚀 Server Response:", data); // Debugging log
    console.log("🟢 pcos_infected value:", data.pcos_infected);
    
    let predictionMessage;

    if (data.error) {
        predictionMessage = `Error: ${data.error}`;
    } else {
        // 🔍 Ensure pcos_infected is treated as an integer
        let predictedClass = Number(data.pcos_infected); 
        console.log("🔵 Parsed Predicted Class:", predictedClass);

        if (predictedClass === 0) {  
          predictionMessage = "More likely to have PCOS based on sonography.";
      } else if (predictedClass === 1) {  
          predictionMessage = "Less likely to have PCOS based on sonography.";
      } else {
          predictionMessage = "Unable to determine PCOS status.";
      }

    }

    // Update the result on the frontend in the content box
    document.getElementById('diagnosis-results').innerHTML = `<h3>Diagnosis Result:</h3><p>${predictionMessage}</p>`;
  })
  .catch(error => {
    // Display error in the content box
    document.getElementById('diagnosis-results').innerHTML = `<h3>Diagnosis Result:</h3><p>An error occurred: ${error.message}</p>`;
  });
});