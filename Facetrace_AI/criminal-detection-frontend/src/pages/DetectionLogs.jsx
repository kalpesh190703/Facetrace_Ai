import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../assets/css/viewRecords.css";

export default function DetectionLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/detection-logs", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data);
        setLoading(false);
        window.scrollTo(0, 0);
      })
      .catch(() => setLoading(false));
  }, []);


  return (
    <div className="page-wrapper">
      <Header title="Detection Logs" />

      <div className="records-page">
        {loading && <p className="status-text">Loading detection logs...</p>}

        {!loading && logs.length === 0 && (
          <div className="empty-box">
            <p>No detections found</p>
          </div>
        )}

        {!loading && logs.length > 0 && (
          <div className="table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Time</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log, i) => (
                  <tr key={i}>
                    <td>{log.name}</td>
                    <td>
                      <span className={`badge ${log.category}`}>
                        {log.category}
                      </span>
                    </td>
                    <td>{log.location}</td>
                    <td>{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
