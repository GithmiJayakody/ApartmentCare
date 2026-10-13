import { useState } from "react";
import api, { apiError } from "../api";
import type { User } from "../api";
import type { MaintenanceRequest } from "../useDashboard";

export default function RequestEditor({ user, request, technicians = [], onClose, onSaved }: {
    user: User; request?: MaintenanceRequest; technicians?: User[];
    onClose: () => void; onSaved: () => Promise<void>;
}) {
    const [title, setTitle] = useState(request?.title || "");
    const [description, setDescription] = useState(request?.description || "");
    const [priority, setPriority] = useState(request?.priority || "Medium");
    const [category, setCategory] = useState(request?.category || "General");
    const [status, setStatus] = useState(request?.status || "Pending");
    const [technician, setTechnician] = useState(request?.assignedTechnician?._id || "");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const save = async (event: React.FormEvent) => {
        event.preventDefault();
        if (saving) return;
        setSaving(true);
        setError("");
        try {
            const fields = user.role === "technician" ? { status }
                : { title, description, priority, category, ...(user.role === "manager" ? { status, assignedTechnician: technician || null } : {}) };
            if (request) await api.put(`/requests/${request._id}`, fields);
            else await api.post("/requests", fields);
            await onSaved();
            onClose();
        } catch (error) { setError(apiError(error)); }
        finally { setSaving(false); }
    };
    return <div className="integration-modal">
        <section className="integration-panel" role="dialog" aria-modal="true" aria-label={request ? "Maintenance request" : "Create maintenance request"}>
            <h2>{request ? request.title : "Create maintenance request"}</h2>
            {request && <p>{request.description}<br />Unit: {request.unitNumber} · Status: {request.status}<br />Technician: {request.assignedTechnician?.fullName || "Unassigned"}</p>}
            <form onSubmit={save}>
                {user.role !== "technician" && <>
                    <label>Title<input autoFocus required value={title} onChange={(e) => setTitle(e.target.value)} /></label>
                    <label>Description<textarea required value={description} onChange={(e) => setDescription(e.target.value)} /></label>
                    <label>Priority<select value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)}>{["High", "Medium", "Low"].map((value) => <option key={value}>{value}</option>)}</select></label>
                    <label>Category<select value={category} onChange={(e) => setCategory(e.target.value)}>{Array.from(new Set([category, "General", "Plumbing", "Electrical", "HVAC", "Carpentry", "General Maintenance"])).map((value) => <option key={value}>{value}</option>)}</select></label>
                </>}
                {user.role !== "resident" && <label>Status<select value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>{["Pending", "In Progress", "Completed"].map((value) => <option key={value}>{value}</option>)}</select></label>}
                {user.role === "manager" && <label>Assigned technician<select value={technician} onChange={(e) => setTechnician(e.target.value)}><option value="">Unassigned</option>{technicians.map((item) => <option value={item.id} key={item.id}>{item.fullName} — {item.speciality}</option>)}</select></label>}
                {error && <p role="alert">{error}</p>}
                <button disabled={saving} type="submit">{saving ? "Saving…" : "Save request"}</button>
                <button disabled={saving} type="button" onClick={onClose}>Close</button>
            </form>
        </section>
    </div>;
}
