    import { Link } from "react-router-dom";

    function Sidebar() {
    return (
        <aside className="sidebar">
        <h2 className="logo">OvaCare</h2>
        <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/symptoms">Symptom Checker</Link></li>
            <li><Link to="/food">Nutrition Guide</Link></li>
            <li><Link to="/yoga">Mind & Movement</Link></li>
            <li><Link to="/period">Period Tracker</Link></li>
            <li><Link to="/login">Log Out</Link></li>
        </ul>
        </aside>
    );
    }

    export default Sidebar;