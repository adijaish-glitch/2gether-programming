import { useMutation } from "@tanstack/react-query";

interface RunCodeResponse {
  output: string;
  error?: string | null;
}

export function useRunCode() {
  return useMutation({
    mutationFn: async (code: string): Promise<RunCodeResponse> => {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.error || `Server error: ${res.status}`);
      }
      return res.json();
    },
  });
}
