/**
 * One-time codemod: with the automatic JSX runtime (React 19 + Vite), the default
 * `React` import is unnecessary in files that only use JSX or named hooks.
 * Removes the default import while keeping named specifiers and files that
 * reference React.* APIs.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const files = execSync('git ls-files "src/**/*.jsx" "src/**/*.js"', { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);

let changed = 0;
for (const file of files) {
  const source = readFileSync(file, 'utf8');
  const importRegex = /^import\s+React\s*(?:,\s*\{([^}]*)\})?\s+from\s+['"]react['"];?\s*$/m;
  const match = source.match(importRegex);
  if (!match) continue;

  const withoutImport = source.replace(importRegex, '');
  if (/\bReact\s*[.({]/.test(withoutImport)) continue; // React.* still used

  const named = match[1] ? match[1].trim() : '';
  const replacement = named ? `import { ${named} } from 'react';` : '';
  writeFileSync(file, withoutImport.replace(/^\n/, replacement ? `${replacement}\n\n` : ''));
  changed += 1;
}
console.log(`Removed default React import from ${changed} files.`);
