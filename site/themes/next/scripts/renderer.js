/* global hexo */

'use strict';

const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

// Shared Nunjucks environment using the theme layout directory as search path
let env = null;

function getEnv() {
  if (env) return env;

  const layoutDir = path.join(hexo.theme_dir, 'layout');

  // Collect ALL subdirectories under layout as additional search paths
  // so that relative-path includes (like `include 'google-analytics.swig'`)
  // from subdirectory index.swig files can be resolved.
  const searchPaths = [layoutDir];
  function collectDirs(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        searchPaths.push(fullPath);
        collectDirs(fullPath);
      }
    }
  }
  collectDirs(layoutDir);

  const loader = new nunjucks.FileSystemLoader(searchPaths, {
    noCache: true
  });

  env = new nunjucks.Environment(loader, {
    autoescape: false
  });

  // Add custom filters
  env.addFilter('attr', (dictionary, key, value) => {
    dictionary[key] = value;
    return dictionary;
  });
  env.addFilter('json', dictionary => {
    return JSON.stringify(dictionary || '');
  });

  return env;
}

function njkCompile(data) {
  const envInstance = getEnv();
  // Pre-process: add "with context" to all "import ... as ..." statements
  // so that macros can access parent scope variables (config, theme, helpers, etc.)
  // This matches Swig's default behavior where imports inherit the calling context.
  let text = data.text.replace(
    /\bimport\s+(.+?)\s+as\s+(\w+)\s*(?!with\s+context)/g,
    'import $1 as $2 with context'
  );
  return nunjucks.compile(text, envInstance, data.path);
}

function njkRenderer(data, locals) {
  return njkCompile(data).render(locals);
}

// Return a compiled renderer.
njkRenderer.compile = function(data) {
  const compiledTemplate = njkCompile(data);
  // Need a closure to keep the compiled template.
  return function(locals) {
    return compiledTemplate.render(locals);
  };
};

hexo.extend.renderer.register('njk', 'html', njkRenderer);
hexo.extend.renderer.register('swig', 'html', njkRenderer);
