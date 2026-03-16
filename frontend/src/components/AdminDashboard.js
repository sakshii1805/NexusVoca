import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import Chart from "chart.js/auto";

const API_BASE = "http://localhost:5000";

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return {};
  return {
    "x-user-role": user.role,
    "x-user-email": user.email,
  };
}

function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const topIssues = useMemo(() => analytics?.topIssues || [], [analytics]);

  async function loadAll() {
    setLoading(true);
    try {
      const [issuesRes, analyticsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/issues`),
        axios.get(`${API_BASE}/api/admin/analytics`, { headers: getAuthHeaders() }),
      ]);
      setIssues(issuesRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      console.log(err);
      alert("Failed to load admin analytics (are you logged in as admin?)");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (!analytics || !chartRef.current) return;

    const data = analytics.issuesByCategory || {};
    const labels = ["hostel", "mess", "classroom", "network"].map(
      (x) => x.charAt(0).toUpperCase() + x.slice(1)
    );
    const values = ["hostel", "mess", "classroom", "network"].map((k) => data[k] || 0);

    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: ["#2563EB", "#F97316", "#10B981", "#8B5CF6"],
            borderColor: ["#ffffff", "#ffffff", "#ffffff", "#ffffff"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
        },
        cutout: "65%",
      },
    });
  }, [analytics]);

  async function updateStatus(issueId, status) {
    try {
      const res = await axios.put(
        `${API_BASE}/api/issues/${issueId}/status`,
        { status },
        { headers: getAuthHeaders() }
      );
      setIssues((prev) => prev.map((i) => (i._id === issueId ? res.data : i)));
      // refresh analytics after status changes
      const analyticsRes = await axios.get(`${API_BASE}/api/admin/analytics`, {
        headers: getAuthHeaders(),
      });
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      console.log(err);
      alert("Status update failed");
    }
  }

  const totalIssues = analytics?.totalIssues ?? 0;
  const byCategory = analytics?.issuesByCategory || {};

  return (
    <div className="adminPage">
      <div className="adminHeader">
        <div>
          <h2 className="adminTitle">Admin Dashboard</h2>
          <p className="adminSub">Monitor issues, category trends, and update status.</p>
        </div>
        <button className="btnSecondary" onClick={loadAll} disabled={loading}>
          Refresh
        </button>
      </div>

      <div className="adminGrid">
        <div className="adminCard">
          <div className="adminCardLabel">Total Issues</div>
          <div className="adminCardValue">{totalIssues}</div>
        </div>
        <div className="adminCard">
          <div className="adminCardLabel">Hostel</div>
          <div className="adminCardValue">{byCategory.hostel || 0}</div>
        </div>
        <div className="adminCard">
          <div className="adminCardLabel">Mess</div>
          <div className="adminCardValue">{byCategory.mess || 0}</div>
        </div>
        <div className="adminCard">
          <div className="adminCardLabel">Network</div>
          <div className="adminCardValue">{byCategory.network || 0}</div>
        </div>
      </div>

      <div className="adminPanels">
        <div className="adminPanel">
          <div className="adminPanelTitle">Issues by Category</div>
          <div className="chartWrap">
            <canvas ref={chartRef} />
          </div>
        </div>

        <div className="adminPanel">
          <div className="adminPanelTitle">Top Issues</div>
          <div className="topList">
            {topIssues.length === 0 && <div className="emptyState">No issues yet.</div>}
            {topIssues.map((t) => (
              <div className="topRow" key={t._id || t.title}>
                <div className="topTitle">{t.title}</div>
                <div className="topVotes">{t.votes} votes</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="adminPanel" style={{ marginTop: 14 }}>
        <div className="adminPanelTitle">Issue Management</div>

        {loading && <div className="emptyState">Loading…</div>}
        {!loading && issues.length === 0 && <div className="emptyState">No issues found.</div>}

        {!loading && issues.length > 0 && (
          <div className="tableWrap">
            <table className="adminTable">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Votes</th>
                  <th>Status</th>
                  <th>Update</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((i) => (
                  <tr key={i._id}>
                    <td className="cellTitle">{i.title}</td>
                    <td>{i.category}</td>
                    <td>{i.location}</td>
                    <td>{i.votes || 0}</td>
                    <td>{i.status}</td>
                    <td>
                      <select
                        defaultValue={i.status}
                        onChange={(e) => updateStatus(i._id, e.target.value)}
                      >
                        <option value="reported">reported</option>
                        <option value="in_progress">in_progress</option>
                        <option value="resolved">resolved</option>
                      </select>
                    </td>
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

export default AdminDashboard;

