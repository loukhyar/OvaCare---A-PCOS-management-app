document.addEventListener("DOMContentLoaded", function () {
  // Event listener for register button
  const registerButton = document.getElementById("registerButton");
  if (registerButton) {
    registerButton.addEventListener("click", registerUser);
  }

  // Event listener for login button
  const loginButton = document.getElementById("loginButton");
  if (loginButton) {
    loginButton.addEventListener("click", login);
  }

  // Event listener for forgot password link
  const forgotPasswordLink = document.getElementById("forgotPasswordLink");
  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener("click", openForgotPassword);
  }
});

async function registerUser() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!name || !email || !password) {
    showToast("Please fill out all fields.", "error");
    return;
  }

  const userData = {
    username: email,  // Ensure this matches backend `email`
    password: password,
  };

  try {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result = await response.json();
    if (response.ok) {
      showToast("User registered successfully! Please login.", "success");
    } else {
      showToast(result.error, "error");
    }
  } catch (error) {
    console.error("Error registering user:", error);
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showToast("Please enter email and password.", "error");
    return;
  }

  const loginData = {
    username: email,
    password: password,
  };

  try {
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    const result = await response.json();
    if (response.ok) {
      showToast("Login successful!", "success");
      localStorage.setItem("token", result.access_token);
      window.location.href = "index.html"; // Redirect after success
    } else {
      showToast(result.error, "error");
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}


// Function to open the Forgot Password modal
function openForgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "block";
}

// Function to close the Forgot Password modal
function closeForgotPasswordModal() {
  document.getElementById("forgotPasswordModal").style.display = "none";
}

// Function to send OTP
function sendOTP() {
  const email = document.getElementById("forgotEmail").value;
  
  if (email) {
    // Simulating OTP send (Replace with backend API call)
    alert("OTP sent to " + email);
    document.getElementById("otpSection").style.display = "block";
  } else {
    alert("Please enter your email address.");
  }
}

// Function to verify OTP
function verifyOTP() {
  const otp = document.getElementById("otp").value;
  
  if (otp === "123456") { // Simulating OTP verification (Replace with backend logic)
    alert("OTP verified! You can now reset your password.");
    closeForgotPasswordModal();
  } else {
    alert("Invalid OTP. Try again.");
  }
}

// Ensure event listeners are attached after the page loads
window.onload = function () {
  document.querySelector(".login-section p a").addEventListener("click", openForgotPassword);
};

async function requestOTP() {
  const email = document.getElementById("forgotEmail").value;

  if (!email) {
      alert("Please enter your email.");
      return;
  }

  try {
      const response = await fetch("http://localhost:5000/request-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
      });

      const result = await response.json();
      alert(result.message);
  } catch (error) {
      console.error("Error requesting OTP:", error);
  }
}

async function verifyOTP() {
  const email = document.getElementById("forgotEmail").value;
  const otp = document.getElementById("otp").value;

  if (!email || !otp) {
      alert("Please enter email and OTP.");
      return;
  }

  try {
      const response = await fetch("http://localhost:5000/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp })
      });

      const result = await response.json();
      if (response.ok) {
          alert(result.message);
      } else {
          alert(result.error);
      }
  } catch (error) {
      console.error("Error verifying OTP:", error);
  }
}

async function resetPassword() {
  const email = document.getElementById("forgotEmail").value;
  const otp = document.getElementById("otp").value;
  const newPassword = document.getElementById("newPassword").value;

  if (!email || !otp || !newPassword) {
      alert("All fields are required.");
      return;
  }

  try {
      const response = await fetch("http://localhost:5000/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, new_password: newPassword })
      });

      const result = await response.json();
      if (response.ok) {
          alert(result.message);
          window.location.href = "login.html"; // Redirect to login page
      } else {
          alert(result.error);
      }
  } catch (error) {
      console.error("Error resetting password:", error);
  }
}

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.innerText = message;

  toastContainer.appendChild(toast);

  // Remove toast after 4 seconds
  setTimeout(() => {
      toast.remove();
  }, 4000);
}


