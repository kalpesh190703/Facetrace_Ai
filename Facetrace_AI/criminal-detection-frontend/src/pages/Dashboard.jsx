import "../assets/css/dashboard.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const lastSeenTimeRef = useRef(null);

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  useEffect(() => {
    const checkForNewDetections = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/detection-logs");
        const data = await res.json();

        data.sort((a, b) => new Date(b.time) - new Date(a.time));

        if (data.length === 0) return;

        
        if (!lastSeenTimeRef.current) {
          lastSeenTimeRef.current = data[0].time;
          return;
        }

    
        const newLogs = data.filter(
          log => new Date(log.time) > new Date(lastSeenTimeRef.current)
        );

        newLogs.forEach(log => {
          alert(
            ` ${log.category.toUpperCase()} DETECTED!\n\n` +
            ` Name: ${log.name}\n` +
            ` Location: ${log.location}\n` +
            ` Time: ${log.time}`
          );
        });

        if (newLogs.length > 0) {
          lastSeenTimeRef.current = data[0].time;
        }
      } catch (err) {
        console.error("Alert error:", err);
      }
    };

    checkForNewDetections();
    const interval = setInterval(checkForNewDetections, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="header">
        <h1>Facetrace AI</h1>
        <button className="logout-btn" onClick={handleLogout}>
           Logout
        </button>
      </div>

      <div className="dashboard-page">
        <div className="container">
          <div className="sidebar">
            <h2>Navigation</h2>
            <ul>
              <li><a href="/add"> Add Records</a></li>
              <li><a href="/live"> Live Feed</a></li>
              <li><a href="/records"> View Records</a></li>
              <li><a href="/logs">Detection Logs</a></li>
            </ul>
          </div>

          <div className="main-content">
            <div className="menu-grid">
              <div className="menu-item">
                <h2>Add Records</h2>
                <p>Add new person records</p>
                <a href="/add" className="btn">Add New</a>
              </div>

              <div className="menu-item">
                <h2>Live Monitoring</h2>
                <p>Real-time detection</p>
                <a href="/live" className="btn"> Start Monitoring</a>
              </div>

              <div className="menu-item">
                <h2>Database Records</h2>
                <p>View stored records</p>
                <a href="/records" className="btn"> View Records</a>
              </div>

              <div className="menu-item">
                <h2>Detection History</h2>
                <p>Review detection logs</p>
                <a href="/logs" className="btn">View Analytics</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
