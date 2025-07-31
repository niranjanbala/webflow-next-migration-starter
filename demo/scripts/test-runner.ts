#!/usr/bin/env ts-node

import { spawn } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';

interface TestConfig {
  type: 'unit' | 'integration' | 'e2e' | 'all';
  watch?: boolean;
  coverage?: boolean;
  verbose?: boolean;
  pattern?: string;
  browser?: string;
  headless?: boolean;
}

class TestRunner {
  private config: TestConfig;

  constructor(config: TestConfig) {
    this.config = config;
    this.ensureDirectories();
  }

  private ensureDirectories() {
    const dirs = [
      'test-results',
      'test-results/coverage',
      'test-results/screenshots',
      'test-results/videos'
    ];

    dirs.forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  async runTests(): Promise<void> {
    console.log('🚀 Starting test execution...');
    console.log(`Test type: ${this.config.type}`);
    
    try {
      switch (this.config.type) {
        case 'unit':
          await this.runUnitTests();
          break;
        case 'integration':
          await this.runIntegrationTests();
          break;
        case 'e2e':
          await this.runE2ETests();
          break;
        case 'all':
          await this.runAllTests();
          break;
        default:
          throw new Error(`Unknown test type: ${this.config.type}`);
      }
      
      console.log('✅ All tests completed successfully!');
    } catch (error) {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    }
  }

  private async runUnitTests(): Promise<void> {
    console.log('🧪 Running unit tests...');
    
    const args = [
      'test',
      '--testPathPattern=\\.test\\.(js|jsx|ts|tsx)$',
      '--testPathIgnorePatterns=/e2e/',
    ];

    if (this.config.coverage) {
      args.push('--coverage');
    }

    if (this.config.watch) {
      args.push('--watch');
    }

    if (this.config.verbose) {
      args.push('--verbose');
    }

    if (this.config.pattern) {
      args.push('--testNamePattern', this.config.pattern);
    }

    await this.runCommand('npx', ['jest', ...args]);
  }

  private async runIntegrationTests(): Promise<void> {
    console.log('🔗 Running integration tests...');
    
    const args = [
      'test',
      '--testPathPattern=\\.integration\\.(js|jsx|ts|tsx)$',
    ];

    if (this.config.coverage) {
      args.push('--coverage');
    }

    if (this.config.verbose) {
      args.push('--verbose');
    }

    await this.runCommand('npx', ['jest', ...args]);
  }

  private async runE2ETests(): Promise<void> {
    console.log('🌐 Running E2E tests...');
    
    const args = ['test'];

    if (this.config.browser) {
      args.push('--project', this.config.browser);
    }

    if (this.config.headless === false) {
      args.push('--headed');
    }

    if (this.config.pattern) {
      args.push('--grep', this.config.pattern);
    }

    await this.runCommand('npx', ['playwright', ...args]);
  }

  private async runAllTests(): Promise<void> {
    console.log('🎯 Running all tests...');
    
    // Run unit tests first
    await this.runUnitTests();
    
    // Then integration tests
    await this.runIntegrationTests();
    
    // Finally E2E tests
    await this.runE2ETests();
  }

  private runCommand(command: string, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: 'inherit',
        shell: true
      });

      child.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      child.on('error', (error) => {
        reject(error);
      });
    });
  }
}

// CLI interface
function parseArgs(): TestConfig {
  const args = process.argv.slice(2);
  const config: TestConfig = {
    type: 'unit'
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--type':
        config.type = args[++i] as TestConfig['type'];
        break;
      case '--watch':
        config.watch = true;
        break;
      case '--coverage':
        config.coverage = true;
        break;
      case '--verbose':
        config.verbose = true;
        break;
      case '--pattern':
        config.pattern = args[++i];
        break;
      case '--browser':
        config.browser = args[++i];
        break;
      case '--headed':
        config.headless = false;
        break;
      case '--help':
        printHelp();
        process.exit(0);
        break;
    }
  }

  return config;
}

function printHelp() {
  console.log(`
Test Runner Usage:

  npm run test:runner -- [options]

Options:
  --type <type>       Test type: unit, integration, e2e, all (default: unit)
  --watch            Run tests in watch mode
  --coverage         Generate coverage report
  --verbose          Verbose output
  --pattern <pattern> Test name pattern to match
  --browser <browser> Browser for E2E tests (chromium, firefox, webkit)
  --headed           Run E2E tests in headed mode
  --help             Show this help message

Examples:
  npm run test:runner -- --type unit --coverage
  npm run test:runner -- --type e2e --browser chromium --headed
  npm run test:runner -- --type all --verbose
  npm run test:runner -- --type unit --pattern "Button" --watch
  `);
}

// Main execution
if (require.main === module) {
  const config = parseArgs();
  const runner = new TestRunner(config);
  runner.runTests();
}

export { TestRunner, TestConfig };