const mongoose = require("mongoose");
const dns = require("dns");

// Ensure Node.js resolves Atlas SRV records correctly on all network providers
if (dns.setServers) {
    try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
    } catch (e) {
        // fallback to system resolver
    }
}

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;