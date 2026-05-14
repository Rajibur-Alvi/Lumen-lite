"use client";

import { useState } from "react";
import { Mic, Sparkles, Download, Loader2, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import pptxgen from "pptxgenjs";

export default function LumenLite() {
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (transcript.length < 50) {
      setError("Transcript is too short (min 50 chars)");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: JSON.stringify({ transcript }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setData(result);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadPPTX = () => {
    if (!data?.slides) return;
    const pptx = new pptxgen();
    
    data.slides.forEach((slide: any) => {
      const s = pptx.addSlide();
      s.background = { fill: "0F172A" };
      
      s.addText(slide.title, {
        x: 0.5, y: 0.5, w: "90%", h: 1,
        fontSize: 32, color: "22D3EE", bold: true,
      });

      s.addText(slide.content.join("\n"), {
        x: 0.5, y: 1.5, w: "90%", h: 3,
        fontSize: 18, color: "FFFFFF", bullet: true,
      });

      s.addNotes(slide.speakerNotes);
    });

    pptx.writeFile({ fileName: `Lumen_${data.clientInfo.name || "Presentation"}.pptx` });
  };

  return (
    <main className="min-h-screen bg-lumen-bg text-white p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-lumen-cyan rounded-lg flex items-center justify-center">
              <Sparkles className="text-black w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">LUMEN <span className="text-lumen-cyan">LITE</span></h1>
          </div>
          <p className="text-xs text-white/40 uppercase tracking-widest">Efficiency Mode</p>
        </header>

        {!data ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-bold">What did the client say?</h2>
              <p className="text-white/50">Paste your raw meeting notes below. Let AI do the heavy lifting.</p>
            </div>

            <div className="relative group">
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Speaker 1: We have a problem with... Speaker 2: Our current budget is..."
                className="w-full h-[400px] bg-lumen-surface border border-white/10 rounded-2xl p-6 text-sm font-mono focus:outline-none focus:border-lumen-cyan/50 transition-all resize-none"
              />
              <div className="absolute bottom-4 right-4 text-[10px] text-white/20">
                {transcript.length} chars
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-4 rounded-xl">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <button
              onClick={analyze}
              disabled={loading || !transcript}
              className="w-full h-14 bg-lumen-cyan text-black font-bold rounded-2xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
              {loading ? "Analyzing..." : "Analyze & Build Deck"}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-lumen-surface p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Client</p>
                <h3 className="text-xl font-bold mt-1 text-lumen-cyan">{data.clientInfo.name}</h3>
                <p className="text-xs text-white/50">{data.clientInfo.industry}</p>
              </div>
              <div className="bg-lumen-surface p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Urgency</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{data.roi.urgencyScore}/10</h3>
                  <span className="text-xs text-white/50">{data.roi.timeline}</span>
                </div>
              </div>
              <div className="bg-lumen-surface p-6 rounded-2xl border border-white/5">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Est. Bleed</p>
                <h3 className="text-xl font-bold mt-1 text-red-400">{data.roi.monthlyBleed}</h3>
                <p className="text-xs text-white/50">per month</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={downloadPPTX}
                className="flex-1 h-14 bg-white text-black font-bold rounded-2xl hover:bg-lumen-cyan transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PowerPoint
              </button>
              <button
                onClick={() => { setData(null); setTranscript(""); }}
                className="h-14 px-8 bg-white/5 border border-white/10 text-white font-medium rounded-2xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                New Deck
              </button>
            </div>

            {/* Slide Preview List */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-white/50 px-2">Generated Slides ({data.slides.length})</h3>
              <div className="grid gap-4">
                {data.slides.map((slide: any) => (
                  <div key={slide.slideNumber} className="bg-lumen-surface border border-white/5 rounded-2xl p-6 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-lumen-cyan">{slide.title}</h4>
                      <span className="text-[10px] font-mono text-white/20">SLIDE {slide.slideNumber}</span>
                    </div>
                    <ul className="space-y-2">
                      {slide.content.map((point: string, i: number) => (
                        <li key={i} className="text-sm text-white/70 flex gap-3">
                          <span className="text-lumen-cyan/50 mt-1">→</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-white/30 italic">Notes: {slide.speakerNotes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <footer className="pt-12 pb-6 text-center text-[10px] text-white/20 uppercase tracking-widest">
          Build for Efficiency • Powered by Gemini
        </footer>
      </div>
    </main>
  );
}
