import { useEffect, useState } from "react";

const defaultTags = {
  "#ExamSchedule": 128,
  "#CampusFest2026": 95,
  "#LibraryHours": 42,
  "#PlacementDrive": 67
};

function Trending({ onTagClick }) {

  const [topics, setTopics] = useState([]);

  useEffect(() => {

    let trendArray = Object.keys(defaultTags).map(tag => ({
      name: tag,
      count: defaultTags[tag]
    }));

    trendArray.sort((a, b) => b.count - a.count);

    setTopics(trendArray);

  }, []); // ✅ empty array - runs only once

  return (

    <div className="trending">

      <h3>Trending on Campus</h3>

      {topics.map((t, index) => (
        <div className="trendCard" key={index}>

          <span
            className="trendTag"
            onClick={() => onTagClick && onTagClick(t.name)}
          >
            {t.name}
          </span>

          <span className="trendCount">
            {t.count} posts
          </span>

        </div>
      ))}

    </div>

  );

}

export default Trending;