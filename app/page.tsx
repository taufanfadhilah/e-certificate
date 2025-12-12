/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, type FormEvent } from "react";

const NAME_Y_RATIO = 0.44;
const INSTITUTION_Y_RATIO = 0.53;
const NAME_BASE_SIZE_RATIO = 1 / 22.5; // 20% smaller than previous ~1/18
const INST_BASE_SIZE_RATIO = 1 / 35; // 20% smaller than previous ~1/28

const fitTextToWidth = (
  ctx: CanvasRenderingContext2D,
  text: string,
  baseSize: number,
  fontFamily: string,
  maxWidth: number
) => {
  let fontSize = baseSize;
  ctx.font = `${fontSize}px ${fontFamily}`;
  while (ctx.measureText(text).width > maxWidth && fontSize > baseSize * 0.6) {
    fontSize -= 1;
    ctx.font = `${fontSize}px ${fontFamily}`;
  }
  return fontSize;
};

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
      img.src = "/cert.jpg";
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
      ctx.fillStyle = "#333333";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const nameBaseSize = Math.floor(width * NAME_BASE_SIZE_RATIO);
      const nameFontSize = fitTextToWidth(
        ctx,
        payload.name || "Your Name",
        nameBaseSize,
        '"Times New Roman", serif',
        width * 0.7
      );
      ctx.font = `${nameFontSize}px "Times New Roman", serif`;
      ctx.fillText(payload.name || "Your Name", width / 2, height * NAME_Y_RATIO);

      // Institution text
      ctx.fillStyle = "#333333";
      const instBaseSize = Math.floor(width * INST_BASE_SIZE_RATIO);
      const instFontSize = fitTextToWidth(
        ctx,
        `(${payload.institution})` || "Your Institution",
        instBaseSize,
        '"Times New Roman", serif',
        width * 0.5
      );
      ctx.font = `${instFontSize}px "Times New Roman", serif`;
      ctx.fillText(
        `(${payload.institution})` || "Your Institution",
        width / 2,
        height * INSTITUTION_Y_RATIO
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
      <div className="grid w-full max-w-6xl gap-6 md:grid-cols-[320px_1fr]">
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
            className="relative w-full overflow-hidden rounded-xl bg-white md:min-h-[420px]"
            style={{
              aspectRatio: "117 / 85",
              backgroundImage: "url('/cert.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 px-6 md:px-10">
              <div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-semibold text-black drop-shadow-sm"
                style={{
                  top: `${NAME_Y_RATIO * 100}%`,
                  fontSize: "clamp(22px, 3.2vw, 51px)",
                  lineHeight: 1.1,
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {submitted.name || "Your Name"}
              </div>
              <div
                className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-medium text-black drop-shadow-sm"
                style={{
                  top: `${INSTITUTION_Y_RATIO * 100}%`,
                  fontSize: "clamp(13px, 1.8vw, 32px)",
                  lineHeight: 1.2,
                  maxWidth: "80%",
                  wordBreak: "break-word",
                }}
              >
                {submitted.institution || "Your Institution"}
              </div>
            </div>
          </div>
          <p className="mt-3 text-center text-sm text-zinc-500">
            Fill the form to place your details on the certificate.
          </p>
        </section>

        <section className="flex w-full flex-col gap-2 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm text-sm text-zinc-700 md:col-span-2">
          <h2 className="text-base font-semibold text-zinc-900">Creator</h2>
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <span className="font-medium text-zinc-800">Taufan Fadhilah</span>
            <span className="text-zinc-600">Phone: 082218339682</span>
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
