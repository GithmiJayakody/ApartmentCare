# Livora verification report — 11 October 2026

The backend and frontend now run with the existing MongoDB Atlas database. Live API and Chrome browser verification passed. Secrets and private environment files were preserved. Existing UI, layout, CSS and features were preserved.

## 1. What was wrong

The machine's current public IP was missing from the existing Atlas project's Network Access list. DNS resolved the correct cluster, but all three nodes rejected TLS before authentication, resulting in `MongooseServerSelectionError`. The failure was reproduced outside the sandbox. The cluster was active, unpaused, and its published hostname matched the configured URI.

The old report's credential-placeholder finding was stale: the current `.env` contains populated credentials. Startup obscured the TLS cause. User email format was validated in routes but not in the model, and request priority, status and category schemas allowed explicit nulls.

## 2. Files changed during this repair

- `Backend/config/database.js`: shared URI validation, connection/ping logic and safe diagnostics.
- `Backend/server.js`: shared connection, model initialization before listening, prompt HTTP 503 responses during database outages.
- `Backend/scripts/check-connection.js`: shared settings, SRV, authentication database, TLS and ping diagnostics.
- `Backend/models/User.js`: email format validation.
- `Backend/models/MaintenanceRequest.js`: required priority, status and category with existing defaults.
- `Backend/tests/database.test.js`: configuration, diagnostic privacy and schema regression tests.
- `Backend/package.json`: runs both backend test files.
- `Frontend/tests/verify-atlas.mjs`: live API/browser/Atlas verification and scoped cleanup.
- `Frontend/package.json`: added `verify:atlas`.
- `INTEGRATION_REPORT.md`: replaced the stale report.

Existing application edits were present before this repair. Registration/login pages, dashboard hook, JWT route protection, API client, request editor and dashboard components were inspected and verified; their working functionality and UI were retained.

## 3. What was fixed

With explicit user approval, added only `112.134.234.248/32` to the existing Atlas access list. Existing entries were retained. After propagation, the same URI authenticated successfully and a database ping passed, confirming that the missing IP entry caused the connection failure. No credential reset or URI replacement was needed.

Startup validates the URI, connects and pings MongoDB, initializes model indexes, and only then listens. Safe messages distinguish TLS, authentication, DNS, certificate and port failures. Disconnected API calls return HTTP 503 while Mongoose retains buffering for startup collection initialization. Model validation prevents invalid emails and null request enums/category.

## 4. MongoDB Atlas connection

`Backend/.env` supplies `MONGO_URI`, `JWT_SECRET` and `PORT=5000`. The hostname is `cluster0.xl6ygou.mongodb.net`; the application database is `ApartmentCare`. Atlas DNS supplies `authSource=admin` and the replica-set name. Mongoose uses existing credentials with TLS certificate verification enabled.

The connected MongoDB Atlas plugin verified the cluster and access list. This machine then verified authentication, bcrypt password persistence, JWTs and maintenance documents through Mongoose using the existing URI. [Atlas requires client IPs to appear in the project's access list](https://www.mongodb.com/docs/atlas/troubleshoot-connection/).

## 5. Frontend/backend connection

React uses the existing `VITE_API_URL=http://localhost:5000/api`, attaches the Bearer JWT and reports API errors. Express permits `http://localhost:5173`; browser preflight passed with Authorization and Content-Type headers.

Registration calls `/api/auth/register`; login calls `/api/auth/login`; protected dashboards verify `/api/auth/me`. Dashboards load `/api/requests`; managers also load `/api/auth/users`. The request editor creates/updates MongoDB records, and technician availability uses `/api/auth/me`. Dashboard accounts, lists, counts and completion statistics derive from API results. Route imports, exports and handlers were valid.

Verified flow: React → Express → Mongoose → existing Atlas database → Express JSON → React. Residents see owned requests; technicians see assigned requests; managers see maintenance and user data.

## 6. Exact commands

Both services were left running on ports 5000 and 5173. Open `http://localhost:5173`. To restart after stopping the current processes, use two PowerShell terminals. `npm.cmd` avoids this machine's PowerShell script-execution restriction without changing execution policy.

Terminal 1:

```powershell
cd C:\pamudi\DEvOps\ApartmentCare\Backend
npm.cmd ci
npm.cmd run check:db
npm.cmd run dev
```

Terminal 2:

```powershell
cd C:\pamudi\DEvOps\ApartmentCare\Frontend
npm.cmd ci
npm.cmd run dev
```

Repeat verification with both services running:

```powershell
cd C:\pamudi\DEvOps\ApartmentCare\Backend
npm.cmd test
```

```powershell
cd C:\pamudi\DEvOps\ApartmentCare\Frontend
npm.cmd run build
npm.cmd run lint
npm.cmd run verify:atlas
```

`verify:atlas` requires installed Chrome and the existing Atlas configuration. It creates unique temporary accounts through real React registration, verifies persistence and role flows, and removes only those accounts and their requests. Existing records remain intact. The separate backend regression suite uses disposable MongoDB test fixtures; application runtime and live acceptance checks use Atlas.

## 7. Test results

| Check | Result |
| --- | --- |
| Atlas cluster/URI hostname | Matching; active and unpaused |
| Atlas SRV/TXT records | Three nodes; authSource admin |
| Atlas authentication and database ping | Passed |
| Backend startup at localhost:5000 | Passed after Atlas connection |
| GET / and GET /api/health | HTTP 200; database Connected |
| Browser CORS preflight from localhost:5173 | Passed |
| React registration for all three roles | Passed; Atlas users and bcrypt hashes verified |
| Login and JWT for all roles | Passed with Atlas-backed users |
| Missing/invalid/expired JWT and role restriction | Expected 401/403 responses |
| Resident request creation/retrieval | Passed; Atlas document and display after reload verified |
| Manager user lists and assignment | Passed in Chrome; assignment saved in Atlas |
| Technician assigned requests/status | Passed; In Progress and Completed persisted |
| Technician availability | Passed; saved in Atlas |
| Resident completed-request display/count | Passed using Atlas response |
| Browser console/runtime errors | None during live flow |
| Live acceptance checks | 13 passed; temporary records cleaned up |
| Backend API/configuration/schema regression tests | 42 passed |
| Frontend TypeScript/Vite build | Passed |
| Frontend ESLint | Passed |

## 8. Remaining manual action

None for the current connection and verified workflows. If the public IP changes after changing networks, add the new exact IP to the same Atlas project's Network Access list. The approved entry is specific to the machine's current public IP; database credentials are still required.
