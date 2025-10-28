import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/Connection.css";

const STATUS_OPTIONS = ["Connected", "Waiting", "Follow up", "No response"];

export default function ConnectionForm({ initialValues, onCancel, onSave, saving }) {
  const [form, setForm] = useState({ name: "", company: "", metAt: "", status: "Waiting", note: "" });
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);

  useEffect(() => {
    // Prefill when editing and focus first field when opening
    if (initialValues) {
      setForm({
        name: initialValues.name || "",
        company: initialValues.company || "",
        metAt: initialValues.metAt || initialValues.role || "",
        status: initialValues.status || "Waiting",
        note: initialValues.note || "",
      });
    } else {
      setForm({ name: "", company: "", metAt: "", status: "Waiting", note: "" });
    }
    setTimeout(() => nameRef.current?.focus(), 0);
  }, [initialValues]);

  const disabled = useMemo(() => !form.name || !form.company, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (!form.name?.trim()) er.name = "Name is required";
    if (!form.company?.trim()) er.company = "Company is required";
    return er;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const er = validate();
    if (Object.keys(er).length) {
      setErrors(er);
      return;
    }
    onSave?.(form);
  };

  return (
    <form className="connection-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="conn-name">
          Name <span className="req">*</span>
          <input id="conn-name" ref={nameRef} name="name" value={form.name} onChange={handleChange} placeholder="Jane Doe" aria-invalid={!!errors.name} aria-describedby={errors.name ? "err-name" : undefined} />
          {errors.name && <small id="err-name" className="field-error">{errors.name}</small>}
        </label>
        <label htmlFor="conn-company">
          Company <span className="req">*</span>
          <input id="conn-company" name="company" value={form.company} onChange={handleChange} placeholder="Acme Inc" aria-invalid={!!errors.company} aria-describedby={errors.company ? "err-company" : undefined} />
          {errors.company && <small id="err-company" className="field-error">{errors.company}</small>}
        </label>
      </div>
      <div className="form-row">
        <label htmlFor="conn-metAt">
          Where you met
          <input id="conn-metAt" name="metAt" value={form.metAt} onChange={handleChange} placeholder="e.g., LinkedIn, Conference, Referral" />
        </label>
        <div className="status-group">
          <span className="label">Status</span>
          <div className="status-pills" role="group" aria-label="Connection status">
            {STATUS_OPTIONS.map((s) => (
              <button
                type="button"
                key={s}
                className={`status-pill ${form.status === s ? "selected" : ""} ${s === "Connected" ? "pill-connected" : s === "Waiting" ? "pill-waiting" : s === "Follow up" ? "pill-followup" : "pill-noresponse"}`}
                aria-pressed={form.status === s}
                onClick={() => setForm((f) => ({ ...f, status: s }))}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="form-row">
        <label className="full" htmlFor="conn-note">
          Note
          <textarea id="conn-note" name="note" rows={3} value={form.note} onChange={handleChange} placeholder="Add a quick note about this connection" />
        </label>
      </div>
      <div className="actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={disabled || saving}>{saving ? "Saving..." : "Save"}</button>
      </div>
    </form>
  );
}
