const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const bin = path.join(root, 'bin', 'github-project-check.js');

function run(args, options = {}) {
  const result = spawnSync(process.execPath, [bin, ...args], {
    cwd: options.cwd || root,
    encoding: 'utf8',
  });

  if (options.expectFailure) {
    assert.notStrictEqual(result.status, 0, `expected command to fail: ${args.join(' ')}`);
  } else {
    assert.strictEqual(
      result.status,
      0,
      `command failed: ${args.join(' ')}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`,
    );
  }

  return result;
}

function withTempDir(name, callback) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));
  try {
    callback(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function assertInstalled(target) {
  assertFile(target, '.claude/skills/github-checklist/SKILL.md');
  assertFile(target, '.claude/skills/github-checklist/CHECKLISTS.md');
  assertFile(target, '.claude/skills/github-checklist/README.md');
  assertFile(target, '.claude/skills/github-project-check/SKILL.md');
  assertFile(target, '.claude/skills/github-project-check/CHECKLIST.md');
  assertFile(target, '.claude/skills/github-project-check/RULES.md');
  assertFile(target, '.claude/skills/github-project-check/REPORT_TEMPLATE.md');
  assertFile(target, '.claude/skills/github-project-check/README.md');
}

function assertFile(target, relativePath) {
  const file = path.join(target, relativePath);
  assert.ok(fs.statSync(file).isFile(), `expected file to exist: ${file}`);
}

function writeFile(target, relativePath, content) {
  const file = path.join(target, relativePath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

function readFile(target, relativePath) {
  return fs.readFileSync(path.join(target, relativePath), 'utf8');
}

function testDefaultInstall() {
  withTempDir('github-project-check-install', (target) => {
    const result = run(['install', '--target', target]);
    assert.match(result.stdout, /Installed: 2\. Skipped: 0/);
    assertInstalled(target);
  });
}

function testImplicitInstallCommand() {
  withTempDir('github-project-check-implicit', (target) => {
    run(['--target', target]);
    assertInstalled(target);
  });
}

function testSkipExistingPreservesFiles() {
  withTempDir('github-project-check-skip', (target) => {
    run(['install', '--target', target]);
    writeFile(target, '.claude/skills/github-checklist/local-note.txt', 'keep me');

    const result = run(['install', '--target', target]);
    assert.match(result.stdout, /\[skip\] github-checklist already exists/);
    assert.match(result.stdout, /\[skip\] github-project-check already exists/);
    assert.strictEqual(readFile(target, '.claude/skills/github-checklist/local-note.txt'), 'keep me');
  });
}

function testForceOverwritesManagedSkillDirectory() {
  withTempDir('github-project-check-force', (target) => {
    run(['install', '--target', target]);
    writeFile(target, '.claude/skills/github-checklist/local-note.txt', 'remove me');

    const result = run(['install', '--target', target, '--force']);
    assert.match(result.stdout, /\[overwrite\]/);
    assertInstalled(target);
    assert.ok(
      !fs.existsSync(path.join(target, '.claude/skills/github-checklist/local-note.txt')),
      'expected --force to replace the managed skill directory',
    );
  });
}

function testBackupPreservesExistingDirectory() {
  withTempDir('github-project-check-backup', (target) => {
    run(['install', '--target', target]);
    writeFile(target, '.claude/skills/github-checklist/local-note.txt', 'backup me');

    const result = run(['install', '--target', target, '--backup']);
    assert.match(result.stdout, /\[backup\]/);
    assertInstalled(target);

    const skillsDir = path.join(target, '.claude', 'skills');
    const backupDirs = fs.readdirSync(skillsDir).filter((name) => name.startsWith('github-checklist.backup-'));
    assert.strictEqual(backupDirs.length, 1, `expected one backup directory, got ${backupDirs.join(', ')}`);
    assert.strictEqual(
      fs.readFileSync(path.join(skillsDir, backupDirs[0], 'local-note.txt'), 'utf8'),
      'backup me',
    );
  });
}

function testDryRunDoesNotWriteFiles() {
  withTempDir('github-project-check-dry-run', (target) => {
    const result = run(['install', '--target', target, '--dry-run']);
    assert.match(result.stdout, /Dry run enabled/);
    assert.ok(!fs.existsSync(path.join(target, '.claude')), 'expected dry-run to avoid creating .claude');
  });
}

function testInvalidFlagCombination() {
  const result = run(['install', '--force', '--backup'], { expectFailure: true });
  assert.strictEqual(result.status, 2);
  assert.match(result.stderr, /Use either --force or --backup/);
}

function testHelpAndVersion() {
  const help = run(['--help']);
  assert.match(help.stdout, /Usage:/);

  const version = run(['--version']);
  assert.match(version.stdout.trim(), /^\d+\.\d+\.\d+/);
}

const tests = [
  testDefaultInstall,
  testImplicitInstallCommand,
  testSkipExistingPreservesFiles,
  testForceOverwritesManagedSkillDirectory,
  testBackupPreservesExistingDirectory,
  testDryRunDoesNotWriteFiles,
  testInvalidFlagCombination,
  testHelpAndVersion,
];

for (const test of tests) {
  test();
  console.log(`✓ ${test.name}`);
}

console.log(`All ${tests.length} installer tests passed.`);
