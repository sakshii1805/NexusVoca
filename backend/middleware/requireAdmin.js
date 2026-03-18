function requireAdmin(req, res, next) {
  // Lightweight role-check that matches current "login" approach.
  // Frontend should send user's role as a header.
  const role = String(req.header("x-user-role") || "").toLowerCase();
  if (role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

module.exports = { requireAdmin };
