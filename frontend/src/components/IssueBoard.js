import { useEffect, useMemo, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000";

// Fallback sample issues to keep the UI from looking empty
// when the database is new or temporarily unavailable.
const mockIssues = [
  {
    _id: "demo-1",
    title: "WiFi very slow in CS Block",
    description: "Internet speed drops heavily during afternoon lab sessions in CS Block 2nd floor.",
    category: "network",
    location: "CS Block - Lab 204",
    votes: 12,
    status: "reported",
  },
  {
    _id: "demo-2",
    title: "Water leakage near Hostel Block B",
    description: "Continuous leakage near the stairs causing slippery floor and mosquitoes.",
    category: "hostel",
    location: "Hostel Block B - Staircase",
    votes: 8,
    status: "in_progress",
  },
  {
    _id: "demo-3",
    title: "Projector not working in Room 301",
    description: "Projector does not turn on, affecting morning lectures.",
    category: "classroom",
    location: "Main Building - Room 301",
    votes: 5,
    status: "resolved",
  },
  {
    _id: "demo-4",
    title: "Food quality in mess has dropped",
    description: "Breakfast is often cold and chapatis are undercooked for the past week.",
    category: "mess",
    location: "Central Mess",
    votes: 9,
    status: "reported",
  },
  {
    _id: "demo-5",
    title: "No water in Hostel Block C washrooms",
    description: "Water supply stops completely after 9 PM, affecting students returning from labs.",
    category: "hostel",
    location: "Hostel Block C - 3rd floor",
    votes: 6,
    status: "reported",
  },
  {
    _id: "demo-6",
    title: "AC not working in lecture hall",
    description: "AC in the main lecture hall remains off during afternoon classes making it very hot.",
    category: "classroom",
    location: "Main Building - Lecture Hall 1",
    votes: 7,
    status: "in_progress",
  },
];

function getAuthHeaders() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (!user) return {};
  return {
    "x-user-role": user.role,
    "x-user-email": user.email,
  };
}

function formatCategory(cat) {
  const c = String(cat || "").toLowerCase();
  if (!c) return "Unknown";
  return c.charAt(0).toUpperCase() + c.slice(1);
}

function StatusBadge({ status }) {
  const s = String(status || "reported").toLowerCase();
  return <span className={`statusBadge statusBadge--${s}`}>{s.replace("_", " ")}</span>;
}

function IssueBoard({ showForm = true, titleText = "Home", subtitleText }) {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");

  // filter
  const [filterCategory, setFilterCategory] = useState("all");

  const visibleIssues = useMemo(() => {
    if (filterCategory === "all") return issues;
    return issues.filter((i) => String(i.category).toLowerCase() === filterCategory);
  }, [issues, filterCategory]);

  async function loadIssues() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/issues`);
      const data = res.data || [];
      // If there are no real issues yet, show a few helpful examples.
      setIssues(data.length > 0 ? data : mockIssues);
    } catch (err) {
      console.log("Error loading issues:", err);
      // On error, still show demo issues so UI is usable offline.
      setIssues(mockIssues);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIssues();
  }, []);

  async function submitIssue(e) {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Please login first");
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim()) {
      alert("Please fill title, description, and location");
      return;
    }

    try {
      const res = await axios.post(
        `${API_BASE}/api/issues`,
        {
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          category: category ? category : undefined, // backend auto-categorizes if missing
        },
        { headers: getAuthHeaders() }
      );

      setIssues((prev) => [res.data, ...prev].sort((a, b) => (b.votes || 0) - (a.votes || 0)));
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
    } catch (err) {
      console.log(err);
      alert("Issue submission failed");
    }
  }

  async function vote(issueId) {
    try {
      const res = await axios.post(`${API_BASE}/api/issues/${issueId}/vote`);
      setIssues((prev) =>
        prev
          .map((i) => (i._id === issueId ? res.data : i))
          .sort((a, b) => (b.votes || 0) - (a.votes || 0))
      );
    } catch (err) {
      console.log(err);
      alert("Vote failed");
    }
  }

  return (
    <div className="pulsePage">
      <div className="pulseHeader">
        <div>
          <h2 className="pulseTitle">{titleText}</h2>
          <p className="pulseSub">
            {subtitleText || "Report issues anonymously, vote for priority, and track status."}
          </p>
        </div>

        <div className="pulseFilters">
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="all">All categories</option>
            <option value="hostel">Hostel</option>
            <option value="mess">Mess</option>
            <option value="classroom">Classroom</option>
            <option value="network">Network</option>
          </select>
          <button className="btnSecondary" onClick={loadIssues} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      {showForm && (
        <form className="issueForm" onSubmit={submitIssue}>
          <div className="issueFormGrid">
            <div className="field">
              <label>Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Water problem in Hostel Block B"
              />
            </div>
            <div className="field">
              <label>Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Hostel Block B"
              />
            </div>
            <div className="field">
              <label>Category (optional)</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Auto-detect</option>
                <option value="hostel">Hostel</option>
                <option value="mess">Mess</option>
                <option value="classroom">Classroom</option>
                <option value="network">Network</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue clearly..."
            />
          </div>

          <div className="issueFormFooter">
            <div className="anonNote">Anonymous: your identity is not shown to other students.</div>
            <button className="btnPrimary" type="submit">
              Submit Issue
            </button>
          </div>
        </form>
      )}

      <div className="issueList">
        {loading && <div className="emptyState">Loading issues…</div>}
        {!loading && visibleIssues.length === 0 && (
          <div className="emptyState">No issues found for this category.</div>
        )}

        {visibleIssues.map((issue) => (
          <div className="issueCard" key={issue._id}>
            <div className="issueTop">
              <div className="issueTitleWrap">
                <div className="issueTitleRow">
                  <h3 className="issueTitle">{issue.title}</h3>
                  <StatusBadge status={issue.status} />
                </div>
                <div className="issueMeta">
                  <span className={`catPill catPill--${String(issue.category || "").toLowerCase()}`}>
                    {formatCategory(issue.category)}
                  </span>
                  <span className="dot">•</span>
                  <span>{issue.location}</span>
                </div>
              </div>

              <div className="voteBox">
                <div className="voteCount">{issue.votes || 0}</div>
                <button className="voteBtn" onClick={() => vote(issue._id)}>
                  Vote
                </button>
              </div>
            </div>

            <p className="issueDesc">{issue.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IssueBoard;
