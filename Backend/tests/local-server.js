// A disposable MongoDB server for browser tests. Never rewrites Backend/.env or touches Atlas.
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const crypto = require("node:crypto");
let mongo;
let server;
async function stop() {
    if (server) await new Promise((resolve) => server.close(resolve));
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
}
async function main() {
    mongo = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongo.getUri("ApartmentCareTest");
    process.env.JWT_SECRET = crypto.randomBytes(48).toString("hex");
    process.env.PORT = process.env.PORT || "5001";
    const { startServer } = require("../server");
    server = await startServer();
    console.log("Disposable test database ready; no Atlas data is used.");
    for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => { void stop().then(() => process.exit(0)); });
}
main().catch(async (error) => {
    console.error(`Test server startup failed (${error.name}).`);
    await stop();
    process.exitCode = 1;
});
