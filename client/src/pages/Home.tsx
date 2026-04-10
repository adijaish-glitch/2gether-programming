import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Play, MessageSquare, Share2, ArrowRight,
  Github, Twitter, Check, Code2, Sparkles, X, User
} from "lucide-react";
import { generateRoomId } from "../lib/utils";
import { AccountSettings, randomName } from "../components/IDE/AccountSettings";

export function Home() {
  const [, setLocation] = useLocation();

  const [username, setUsername] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardName, setOnboardName] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("2gether-username");
    if (saved) {
      setUsername(saved);
    } else {
      setShowOnboarding(true);
      setOnboardName(randomName());
    }
  }, []);

  const handleStartCoding = () => {
    if (!username) {
      setShowOnboarding(true);
      return;
    }
    setLocation(`/room/${generateRoomId()}`);
  };

  const handleSaveOnboarding = () => {
    const trimmed = onboardName.trim();
    if (trimmed.length >= 2) {
      localStorage.setItem("2gether-username", trimmed);
      setUsername(trimmed);
      setShowOnboarding(false);
    }
  };

  const handleChangeUsername = (newName: string) => {
    localStorage.setItem("2gether-username", newName);
    setUsername(newName);
  };

  const scrollToJoin = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("join")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }} className="min-h-screen w-full bg-[#0f172a] text-[#f8fafc]">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/85 backdrop-blur-md border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-xl font-bold">
            <Code2 className="text-[#3b82f6]" size={24} />
            <span className="text-[#f8fafc]">2gether</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["#features", "#how-it-works", "#editor"].map((href, i) => (
              <a key={href} href={href} className="text-sm font-medium text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
                {["Features", "How it works", "Docs"][i]}
              </a>
            ))}
            
            {username ? (
              <div className="flex items-center gap-4 border-l border-[#1e293b] pl-6 ml-2">
                <AccountSettings 
                  username={username}
                  onChangeUsername={handleChangeUsername}
                />
                <motion.button
                  onClick={handleStartCoding}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2"
                >
                  Start Coding <ArrowRight size={16} />
                </motion.button>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowOnboarding(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-full font-medium text-sm flex items-center gap-2"
              >
                Get Started <ArrowRight size={16} />
              </motion.button>
            )}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] via-[#1e1a4a] to-[#0f172a] opacity-80" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontSize: "clamp(3rem,7vw,6rem)", fontWeight: 900, lineHeight: 1.05 }}
            className="tracking-tight mb-6"
          >
            Code Better,<br /><span className="text-[#3b82f6]">Together</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-xl md:text-2xl font-semibold mb-4"
          >
            2gether Programming — Real-Time Pair Programming Platform
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-[#94a3b8] mb-10 max-w-2xl"
          >
            Write, run, and debug code side-by-side with your team. No setup required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-8"
          >
            <motion.button
              onClick={handleStartCoding}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ boxShadow: "0 0 30px rgba(59,130,246,0.4)" }}
            >
              Start Coding <ArrowRight size={20} />
            </motion.button>
            <motion.a
              href="#how-it-works"
              onClick={scrollToJoin}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center w-full sm:w-auto"
            >
              Join a Room
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex items-center justify-center gap-6 text-sm text-[#64748b] flex-wrap"
          >
            {["No signup required", "Real-time sync", "Free to use"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check size={16} className="text-[#10b981]" /> {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Floating Code Card */}
        <motion.div
          initial={{ opacity: 0, x: 50, y: 50 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="hidden lg:block absolute right-12 bottom-24 bg-[#1e293b] border border-[#334155] rounded-xl p-4 shadow-2xl z-20 w-80"
          style={{ fontFamily: "monospace", fontSize: 13 }}
        >
          <div className="flex items-center justify-between mb-3 border-b border-[#334155] pb-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            </div>
            <div className="flex items-center gap-1.5 bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              Connected
            </div>
          </div>
          <div className="text-[#94a3b8]">
            <span className="text-[#c678dd]">function</span>{" "}
            <span className="text-[#61afef]">greet</span>() {"{"}
            <br />{"  "}<span className="text-[#e5c07b]">console</span>.log(
            <span className="text-[#98c379]">'Hello World'</span>);
            <br />
            {"}"}
            <br />
            <span className="text-[#61afef]">greet</span>();
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h3 className="text-[#3b82f6] text-sm font-bold tracking-[0.2em] uppercase mb-4">Features</h3>
          <h2 className="text-4xl md:text-5xl font-bold">Everything you need to code together</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { Icon: Zap, title: "Real-Time Sync", body: "Every keystroke synced instantly between collaborators with ultra-low latency." },
            { Icon: Play, title: "Live Code Execution", body: "Run JavaScript in a secure sandbox and see results immediately." },
            { Icon: MessageSquare, title: "Built-in Chat", body: "Communicate with your pair without leaving the editor context." },
            { Icon: Share2, title: "Instant Room Sharing", body: "Share a link and start coding in seconds. No accounts needed." },
          ].map(({ Icon, title, body }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: "#3b82f6" }}
              className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-[#3b82f6]/10 text-[#3b82f6] flex items-center justify-center mb-6">
                <Icon size={24} />
              </div>
              <h4 className="text-xl font-bold mb-3">{title}</h4>
              <p className="text-[#94a3b8] leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-6 bg-[#0f172a] border-y border-[#1e293b]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-[#3b82f6] text-sm font-bold tracking-[0.2em] uppercase mb-4">How it works</h3>
            <h2 className="text-4xl md:text-5xl font-bold">Get started in seconds</h2>
          </div>
          <div className="relative flex flex-col md:flex-row justify-between gap-8">
            <div className="hidden md:block absolute top-12 left-0 w-full h-[2px] border-t-2 border-dashed border-[#334155]" />
            {[
              { num: "01", title: "Create or join a room", desc: "Click 'Start Coding' to generate a secure room instantly." },
              { num: "02", title: "Share your Room ID", desc: "Send the link to your teammate so they can join." },
              { num: "03", title: "Code together in real time", desc: "See their changes happen instantly." },
              { num: "04", title: "Run and test instantly", desc: "Execute code and view console outputs side by side." },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center flex-1 p-6 md:p-0"
              >
                <div
                  className="w-24 h-24 bg-[#1e293b] border-2 border-[#3b82f6] rounded-full flex items-center justify-center mb-6"
                  style={{ boxShadow: "0 0 20px rgba(59,130,246,0.2)" }}
                >
                  <span className="text-4xl font-black">{step.num}</span>
                </div>
                <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Join Form */}
          <div id="join" className="mt-24 max-w-md mx-auto bg-[#1e293b] p-8 rounded-2xl border border-[#334155] shadow-xl">
            <h4 className="text-xl font-bold mb-2 text-center">Join Existing Room</h4>
            <p className="text-[#94a3b8] text-sm text-center mb-6">Enter a room ID shared by your teammate</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const input = form.elements.namedItem("roomId") as HTMLInputElement;
                if (input.value.trim()) setLocation(`/room/${input.value.trim()}`);
              }}
              className="flex flex-col gap-4"
            >
              <input
                name="roomId"
                type="text"
                placeholder="e.g. A1B2C3D4"
                required
                className="bg-[#0f172a] border border-[#334155] rounded-lg px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#3b82f6] font-mono uppercase tracking-wider text-center"
              />
              <button type="submit" className="bg-[#f8fafc] text-[#0f172a] hover:bg-[#e2e8f0] font-bold py-3 rounded-lg transition-colors">
                Join Room
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ONBOARDING MODAL */}
      <AnimatePresence>
        {showOnboarding && !username && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0f172a]/60 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#1a2744] border border-[#3b82f6]/30 w-[400px] rounded-2xl shadow-2xl overflow-hidden"
              style={{ boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.25)" }}
            >
              <div className="p-6">
                <div className="w-12 h-12 bg-[#3b82f6]/10 rounded-xl flex items-center justify-center text-[#3b82f6] mb-4">
                  <User size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#f8fafc] mb-2">Welcome to 2gether!</h3>
                <p className="text-[#94a3b8] text-sm mb-6">
                  What should we call you? Pick a display name to identify yourself in collaborative rooms.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#0f172a] border border-[#334155] focus-within:border-[#3b82f6]/60 focus-within:ring-1 focus-within:ring-[#3b82f6]/20 rounded-xl px-4 py-3 transition-all">
                    <input
                      value={onboardName}
                      onChange={(e) => setOnboardName(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSaveOnboarding(); }}
                      maxLength={24}
                      className="flex-1 bg-transparent text-[#f8fafc] focus:outline-none font-medium text-lg placeholder:text-[#64748b]"
                      placeholder="Your name..."
                      autoFocus
                    />
                    <button
                      onClick={() => setOnboardName(randomName())}
                      className="text-[#94a3b8] hover:text-[#3b82f6] transition-colors shrink-0 p-2 hover:bg-[#1e293b] rounded-md"
                      title="Generate random name"
                    >
                      <Sparkles size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-6 gap-3">
                    <button
                      onClick={() => setShowOnboarding(false)}
                      className="px-4 py-2.5 text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b] rounded-xl font-medium transition-colors"
                    >
                      Skip for now
                    </button>
                    <button
                      onClick={handleSaveOnboarding}
                      disabled={!onboardName.trim() || onboardName.trim().length < 2}
                      className="flex-1 bg-[#3b82f6] hover:bg-[#2563eb] text-white py-2.5 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDITOR PREVIEW */}
      <section id="editor" className="py-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">A familiar, powerful editor</h2>
          <p className="text-xl text-[#94a3b8]">Powered by Monaco — the same editor that powers VS Code</p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative rounded-xl overflow-hidden border border-[#334155] bg-[#1e1e1e]"
          style={{ boxShadow: "0 0 50px rgba(59,130,246,0.15)" }}
        >
          <div className="bg-[#252526] h-10 flex items-center px-4 border-b border-[#334155]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 text-center text-xs text-[#94a3b8]">index.js — 2gether</div>
          </div>
          <div className="flex bg-[#252526] border-b border-[#334155]">
            <div className="px-4 py-2 bg-[#1e1e1e] text-[#f8fafc] text-sm border-t-2 border-[#3b82f6] flex items-center gap-2">
              <span className="text-yellow-400">JS</span> index.js
            </div>
            <div className="px-4 py-2 text-[#94a3b8] text-sm flex items-center gap-2">
              <span className="text-blue-400">TS</span> utils.ts
            </div>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed overflow-x-auto flex">
            <div className="text-[#64748b] text-right pr-4 select-none flex flex-col min-w-[2.5rem]">
              {[...Array(10)].map((_, i) => <span key={i}>{i + 1}</span>)}
            </div>
            <div className="text-[#d4d4d4] flex flex-col whitespace-pre">
              <span><span className="text-[#6a9955]">// A real-time collaborative algorithm</span></span>
              <span><span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">fibonacci</span> = (<span className="text-[#9cdcfe]">n</span>) {"=> {"}</span>
              <span>{"  "}<span className="text-[#569cd6]">if</span> (n {"<="} <span className="text-[#b5cea8]">1</span>) <span className="text-[#569cd6]">return</span> n;</span>
              <span>{"  "}<span className="text-[#569cd6]">return</span> fibonacci(n - <span className="text-[#b5cea8]">1</span>) + fibonacci(n - <span className="text-[#b5cea8]">2</span>);</span>
              <span>{"}"}</span>
              <span />
              <span><span className="text-[#6a9955]">// Share this code instantly!</span></span>
              <span><span className="text-[#569cd6]">const</span> <span className="text-[#4fc1ff]">result</span> = fibonacci(<span className="text-[#b5cea8]">10</span>);</span>
              <span><span className="text-[#4ec9b0]">console</span>.<span className="text-[#dcdcaa]">log</span>(<span className="text-[#98c379]">"Result:"</span>, result);</span>
            </div>
          </div>
          <div className="bg-[#007acc] text-white h-6 flex items-center justify-between px-3 text-xs">
            <div className="flex items-center gap-4">
              <span>Ln 7, Col 18</span><span>Spaces: 2</span><span>UTF-8</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1"><Check size={12} /> Connected</span>
              <span>JavaScript</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* DEVELOPER BENEFITS */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-[#1e293b]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { num: "10x", title: "Faster debugging", text: "Two heads are better than one. Find bugs faster by reviewing code together." },
            { num: "2x", title: "Better collaboration", text: "Eliminate context switching and screen sharing lag. Code together natively." },
            { num: "100%", title: "Real-time sync", text: "Every keystroke and cursor movement is synced instantly." },
          ].map(({ num, title, text }, i) => (
            <div key={i} className="text-center md:text-left">
              <div
                className="text-5xl md:text-6xl font-black mb-4 inline-block"
                style={{ background: "linear-gradient(to right, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
              >
                {num}
              </div>
              <h4 className="text-2xl font-bold mb-3">{title}</h4>
              <p className="text-[#94a3b8]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0,rgba(15,23,42,1)_100%)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(#f8fafc 1px, transparent 1px)", backgroundSize: "24px 24px" }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Start Pair Programming Today</h2>
          <p className="text-xl text-[#94a3b8] mb-10 max-w-2xl mx-auto">
            Join thousands of developers coding together in real time. Free to use, no signup required.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button
              onClick={handleStartCoding}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2"
            >
              Create a Room <ArrowRight size={20} />
            </motion.button>
            <motion.button
              onClick={handleStartCoding}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#1e293b] hover:bg-[#334155] text-[#f8fafc] px-8 py-4 rounded-full font-bold text-lg"
            >
              Try Demo
            </motion.button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a1120] border-t border-[#1e293b] pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="flex items-center gap-2 font-mono text-xl font-bold mb-4">
              <Code2 className="text-[#3b82f6]" size={24} />
              <span>2gether</span>
            </div>
            <p className="text-[#64748b] text-sm leading-relaxed">
              A real-time pair programming platform built for developers.
            </p>
          </div>
          <div>
            <h5 className="font-bold mb-4">Product</h5>
            <ul className="space-y-3">
              {["Features", "How it Works", "Editor", "Docs"].map((l) => (
                <li key={l}><a href="#" className="text-[#94a3b8] hover:text-[#3b82f6] transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Company</h5>
            <ul className="space-y-3">
              {["About", "Contact", "Blog"].map((l) => (
                <li key={l}><a href="#" className="text-[#94a3b8] hover:text-[#3b82f6] transition-colors text-sm">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-4">Connect</h5>
            <div className="flex gap-4">
              {[Github, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-[#3b82f6] transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-[#1e293b] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#64748b] text-sm">© 2025 2gether Programming. Built for developers.</p>
          <div className="flex items-center gap-2 text-[#64748b] text-sm">
            <div className="w-2 h-2 rounded-full bg-[#10b981]" /> All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
