import { dateLabel, shortId } from "../useDashboard";
import type { MaintenanceRequest } from "../useDashboard";

export default function RequestUpdates({ requests, manager = false }: { requests: MaintenanceRequest[]; manager?: boolean }) {
    const recent = [...requests].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)).slice(0, 4);
    return <div id="request-updates">
        {!recent.length && <p>No request updates yet.</p>}
        {recent.map((request) => <div className={manager ? "manager-notification-item" : "notification-item"} key={request._id}>
            <div className="notification-icon blue-bg">🔧</div>
            <div><strong>{shortId(request._id)} · {request.status}</strong><p>{request.title}{request.assignedTechnician ? ` — ${request.assignedTechnician.fullName}` : " — Awaiting assignment"}</p><small>{dateLabel(request.updatedAt)}</small></div>
        </div>)}
    </div>;
}
