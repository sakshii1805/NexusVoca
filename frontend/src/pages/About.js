import { FaUniversity, FaEnvelope, FaGithub, FaHeart } from "react-icons/fa";

function About() {
  return (
    <div className="aboutPage">

      <div className="aboutHero">
        <div className="aboutLogo">NV</div>
        <h2>Nexus Voca</h2>
        <p>Campus Communication Platform</p>
      </div>

      <div className="aboutSection">
        <h3>About the Project</h3>
        <p>
          Nexus Voca is a college-focused social platform designed to streamline
          communication between students, teachers, and administrators. From
          announcements to complaints, everything campus-related in one place.
        </p>
      </div>

      <div className="aboutSection">
        <h3>Features</h3>
        <ul className="aboutList">
          <li>📢 Campus Feed — share updates and announcements</li>
          <li>📬 Inbox — direct messaging with peers and teachers</li>
          <li>📝 Complaints — raise and track campus issues</li>
          <li>👥 Community — join interest-based groups</li>
          <li>🔔 Notifications — stay up to date instantly</li>
        </ul>
      </div>

      <div className="aboutSection">
        <h3>Contact</h3>
        <div className="aboutContact">
          <div className="aboutContactRow">
            <FaUniversity className="aboutIcon" />
            <span>Department of Computer Science</span>
          </div>
          <div className="aboutContactRow">
            <FaEnvelope className="aboutIcon" />
            <span>support@nexusvoca.edu</span>
          </div>
          <div className="aboutContactRow">
            <FaGithub className="aboutIcon" />
            <span>github.com/nexusvoca</span>
          </div>
        </div>
      </div>

      <p className="aboutFooter">
        Made with <FaHeart style={{ color: "#ef4444", margin: "0 4px" }} /> for campus life
      </p>

    </div>
  );
}

export default About;