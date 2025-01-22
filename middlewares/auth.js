module.exports = (req, res, next) => {
  const { role, pass } = req.headers;
  if (role === "admin" && pass === "saveEarth") {
    next();
  } else {
    res.status(403).json({ message: "Not Authorized" });
  }
};
