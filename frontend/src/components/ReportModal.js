import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const API = "http://localhost:5000";
const REASONS = ["Spam", "Hate speech / abuse", "Inappropriate content", "Harassment", "Fake information"];

function ReportModal({ type, targetId, targetName, onClose }) {
  const [reason, setReason]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]   = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const submit = async () => {
    if (!reason) return;
    setLoading(true);
    try {
      await axios.post(`${API}/api/users/report`, {
        type, targetId, targetName, reporter: user.name, reason,
      });
      setSubmitted(true);
    } catch(err){ console.log(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <h3 className="modalTitle">Report {type === "post" ? "Post" : "User"}</h3>
          <button className="modalClose" onClick={onClose}><FaTimes/></button>
        </div>

        {submitted ? (
          <div className="modalSuccess">
            <div className="modalSuccessIcon">✅</div>
            <p>Thanks for your report! Our admins will review it shortly.</p>
            <button className="authBtn" onClick={onClose} style={{marginTop:16}}>Done</button>
          </div>
        ) : (
          <>
            <p className="modalSub">Why are you reporting {targetName ? `"${targetName}"` : "this"}?</p>
            <div className="reportReasons">
              {REASONS.map(r => (
                <button
                  key={r}
                  className={`reasonBtn${reason === r ? " reasonBtn--active" : ""}`}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="authBtn reportSubmitBtn" onClick={submit} disabled={!reason || loading}>
              {loading ? <span className="authSpinner"/> : "Submit Report"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ReportModal;