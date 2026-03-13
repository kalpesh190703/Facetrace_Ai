import { useEffect, useState } from "react";
import Header from "../components/Header";
import "../assets/css/viewRecords.css";

export default function ViewRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/records", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrapper">
      <Header title="Known Records" />

      <div className="records-page">
        {loading && <p className="status-text">Loading records...</p>}

        {!loading && records.length === 0 && (
          <div className="empty-box">
            <p>No records found</p>
          </div>
        )}

        {!loading && records.length > 0 && (
          <div className="table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Category</th>
                  <th>Details</th>
                </tr>
              </thead>

              <tbody>
                {records.map((r, i) => (
                  <tr key={i}>
                    <td>{r.name}</td>
                    <td>{r.age}</td>
                    <td>{r.city}</td>
                    <td>
                      <span className={`badge ${r.category}`}>
                        {r.category}
                      </span>
                    </td>
                    <td>{r.details || "-"}</td>
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
