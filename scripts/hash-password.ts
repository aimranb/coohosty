import { hash } from 'bcryptjs';
import readline from 'node:readline';
async function outputHash(password: string) {
  if (password.length < 14 || Buffer.byteLength(password, 'utf8') > 72) { console.error('Use at least 14 characters, at most 72 UTF-8 bytes.'); process.exitCode = 1; return; }
  console.log(await hash(password, 12));
}
if (process.stdin.isTTY) {
  process.stderr.write('Password (hidden input): ');
  process.stdin.setRawMode(true); process.stdin.setEncoding('utf8'); process.stdin.resume();
  let password = '';
  const listener = async (chunk: string) => {
    for (const char of chunk) {
      if (char === '\u0003') { process.stdin.setRawMode(false); process.exit(130); }
      if (char === '\r' || char === '\n') { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.off('data', listener); process.stderr.write('\n'); await outputHash(password); return; }
      if (char === '\u007f' || char === '\b') password = password.slice(0, -1);
      else if (char >= ' ') password += char;
    }
  };
  process.stdin.on('data', listener);
} else {
  const rl = readline.createInterface({ input: process.stdin, terminal: false });
  rl.once('line', async password => { rl.close(); await outputHash(password); });
}
