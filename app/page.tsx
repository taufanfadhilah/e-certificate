/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, type FormEvent } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("");
  const [submitted, setSubmitted] = useState({ name: "", institution: "" });
  const [isDownloading, setIsDownloading] = useState(false);

  const loadCertificateImage = () =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = "/cert.jpeg";
    });

  const generateAndDownload = async (payload: {
    name: string;
    institution: string;
  }) => {
    setIsDownloading(true);
    try {
      const img = await loadCertificateImage();
      const canvas = document.createElement("canvas");
      const width = img.naturalWidth || 1600;
      const height = img.naturalHeight || 1200;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw background
      ctx.drawImage(img, 0, 0, width, height);

      // Name text
      ctx.fillStyle = "#b57a00";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${Math.floor(width / 18)}px "Times New Roman", serif`;
      ctx.fillText(payload.name || "Your Name", width / 2, height * 0.52);

      // Institution text
      ctx.fillStyle = "#10643f";
      ctx.font = `${Math.floor(width / 28)}px "Times New Roman", serif`;
      ctx.fillText(
        payload.institution || "Your Institution",
        width / 2,
        height * 0.62
      );

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `certificate-${payload.name || "recipient"}.png`;
      link.click();
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = { name, institution };
    setSubmitted(payload);
    generateAndDownload(payload);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 font-sans text-zinc-900">
      <div className="flex w-full max-w-5xl flex-col gap-8 md:flex-row">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-2xl font-semibold text-zinc-900">
            Generate Certificate
          </h1>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Name
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-zinc-700">
            Institution
            <input
              required
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="Example University"
              className="rounded-lg border border-zinc-200 px-3 py-2 text-base text-zinc-900 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200"
            />
          </label>
          <button
            type="submit"
            disabled={isDownloading}
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDownloading ? "Preparing..." : "Create"}
          </button>
        </form>

        <section className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
          <div
            className="relative aspect-video w-full overflow-hidden rounded-xl bg-white"
            style={{
              backgroundImage: "url('/cert.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-8 text-center">
              <div className="text-4xl font-semibold text-amber-700 drop-shadow-sm">
                {submitted.name || "Your Name"}
              </div>
              <div className="text-xl font-medium text-emerald-800 drop-shadow-sm">
                {submitted.institution || "Your Institution"}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-zinc-500">
            Fill the form to place your details on the certificate.
          </p>
        </section>

        <section className="flex w-full flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm text-sm text-zinc-700">
          <h2 className="text-base font-semibold text-zinc-900">Creator</h2>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-zinc-800">Taufan Fadhilah</span>
            <span>Phone: 082218339682</span>
            <a
              className="text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800"
              href="https://cherrypick.studio/"
              target="_blank"
              rel="noreferrer"
            >
              cherrypick.studio
            </a>
            <a
              className="text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800"
              href="https://www.instagram.com/taufanfadhilah/?hl=id"
              target="_blank"
              rel="noreferrer"
            >
              instagram.com/taufanfadhilah
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
