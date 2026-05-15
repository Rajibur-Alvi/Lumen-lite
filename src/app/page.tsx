"use client";

import { useState, useEffect } from "react";
import { Sparkles, Brain, Loader2, FileUp, ChevronDown, ChevronUp, Download } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { AnalysisSchema } from "@/lib/schema";

export default function LumenUltra() {
  const [transcript, setTranscript] = useState("");
  const [clientName, setClientName] = useState("");
  const [industry, setIndustry] = useState("");
  const [status, setStatus] = useState("Checking system...");
  const [expandedSlide, setExpandedSlide] = useState<number | null>(0);

  // ✅ useObject handles streaming + parsing the structured AI response correctly
  const { object: analysis, submit, isLoading, error } = useObject({
    api: "/api/analyze",
    schema: AnalysisSchema,
  });

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) =>
        setStatus(data.env?.hasGeminiKey ? "System Ready" : "⚠ Missing API Keys")
      )
      .catch(() => setStatus("System Offline"));
  }, []);

  useEffect(() => {
    if (isLoading) setStatus("Analyzing Stream...");
    else if (analysis) setStatus("Analysis Complete");
    else if (error) setStatus("Error: " + error.message);
  }, [isLoading, analysis, error]);

  const onDrop = (files: File[]) => {
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) =>
      setTranscript(
        (prev) =>
          prev + "\n\n--- Source: " + file.name + " ---\n" + (e.target?.result as string)
      );
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const activateIntelligence = () => {
    if (!transcript.trim()) {
      setStatus("⚠ Please paste a transcript first");
      return;
    }
    // ✅ submit() sends the body and streams the structured response back
    submit({ transcript, clientName, industry });
  };

  const downloadPptx = async () => {
    if (!analysis?.slides) return;
    const pptxgen = (await import("pptxgenjs")).default;
    const prs = new pptxgen();
    analysis.slides.forEach((slide) => {
      if (!slide) return;
      const s = prs.addSlide();
      s.addText(slide.title ?? "", {
        x: 0.5, y: 0.3, w: 9, h: 1,
        fontSize: 28, bold: true, color: "0F172A",
      });
      (slide.content ?? []).forEach((line, i) => {
        s.addText(`• ${line}`, {
          x: 0.5, y: 1.5 + i * 0.5, w: 9, h: 0.5,
          fontSize: 14, color: "334155",
        });
      });
      if (slide.speakerNotes) {
        s.addNotes(slide.speakerNotes);
      }
    });
    await prs.writeFile({ fileName: `${clientName || "LumenUltra"}_Deck.pptx` });
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 p-6 md:p-12 font-sans overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-100 pb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                LUMEN <span className="text-cyan-600">ULTRA</span>
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                Autonomous Strategy Agent
              </p>
            </div>
          </div>
          <div className="text-xs font-bold bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-slate-600">
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> {status}
              </span>
            ) : status}
          </div>
        </header>

        {/* Input section */}
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Absolute Intelligence.<br />Infinite Advantage.
            </h2>
            <div className="space-y-4">
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client Name"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <input
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Industry"
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div
              {...getRootProps()}
              className="h-16 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <input {...getInputProps()} />
              <FileUp className="w-4 h-4 text-slate-400 mr-2" />
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Ingest Docs
              </span>
            </div>

            {/* ROI Panel — streams in as data arrives */}
            {analysis?.roi && (
              <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
                  ROI Intelligence
                </h3>
                {analysis.roi.monthlyBleed && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Monthly Cost of Inaction</p>
                    <p className="text-2xl font-extrabold text-red-400">{analysis.roi.monthlyBleed}</p>
                  </div>
                )}
                {analysis.roi.timeline && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Required Timeline</p>
                    <p className="text-lg font-bold">{analysis.roi.timeline}</p>
                  </div>
                )}
                {analysis.roi.urgencyScore !== undefined && (
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Urgency Score</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-cyan-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(analysis.roi.urgencyScore / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-cyan-400 font-bold">{analysis.roi.urgencyScore}/10</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Strategy panel */}
            {analysis?.strategy && (
              <div className="bg-cyan-50 border border-cyan-100 rounded-2xl p-6 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-cyan-700">
                  Key Strategy
                </h3>
                {analysis.strategy.keyMessage && (
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                    "{analysis.strategy.keyMessage}"
                  </p>
                )}
                {(analysis.strategy.objections?.length ?? 0) > 0 && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Objection Handlers
                    </p>
                    {analysis.strategy.objections!.map((obj, i) => {
                      if (!obj) return null;
                      return (
                        <div key={i} className="bg-white rounded-xl p-3 border border-cyan-100">
                          <p className="text-xs font-bold text-red-500 mb-1">❝ {obj.claim}</p>
                          <p className="text-xs text-slate-600">{obj.response}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 space-y-6">
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Paste transcript here..."
              className="w-full h-[400px] border border-slate-200 rounded-2xl p-6 text-sm font-mono outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
            />
            <button
              onClick={activateIntelligence}
              disabled={isLoading}
              className="w-full h-16 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles />}
              ACTIVATE ULTRA INTELLIGENCE
            </button>

            {/* Error state */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                ⚠ {error.message}
              </div>
            )}

            {/* Client info streamed in */}
            {analysis?.clientInfo && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">
                  Client Profile
                </h3>
                {analysis.clientInfo.name && (
                  <p className="text-lg font-bold text-slate-900">{analysis.clientInfo.name}</p>
                )}
                {analysis.clientInfo.industry && (
                  <p className="text-sm text-slate-500">{analysis.clientInfo.industry}</p>
                )}
                {(analysis.clientInfo.painPoints?.length ?? 0) > 0 && (
                  <ul className="mt-3 space-y-1">
                    {analysis.clientInfo.painPoints!.map((p, i) => (
                      <li key={i} className="text-sm text-slate-700 flex gap-2">
                        <span className="text-red-400">•</span> {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Slides section */}
        {(analysis?.slides?.length ?? 0) > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold tracking-tight">
                Generated Deck
                <span className="ml-3 text-sm font-normal text-slate-400">
                  {analysis!.slides!.length} slides
                </span>
              </h2>
              <button
                onClick={downloadPptx}
                className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PPTX
              </button>
            </div>

            <div className="space-y-3">
              {analysis!.slides!.map((slide, i) => {
                if (!slide) return null;
                return (
                  <div
                    key={i}
                    className="border border-slate-200 rounded-2xl overflow-hidden"
                  >
                    {/* Slide header — always visible */}
                    <button
                      onClick={() => setExpandedSlide(expandedSlide === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-lg bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {slide.slideNumber ?? i + 1}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{slide.title}</p>
                          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                            {slide.layout}
                          </span>
                        </div>
                      </div>
                      {expandedSlide === i
                        ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
                    </button>

                    {/* Slide content — expanded */}
                    {expandedSlide === i && (
                      <div className="px-5 pb-5 space-y-4 border-t border-slate-100">
                        {(slide.content?.length ?? 0) > 0 && (
                          <ul className="space-y-2 pt-4">
                            {slide.content!.map((line, j) => (
                              <li key={j} className="flex gap-3 text-sm text-slate-700">
                                <span className="text-cyan-500 font-bold mt-0.5">→</span>
                                {line}
                              </li>
                            ))}
                          </ul>
                        )}
                        {slide.speakerNotes && (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-1">
                              Speaker Notes
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed">
                              {slide.speakerNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
