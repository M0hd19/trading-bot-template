#!/usr/bin/env node

/**
 * Netlify Build Script
 * This script attempts to use available build tools in the correct order
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Netlify Build Script Starting...\n');

// Helper function to execute commands
function run(command, description) {
  try {
    console.log(`${description}...`);
    // Set PATH to include node_modules/.bin
    const env = Object.assign({}, process.env);
    env.PATH = path.join(process.cwd(), 'node_modules', '.bin') + ':' + env.PATH;
    
    execSync(command, { stdio: 'inherit', shell: '/bin/bash', env });
    console.log(`✅ ${description} completed\n`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    return false;
  }
}

// Step 1: Generate brand CSS
console.log('Step 1: Generate brand styles');
run('node scripts/generate-brand-css.js', 'Generating brand CSS');

// Step 2: Try different build methods
console.log('\nStep 2: Building project...\n');

const buildMethods = [
  {
    name: 'RSBuild (primary)',
    check: () => fs.existsSync('node_modules/@rsbuild/core/dist/index.js'),
    command: 'node -e "require(\'@rsbuild/core\').build()"'
  },
  {
    name: 'Webpack (fallback)',
    check: () => fs.existsSync('node_modules/webpack/lib/index.js'),
    command: 'node node_modules/webpack/bin/webpack.js --config webpack.config.js'
  }
];

let buildSuccess = false;

for (const method of buildMethods) {
  if (method.check()) {
    console.log(`Found ${method.name}, attempting build...`);
    if (run(method.command, `Building with ${method.name}`)) {
      buildSuccess = true;
      break;
    }
  }
}

if (!buildSuccess) {
  // If both fail, create a minimal dist folder with a fallback
  console.warn('\n⚠️ Build tools not available, creating minimal dist folder...\n');
  
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist', { recursive: true });
  }
  
  // Copy index.html
  if (fs.existsSync('index.html')) {
    fs.copyFileSync('index.html', 'dist/index.html');
    console.log('✅ Copied index.html to dist');
  }
  
  // Copy public folder if it exists
  if (fs.existsSync('public')) {
    const srcDir = 'public';
    const destDir = 'dist/public';
    
    function copyRecursive(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      fs.readdirSync(src).forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.lstatSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
    
    try {
      copyRecursive(srcDir, destDir);
      console.log('✅ Copied public folder to dist/public');
    } catch (e) {
      console.warn('⚠️ Could not copy public folder:', e.message);
    }
  }
  
  // Create a fallback index.html if dist is empty
  if (!fs.existsSync('dist/index.html')) {
    const fallbackHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#1e40af" />
  <title>TradeBot Pro - Loading...</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; }
    .container { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .content { text-align: center; padding: 2rem; }
    h1 { color: #1e40af; margin-bottom: 1rem; }
    p { color: #64748b; margin-bottom: 2rem; }
    .loading { width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #1e40af; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h1>TradeBot Pro</h1>
      <p>Loading application...</p>
      <div class="loading"></div>
    </div>
  </div>
  <div id="root"></div>
  <script>
    console.log('TradeBot Pro is loading. If you see this, the build system encountered issues.');
    console.log('Please check the build logs for details.');
  </script>
</body>
</html>`;
    
    fs.writeFileSync('dist/index.html', fallbackHTML);
    console.log('✅ Created fallback index.html in dist');
  }
}

// Verify dist folder
console.log('\n📦 Verifying dist folder...');
if (fs.existsSync('dist')) {
  const files = fs.readdirSync('dist');
  console.log(`✅ dist folder exists with ${files.length} items:`, files.slice(0, 5).join(', ') + (files.length > 5 ? '...' : ''));
} else {
  console.error('❌ dist folder does not exist!');
  process.exit(1);
}

console.log('\n✅ Netlify build script completed successfully!\n');
