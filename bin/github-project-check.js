#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SKILLS = ['github-checklist', 'github-project-check'];

function main(argv) {
  const options = parseArgs(argv);

  if (options.help) {
    printHelp();
    return 0;
  }

  if (options.version) {
    const packageJson = readPackageJson();
    console.log(packageJson.version);
    return 0;
  }

  if (options.command !== 'install') {
    throw new UsageError(`Unsupported command: ${options.command}`);
  }

  installSkills(options);
  return 0;
}

class UsageError extends Error {}

function parseArgs(argv) {
  const options = {
    command: 'install',
    target: process.cwd(),
    force: false,
    backup: false,
    dryRun: false,
    help: false,
    version: false,
  };

  const args = [...argv];
  if (args[0] && !args[0].startsWith('-')) {
    options.command = args.shift();
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    switch (arg) {
      case '--target':
      case '-t': {
        const target = args[index + 1];
        if (!target || target.startsWith('-')) {
          throw new UsageError(`${arg} requires a path value`);
        }
        options.target = path.resolve(target);
        index += 1;
        break;
      }
      case '--force':
        options.force = true;
        break;
      case '--backup':
        options.backup = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--version':
      case '-v':
        options.version = true;
        break;
      default:
        throw new UsageError(`Unknown option: ${arg}`);
    }
  }

  if (options.force && options.backup) {
    throw new UsageError('Use either --force or --backup, not both.');
  }

  return options;
}

function installSkills(options) {
  const packageRoot = path.resolve(__dirname, '..');
  const sourceRoot = path.join(packageRoot, '.claude', 'skills');
  const targetRoot = path.join(options.target, '.claude', 'skills');

  validateBundledSkills(sourceRoot);

  log(`Installing Claude Code skills into ${targetRoot}`);
  if (options.dryRun) {
    log('Dry run enabled; no files will be written.');
  }

  let installed = 0;
  let skipped = 0;

  for (const skill of SKILLS) {
    const source = path.join(sourceRoot, skill);
    const target = path.join(targetRoot, skill);

    if (fs.existsSync(target)) {
      if (options.backup) {
        const backupTarget = nextBackupPath(target);
        log(`[backup] ${target} -> ${backupTarget}`);
        if (!options.dryRun) {
          fs.mkdirSync(path.dirname(backupTarget), { recursive: true });
          fs.renameSync(target, backupTarget);
        }
      } else if (options.force) {
        log(`[overwrite] ${target}`);
        if (!options.dryRun) {
          fs.rmSync(target, { recursive: true, force: true });
        }
      } else {
        log(`[skip] ${skill} already exists. Use --force to overwrite or --backup to keep a copy.`);
        skipped += 1;
        continue;
      }
    }

    log(`[install] ${skill}`);
    if (!options.dryRun) {
      fs.mkdirSync(targetRoot, { recursive: true });
      copyDirectory(source, target);
    }
    installed += 1;
  }

  log(`Done. Installed: ${installed}. Skipped: ${skipped}.`);
}

function validateBundledSkills(sourceRoot) {
  for (const skill of SKILLS) {
    const source = path.join(sourceRoot, skill);
    if (!isDirectory(source)) {
      throw new Error(`Bundled skill directory is missing: ${source}`);
    }

    const requiredFiles = requiredFilesForSkill(skill);
    for (const file of requiredFiles) {
      const requiredPath = path.join(source, file);
      if (!isFile(requiredPath)) {
        throw new Error(`Bundled skill ${skill} is missing required file: ${file}`);
      }
    }
  }
}

function requiredFilesForSkill(skill) {
  if (skill === 'github-checklist') {
    return ['SKILL.md', 'CHECKLISTS.md', 'README.md'];
  }

  if (skill === 'github-project-check') {
    return ['SKILL.md', 'CHECKLIST.md', 'RULES.md', 'REPORT_TEMPLATE.md', 'README.md'];
  }

  return ['SKILL.md', 'README.md'];
}

function copyDirectory(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const targetPath = path.join(target, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, targetPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    } else if (entry.isSymbolicLink()) {
      const linkTarget = fs.readlinkSync(sourcePath);
      fs.symlinkSync(linkTarget, targetPath);
    }
  }
}

function nextBackupPath(target) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  let backupPath = `${target}.backup-${timestamp}`;
  let index = 1;

  while (fs.existsSync(backupPath)) {
    backupPath = `${target}.backup-${timestamp}-${index}`;
    index += 1;
  }

  return backupPath;
}

function readPackageJson() {
  const packagePath = path.resolve(__dirname, '..', 'package.json');
  return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
}

function isDirectory(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

function isFile(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

function log(message) {
  console.log(message);
}

function printHelp() {
  console.log(`github-project-check

Install bundled Claude Code skills into a target project.

Usage:
  github-project-check [install] [options]
  npx github-project-check install [options]
  npx . install [options]

Options:
  -t, --target <path>  Target project directory. Defaults to the current working directory.
      --force          Overwrite existing managed skill directories.
      --backup         Backup existing managed skill directories before installing.
      --dry-run        Print planned actions without writing files.
  -h, --help           Show this help message.
  -v, --version        Show package version.

Default behavior is safe: existing same-name skills are skipped.`);
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  if (error instanceof UsageError) {
    console.error(`Error: ${error.message}`);
    console.error('Run with --help for usage.');
    process.exitCode = 2;
  } else {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}
