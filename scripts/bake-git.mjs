import { execFileSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const OUTPUT = resolve(process.cwd(), 'src/data/founder-build.json');

function safeGit(args, fallback = '') {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

function relativeTime(secAgo) {
  if (secAgo < 60) return 'just now';
  if (secAgo < 3600) return `${Math.floor(secAgo / 60)}m ago`;
  if (secAgo < 86400) return `${Math.floor(secAgo / 3600)}h ago`;
  return `${Math.floor(secAgo / 86400)}d ago`;
}

function readLastCommit() {
  const head = safeGit(['rev-parse', '--show-toplevel']);
  if (!head) return null;

  const ts = safeGit(['log', '-1', '--format=%ct']);
  const msg = safeGit(['log', '-1', '--format=%s']);
  const hash = safeGit(['log', '-1', '--format=%h']);
  if (!ts) return null;

  const secAgo = Math.floor(Date.now() / 1000) - parseInt(ts, 10);
  return {
    repo: head.split('/').pop() || 'unknown',
    msg: msg.length > 60 ? msg.slice(0, 57) + '...' : msg,
    hash,
    relativeTime: relativeTime(secAgo),
    timestamp: parseInt(ts, 10) * 1000,
  };
}

const data = {
  lastCommit: readLastCommit(),
  buildTime: new Date().toISOString(),
};

mkdirSync(dirname(OUTPUT), { recursive: true });
writeFileSync(OUTPUT, JSON.stringify(data, null, 2));
console.log(`[bake-git] wrote ${OUTPUT}: ${data.lastCommit?.repo} · ${data.lastCommit?.relativeTime}`);
