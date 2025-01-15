const fs = require("fs");
const path = require("path");

const logFilePath = path.join(__dirname, "../logs.txt");

const logger = (req, res, next) => {
    const jwtToken = req.headers["authorization"] || "No Token";

    const logEntry = `
DateTime: ${new Date().toLocaleString()}
Method: ${req.method}
URL: ${req.url}
JWT Token: ${jwtToken}
Body: ${JSON.stringify(req.body)}
-----------------------------------------
    `;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error("Failed to write to log file:", err);
        }
    });

    next();
};

module.exports = logger;
