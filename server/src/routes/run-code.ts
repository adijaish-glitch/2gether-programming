import { Router } from "express";
import { VM } from "vm2";

export const runCodeRouter = Router();

runCodeRouter.post("/run-code", (req, res) => {
  const { code } = req.body as { code: string };

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "No code provided", output: "" });
    return;
  }

  if (code.length > 50000) {
    res.status(400).json({ error: "Code too large (max 50000 chars)", output: "" });
    return;
  }

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
});
