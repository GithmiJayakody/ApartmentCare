const path = require("node:path");
const dns = require("node:dns").promises;
const tls = require("node:tls");
const mongoose = require("mongoose");
const { connectDatabase, connectionFailure, validateDatabaseUri } = require("../config/database");
require("dotenv").config({ path: path.join(__dirname, "../.env"), quiet: true });

async function check() {
    const uri = process.env.MONGO_URI || "";
    let url;
    try { url = new URL(uri); } catch {
        console.log("MONGO_URI is missing or malformed.");
        process.exitCode = 1;
        return;
    }
    console.log(JSON.stringify({
        hostname: url.hostname,
        scheme: url.protocol,
        database: url.pathname,
        placeholder: /<[^>]+>|YOUR_PASSWORD|YOUR_USERNAME/i.test(uri),
        jwtConfigured: Boolean(process.env.JWT_SECRET),
        jwtMinimumLengthMet: (process.env.JWT_SECRET || "").length >= 32,
        credentialsEncoded: !/[@:/?#\[\]]/.test(url.password),
    }));
    try { validateDatabaseUri(uri); } catch (error) {
        console.log(error.message);
        process.exitCode = 1;
        return;
    }
    if (url.protocol === "mongodb+srv:") {
        try {
            const records = await dns.resolveSrv(`_mongodb._tcp.${url.hostname}`);
            console.log(`SRV resolved: ${records.length} database hosts.`);
            const txt = (await dns.resolveTxt(url.hostname)).flat().join("&");
            const options = new URLSearchParams(txt);
            console.log(`Atlas authentication database: ${url.searchParams.get("authSource") || options.get("authSource") || url.pathname.slice(1)}.`);
            await Promise.all(records.map((record) => new Promise((resolve) => {
                const socket = tls.connect({ host: record.name, port: record.port, servername: record.name });
                let finished = false;
                const finish = (result) => { if (finished) return; finished = true; console.log(`TLS reachability: ${record.name}: ${result}.`); socket.destroy(); resolve(); };
                socket.setTimeout(5000, () => finish("timeout"));
                socket.once("secureConnect", () => finish("connected"));
                socket.once("error", (error) => finish(error.code || "failed"));
            })));
        } catch (error) {
            console.log(`SRV lookup failed: ${error.code} (${url.hostname}).`);
        }
    }
    try {
        await connectDatabase();
        console.log("MongoDB connection and database ping succeeded.");
    } catch (error) {
        // Never print driver error messages: they can include credentials.
        console.log(connectionFailure(error));
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}
check().catch(() => { console.log("Connection diagnostic failed."); process.exitCode = 1; });
