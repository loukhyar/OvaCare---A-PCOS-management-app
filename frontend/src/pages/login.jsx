import { useEffect, useState } from "react";
import "../styles/styles.css";

function Login() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    /* Load Google script */
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    /* Global callback (IMPORTANT) */
    window.handleCredentialResponse = async (response) => {
      const id_token = response.credential;

      try {
        const res = await fetch("http://ovacare.duckdns.org/verify-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: id_token }),
        });

        const data = await res.json();

        if (data.email) {
          setMessage(`✅ Logged in as ${data.email}`);
          localStorage.setItem("userEmail", data.email);
          localStorage.setItem("userName", data.name);

          window.location.href = "/home"; // go to home
        } else {
          setMessage(`❌ Login failed`);
        }
      } catch (err) {
        setMessage(`❌ Error: ${err.message}`);
      }
    };
  }, []);

  return (
    <main className="login-main">
      <div className="login-container">
        <div className="app-name">OvaCare</div>
        <div className="tagline">
          Empowering your cycle, your care, your choice 💖
        </div>

        {/* Google Sign In */}
        <div
          id="g_id_onload"
          data-client_id="476303882358-l5r21fd2iretal5pc6qmgga8drll0r8q.apps.googleusercontent.com"
          data-context="signin"
          data-callback="handleCredentialResponse"
          data-auto_prompt="false"
        ></div>

        <div
          className="g_id_signin"
          data-type="standard"
          data-theme="outline"
          data-size="large"
        ></div>

        <p>{message}</p>
      </div>
    </main>
  );
}

export default Login;