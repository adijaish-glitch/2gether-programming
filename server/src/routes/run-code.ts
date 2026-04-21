import { Router } from "express";
import { VM } from "vm2";
import { exec } from "child_process";
import fs from "fs-extra";
import path from "path";
import os from "os";
import { v4 as uuidv4 } from "uuid";

export const runCodeRouter = Router();

runCodeRouter.post("/run-code", async (req, res) => {
  const { code, language } = req.body as { code: string; language?: string };

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "No code provided", output: "" });
    return;
  }

  if (code.length > 50000) {
    res.status(400).json({ error: "Code too large (max 50000 chars)", output: "" });
    return;
  }

  const lang = language || "javascript";

  if (lang === "javascript" || lang === "js") {
    // Legacy JavaScript sandboxed execution using vm2
    const logs: string[] = [];
    try {
      const vm = new VM({
        timeout: 5000,
        sandbox: {
          console: {
            log: (...args: unknown[]) => logs.push(args.map((a) => String(a)).join(" ")),
            error: (...args: unknown[]) => logs.push("[error] " + args.map((a) => String(a)).join(" ")),
            warn: (...args: unknown[]) => logs.push("[warn] " + args.map((a) => String(a)).join(" ")),
            info: (...args: unknown[]) => logs.push(args.map((a) => String(a)).join(" ")),
          },
          Math, Date, JSON, parseInt, parseFloat, isNaN, isFinite,
          Number, String, Boolean, Array, Object, RegExp, Error,
          Promise, Map, Set, Symbol,
        },
      });

      const result = vm.run(code);
      const output = logs.join("\n");
      const finalOutput = result !== undefined && output === "" ? String(result) : output;
      res.json({ output: finalOutput || "(no output)", error: null });
    } catch (err) {
      res.json({
        output: logs.join("\n"),
        error: `Error: ${err instanceof Error ? err.message : String(err)}`,
      });
    }
    return;
  }

  // Handle other languages using native child process execution
  const executionId = uuidv4();
  const tmpDir = path.join(os.tmpdir(), `code-together-${executionId}`);

  try {
    await fs.ensureDir(tmpDir);
    
    let command = "";
    let filename = "";

    switch (lang) {
      case "python":
      case "py":
        filename = "main.py";
        await fs.writeFile(path.join(tmpDir, filename), code);
        // Fallback checks for 'python3' then 'python'
        command = `python ${filename} || python3 ${filename}`;
        break;
      case "cpp":
      case "cxx":
      case "cc":
        filename = "main.cpp";
        await fs.writeFile(path.join(tmpDir, filename), code);
        // Windows/Linux compatibility for executing compiled output
        command = `g++ ${filename} -o main && (./main || main.exe)`;
        break;
      case "c":
        filename = "main.c";
        await fs.writeFile(path.join(tmpDir, filename), code);
        command = `gcc ${filename} -o main && (./main || main.exe)`;
        break;
      case "java":
        filename = "Main.java"; // Assume public class is Main
        await fs.writeFile(path.join(tmpDir, filename), code);
        command = `javac ${filename} && java Main`;
        break;
      case "go":
        filename = "main.go";
        await fs.writeFile(path.join(tmpDir, filename), code);
        command = `go run ${filename}`;
        break;
      case "rust":
      case "rs":
        filename = "main.rs";
        await fs.writeFile(path.join(tmpDir, filename), code);
        command = `rustc ${filename} -o main && (./main || main.exe)`;
        break;
      default:
        res.status(400).json({ error: `Language '${lang}' is not supported yet.`, output: "" });
        await fs.remove(tmpDir);
        return;
    }

    exec(command, { cwd: tmpDir, timeout: 10000 }, async (error, stdout, stderr) => {
      // Clean up the temporary execution directory
      await fs.remove(tmpDir).catch(() => {});

      if (error) {
        let errMessage = error.message;
        if (error.killed) {
          errMessage = "Execution timed out (10s max).";
        }
        res.json({ output: stdout, error: stderr || errMessage });
      } else {
        res.json({ output: stdout || "(no output)", error: stderr ? stderr : null });
      }
    });
  } catch (err) {
    await fs.remove(tmpDir).catch(() => {});
    res.json({ output: "", error: `System Error: ${err instanceof Error ? err.message : String(err)}` });
  }
});
