const jwt = require("jsonwebtoken");

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "No token, authorization denied" });
        }

        console.log("Token received:", token); // Log the token

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify the token
        req.user = decoded; // Attach user info to request object

        console.log("Decoded user info:", decoded); // Log the decoded user info

        next();
    } catch (err) {
        console.error("Token validation error:", err); // Log the error for debugging
        return res.status(401).json({ msg: "Token is not valid" });
    }
};
