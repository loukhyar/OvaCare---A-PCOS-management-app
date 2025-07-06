document.addEventListener("DOMContentLoaded", () => {
    const checkBenefitsButton = document.getElementById("checkBenefitsButton");
    const modal = document.getElementById("benefitsModal");
    const closeModal = document.getElementsByClassName("close")[0];
    const benefitsContent = document.getElementById("benefitsContent");
  
    const benefits = {
      catCow: "Improves flexibility of the spine and reduces tension in the shoulders, neck, and chest.",
      childsPose: "Calms the brain and helps relieve stress and fatigue.",
      butterflyPose: "Opens the hips and stretches the inner thighs.",
      garlandPose: "Stretches the ankles, groins, and back.",
      cobraPose: "Strengthens the spine and stretches the chest and lungs.",
      bridgePose: "Stretches the chest, neck, and spine.",
      legsUpWall: "Relieves tired or cramped legs and feet, gently stretches the back legs, front torso, and the back of the neck.",
      seatedForwardBend: "Stretches the spine, shoulders, and hamstrings.",
      recliningBoundAngle: "Stimulates abdominal organs like the ovaries and prostate gland, bladder, and kidneys.",
      pigeonPose: "Stretches the thighs, groins, back, and psoas.",
      spinalTwist: "Increases flexibility in the spine and may help to detoxify the internal organs.",
      warrior2: "Strengthens and stretches the legs and ankles, increases stamina.",
      trianglePose: "Stretches the legs, groins, hamstrings, and hips, and opens the chest and shoulders.",
      boatPose: "Strengthens the abdomen, hip flexors, and spine.",
      camelPose: "Stretches the entire front of the body, the ankles, thighs, groins, abdomen, chest, and throat.",
      happyBaby: "Gently stretches the inner groins and the back spine.",
      corpsePose: "Calms the brain and helps relieve stress and mild depression."
    };
  
    checkBenefitsButton.addEventListener("click", () => {
      benefitsContent.innerHTML = "";
      const selectedPoses = document.querySelectorAll("input[type='checkbox']:checked");
      if (selectedPoses.length > 0) {
        selectedPoses.forEach(pose => {
          const benefitSlide = document.createElement("div");
          benefitSlide.className = "benefit-slide";
          benefitSlide.innerHTML = `
            <h3>${document.querySelector(`label[for='${pose.id}'] h3`).innerText}</h3>
            <p>${benefits[pose.id]}</p>
          `;
          benefitsContent.appendChild(benefitSlide);
        });
        modal.style.display = "block";
      } else {
        alert("Please select at least one pose to check benefits.");
      }
    });
  
    closeModal.onclick = function() {
      modal.style.display = "none";
    };
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    };
  });
  