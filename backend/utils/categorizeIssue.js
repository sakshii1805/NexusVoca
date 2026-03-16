function categorizeIssue(input) {
  const text = `${input?.title || ""} ${input?.description || ""} ${input?.location || ""}`
    .toLowerCase()
    .trim();

  // Rules (keyword -> category)
  const rules = [
    { keywords: ["water", "washroom"], category: "hostel" },
    { keywords: ["food", "mess"], category: "mess" },
    { keywords: ["projector", "classroom"], category: "classroom" },
    { keywords: ["wifi", "internet"], category: "network" },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((k) => text.includes(k))) return rule.category;
  }

  // Fallback keeps analytics consistent.
  return "hostel";
}

module.exports = { categorizeIssue };
