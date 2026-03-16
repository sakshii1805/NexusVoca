import IssueBoard from "./IssueBoard";

function Complaint() {
  return (
    <IssueBoard
      showForm={true}
      titleText="Report an Issue"
      subtitleText="Submit an anonymous report to help campus administration prioritize fixes."
    />
  );
}

export default Complaint;