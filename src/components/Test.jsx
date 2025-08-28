import React, { useState } from "react";

// Simple, accessible React form
// - Controlled inputs (name, email, message)
// - Basic client-side validation
// - Tailwind classes for quick styling (optional)
//   Remove className values if you don't use Tailwind

export default function Test() {
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function validate(v) {
    const next = {};
    if (!v.name.trim()) next.name = "Name is required";
    if (!v.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) next.email = "Enter a valid email";
    if (!v.message.trim()) next.message = "Please enter a message";
    return next;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setStatus("submitting");
      // Simulate async submit (replace with your API call)
      await new Promise((res) => setTimeout(res, 800));
      setStatus("success");
      // Reset form
      setValues({ name: "", email: "", message: "" });
      setErrors({});
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold mb-1">Contact Us</h1>
        <p className="text-sm text-gray-600 mb-6">A tiny React form with validation.</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name */}
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 mb-1 focus:outline-none focus:ring ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Ada Lovelace"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-red-600 mb-3">{errors.name}</p>
          )}

          {/* Email */}
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 mb-1 focus:outline-none focus:ring ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="ada@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-red-600 mb-3">{errors.email}</p>
          )}

          {/* Message */}
          <label htmlFor="message" className="block text-sm font-medium mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={values.message}
            onChange={handleChange}
            className={`w-full rounded-lg border px-3 py-2 mb-1 focus:outline-none focus:ring ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Say hello…"
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "message-error" : undefined}
          />
          {errors.message && (
            <p id="message-error" className="text-xs text-red-600 mb-3">{errors.message}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-black text-white py-2 font-medium disabled:opacity-50"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send Message"}
          </button>

          {status === "success" && (
            <div className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              Thanks! Your message has been sent.
            </div>
          )}
          {status === "error" && (
            <div className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              Oops, something went wrong. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
