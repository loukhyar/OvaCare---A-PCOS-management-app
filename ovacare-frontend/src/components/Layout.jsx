import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      
      {/* Header */}
      <header className="bg-pink-100 border-b border-pink-300 shadow-sm sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          <div className="text-4xl font-bold text-pink-700">
            OvaCare
          </div>

          <ul className="flex flex-col lg:flex-row flex-wrap gap-2 text-pink-900 font-medium">
            <li>
              <Link
                to="/"
                className="px-4 py-2 rounded-full hover:bg-pink-300 hover:text-white transition"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/about"
                className="px-4 py-2 rounded-full hover:bg-pink-300 hover:text-white transition"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/symptoms"
                className="px-4 py-2 rounded-full hover:bg-pink-300 hover:text-white transition"
              >
                Symptom Checker
              </Link>
            </li>

            <li>
              <Link
                to="/nutrition"
                className="px-4 py-2 rounded-full hover:bg-pink-300 hover:text-white transition"
              >
                Nutrition Guide
              </Link>
            </li>

            <li>
              <Link
                to="/period"
                className="px-4 py-2 rounded-full hover:bg-pink-300 hover:text-white transition"
              >
                Period Tracker
              </Link>
            </li>

            <li>
              <Link
                to="/mood"
                className="px-4 py-2 rounded-full hover:bg-pink-300 hover:text-white transition"
              >
                Mood Tracker
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-pink-100 text-center py-5 text-pink-800 font-medium">
        Made with 💖 by OvaCare Team — Keep shining!
      </footer>
    </div>
  );
}

export default Layout;