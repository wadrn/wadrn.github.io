#!/usr/bin/env node
/**
 * Build script for Hexo 7.x + NexT 7.x
 */

const Hexo = require('hexo');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const isServer = args.includes('--server');
const isClean = args.includes('--clean');

async function main() {
  const start = Date.now();
  
  const hexo = new Hexo(process.cwd(), {
    debug: !!process.env.DEBUG || process.argv.includes('--debug'),
    _: true  // This sets env.init = true, enabling config loading
  });
  
  console.log('⏳ Initializing...');
  await hexo.init();
  
  // Load renderers (NexT theme's renderer.js handles .swig via Nunjucks)
  console.log('⏳ Loading renderers...');
  global.hexo = hexo;
  require('hexo-renderer-marked');
  require('hexo-renderer-stylus');
  // NOTE: Do NOT load hexo-renderer-swig here!
  // NexT's own scripts/renderer.js registers a Nunjucks-based renderer for .swig files.
  // hexo-renderer-swig uses swig-templates which is incompatible with NexT's Nunjucks syntax.
  
  // Load source and theme (this also loads theme scripts like renderer.js)
  console.log('⏳ Loading source & theme...');
  await hexo.load();
  
  // Check if views are registered now
  const theme = hexo.theme;
  const viewNames = Object.keys(theme.views || {});
  console.log('   Views registered:', viewNames.join(', ') || '(none)');
  
  const postView = theme.getView('post');
  const layoutView = theme.getView('_layout');
  console.log('   post view:', postView ? '✅' : '❌');
  console.log('   _layout view:', layoutView ? '✅' : '❌');
  
  // Clean
  if (isClean) {
    console.log('\n🧹 Cleaning...');
    await hexo.call('clean', {});
  }
  
  // Generate!
  console.log('\n🔨 Generating...');
  await hexo.call('generate', {});
  
  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  const posts = hexo.locals.get('posts').toArray();
  console.log(`\n✅ Done in ${elapsed}s | 📝 ${posts.length} posts | 📂 ${hexo.public_dir}`);
  
  // Verify output
  const samplePost = `${hexo.public_dir}/2018/01/04/2018-01-04-binarySearch/index.html`;
  let htmlSize = 0;
  if (fs.existsSync(samplePost)) htmlSize = fs.statSync(samplePost).size;
  console.log(`   📄 Sample HTML: ${(htmlSize/1024).toFixed(1)}KB ${htmlSize > 0 ? '✅' : '❌'}`);
  
  if (isServer) {
    console.log('\n🌐 http://localhost:4000');
    await hexo.call('server', { port: 4000 });
    return new Promise(() => {});
  }
}

main().catch(err => {
  console.error('❌', err.message || err);
  process.exit(1);
});
