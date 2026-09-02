# Workflow & process taste

- Keep changes strictly scoped: touch only the exact sections/features named, and never redesign unrelated pages, the global design system, content, or backend behavior as a side effect. Confidence: 0.9
- Inspect the actual implementation and existing architecture before changing anything; don't assume the cause of a bug or guess the design system from memory ("the existing implementation is the source of truth"). Confidence: 0.9
- Diagnose and fix root causes rather than masking problems — e.g., don't hide API errors behind generic messages or fake success states; surface the real error in console/server logs while keeping the UI clean. Confidence: 0.85
- Before coding, trace the relevant data flow (frontend → API/backend → database → component) and identify reusable components so changes build on the existing system. Confidence: 0.8
- When delivering a bug fix, wants an explicit summary of root cause, files changed, whether schema changed, any SQL to run, and how the fix was verified. Confidence: 0.7
- For presentational/layout changes, verifies against content-length edge cases (very short, medium, very long content) and both desktop and mobile before considering it done. Confidence: 0.55
