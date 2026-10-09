"use client";

import { useState } from "react";

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked (insecure context, permissions): fall back to mail client
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button type="button" className="btn btn-copy" onClick={copy} aria-label={`Copy ${email} to clipboard`}>
      <span aria-live="polite">{copied ? "COPIED" : "COPY"}</span>
    </button>
  );
}
