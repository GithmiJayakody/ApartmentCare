const mongoose = require("mongoose");

const connectionOptions = { serverSelectionTimeoutMS: 10000, connectTimeoutMS: 10000 };

function validateDatabaseUri(uri) {
    const invalid = (message) => {
        const error = new Error(message);
        error.name = "ConfigurationError";
        throw error;
    };
    if (typeof uri !== "string" || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
        invalid("MONGO_URI must be a valid MongoDB connection string in Backend/.env.");
    }
    if (/<[^>]+>|YOUR_PASSWORD|YOUR_USERNAME/i.test(uri)) {
        invalid("MONGO_URI contains a credential placeholder. Configure the actual Atlas credentials privately in Backend/.env.");
    }
    // The MongoDB driver validates replica-set URIs; URL validates the SRV form.
    if (uri.startsWith("mongodb+srv://")) {
        let url;
        try { url = new URL(uri); } catch { invalid("MONGO_URI is malformed. Check the Atlas URI privately in Backend/.env."); }
        if (!url.hostname.endsWith(".mongodb.net") || url.port) invalid("The Atlas SRV URI must use its mongodb.net hostname without a port.");
        if (!url.username || !url.password) invalid("The Atlas URI needs database-user credentials in Backend/.env.");
        try { decodeURIComponent(url.username); decodeURIComponent(url.password); }
        catch { invalid("Atlas credentials contain invalid percent encoding. URL-encode the username and password privately."); }
        if (!url.pathname || url.pathname === "/") invalid("Specify the application database name in the Atlas URI.");
        if (["tls", "ssl"].some((key) => url.searchParams.get(key) === "false")) invalid("Atlas requires TLS. Remove any option that disables it.");
    }
}

function connectionFailure(error) {
    // Only emit known names/codes. Driver messages and stacks can contain credentials.
    const causes = [error, error?.cause, ...Array.from(error?.reason?.servers?.values?.() || []).flatMap((server) => [server.error, server.error?.cause])].filter(Boolean);
    const codes = new Set(causes.map((cause) => cause.code));
    if (codes.has(18) || causes.some((cause) => cause.codeName === "AuthenticationFailed")) return "Atlas authentication failed. Verify the existing database user's credentials and authSource privately.";
    if (["ENOTFOUND", "EAI_AGAIN", "ECONNREFUSED"].some((code) => codes.has(code)) && causes.some((cause) => /querySrv|queryTxt|getaddrinfo/.test(cause.syscall || ""))) return "Atlas DNS lookup failed. Check the configured hostname and DNS resolver.";
    if (codes.has("ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR")) return "Atlas rejected the TLS handshake before authentication. Check whether this machine's current public IP is in the project's Network Access list, then check the network/TLS path.";
    if (codes.has("CERT_HAS_EXPIRED") || codes.has("UNABLE_TO_VERIFY_LEAF_SIGNATURE") || codes.has("SELF_SIGNED_CERT_IN_CHAIN")) return "Atlas certificate verification failed. Check the machine's clock and trusted certificates; keep TLS verification enabled.";
    if (error?.code === "EADDRINUSE") return "Backend port is already in use. Stop the other listener or check PORT in Backend/.env.";
    if (/Mongo|Mongoose/.test(error?.name || "")) return "No Atlas server could be selected. Check the project's IP access list, cluster status and outbound TCP port 27017. Run npm.cmd run check:db for DNS/TLS diagnostics.";
    return "Startup failed. Check the backend configuration and port availability.";
}

async function connectDatabase() {
    validateDatabaseUri(process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, connectionOptions);
    await mongoose.connection.db.command({ ping: 1 });
}

module.exports = { connectDatabase, connectionOptions, connectionFailure, validateDatabaseUri };
