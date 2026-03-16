import IssueBoard from "./IssueBoard";

function Feed() {
  return (
    <IssueBoard
      showForm={false}
      titleText="Home"
      subtitleText="View reported issues, vote for priority, and track progress."
    />
  );
}

export default Feed;