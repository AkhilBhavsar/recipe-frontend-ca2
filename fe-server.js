var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = defaultConfig;

function getStyles() {
  return fs.readFileSync('./public/default.css', {encoding: 'utf8'});
}

function renderPage(recipes, log, savedMsg) {
  const recipeCards = recipes.map(r => `
    <div class="recipe-card">
      <div class="recipe-header">
        <span class="recipe-name">${r.name}</span>
        <form method="POST" action="/delete" style="display:inline">
          <input type="hidden" name="name" value="${r.name}"/>
          <button class="delete-btn" type="submit">Delete</button>
        </form>
      </div>
      <div class="recipe-meta">
        <span class="tag">⏱ ${r.prepTimeInMinutes} mins</span>
        <span class="tag">🧂 ${Array.isArray(r.ingredients) ? r.ingredients.join(', ') : r.ingredients}</span>
      </div>
    </div>
  `).join('');

  const logEntries = log.map(l => `<div class="log-entry">${l}</div>`).join('');

  return `<!doctype html><html>
  <head><style>${getStyles()}</style></head>
  <body>
    <div id="container">
      <div id="logo">Recipe Tracker
        <span class="badge">Live on Azure AKS</span>
      </div>

      <div class="grid">
        <div class="left-panel">
          <div class="section-title">Add New Recipe</div>
          <form id="form" action="/" method="post">
            <label class="control-label">Name</label>
            <input class="input" type="text" name="name" placeholder="e.g. Pasta Carbonara" required/>
            <label class="control-label">Ingredients</label>
            <input class="input" type="text" name="ingredients" placeholder="comma separated"/>
            <label class="control-label">Prep Time (minutes)</label>
            <input class="input" type="number" name="prepTimeInMinutes" placeholder="e.g. 30"/>
            <button class="button1" type="submit">Save Recipe</button>
          </form>
          ${savedMsg ? `<div class="success-msg">Recipe saved successfully!</div>` : ''}
        </div>

        <div class="right-panel">
          <div class="section-title">Activity Log
            <span class="live-dot"></span>
          </div>
          <div id="log-panel">
            ${logEntries || '<div class="log-entry muted">No activity yet...</div>'}
          </div>
        </div>
      </div>

      <div class="section-title" style="margin-top:32px">
        Saved Recipes <span class="count">${recipes.length}</span>
      </div>
      <div id="recipes">
        ${recipeCards || '<div class="empty">No recipes yet. Add one above!</div>'}
      </div>
    </div>
  </body></html>`;
}

function fetchRecipes(callback) {
  const options = {
    hostname: global.gConfig.webservice_host,
    port: global.gConfig.webservice_port,
    path: '/recipes',
    method: 'GET',
  };
  const req = http.request(options, (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => {
      try { callback(null, JSON.parse(data)); }
      catch(e) { callback(e, []); }
    });
  });
  req.on('error', e => callback(e, []));
  req.end();
}

function saveRecipe(recipe, callback) {
  const body = JSON.stringify(recipe);
  const options = {
    hostname: global.gConfig.webservice_host,
    port: global.gConfig.webservice_port,
    path: '/recipe',
    method: 'POST',
  };
  const req = http.request(options, (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => callback(null, data));
  });
  req.on('error', e => callback(e, null));
  req.setHeader('content-type', 'application/json');
  req.write(body);
  req.end();
}

function deleteRecipe(name, callback) {
  const options = {
    hostname: global.gConfig.webservice_host,
    port: global.gConfig.webservice_port,
    path: '/recipe/' + encodeURIComponent(name),
    method: 'DELETE',
  };
  const req = http.request(options, (resp) => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => callback(null, data));
  });
  req.on('error', e => callback(e, null));
  req.end();
}

http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url);

  if (req.url === '/favicon.ico') {
    res.writeHead(200, {'Content-Type': 'image/x-icon'});
    res.end();
    return;
  }

  const timestamp = new Date().toLocaleTimeString();
  const log = [];

  if (req.method === 'POST' && parsedUrl.pathname === '/delete') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const post = qs.parse(body);
      log.push(`[${timestamp}] DELETE request received for recipe: "${post.name}"`);
      log.push(`[${timestamp}] Sending DELETE /recipe/${post.name} to backend`);
      deleteRecipe(post.name, (err) => {
        if (err) {
          log.push(`[${timestamp}] ERROR: Could not delete recipe - ${err.message}`);
        } else {
          log.push(`[${timestamp}] Recipe "${post.name}" deleted from MongoDB`);
        }
        fetchRecipes((err2, recipes) => {
          log.push(`[${timestamp}] GET /recipes → returned ${recipes.length} recipes`);
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.end(renderPage(recipes, log, false));
        });
      });
    });
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const post = qs.parse(body);
      const recipe = {
        name: post.name,
        ingredients: post.ingredients.split(',').map(i => i.trim()),
        prepTimeInMinutes: parseInt(post.prepTimeInMinutes)
      };
      log.push(`[${timestamp}] POST request received from browser`);
      log.push(`[${timestamp}] Parsed recipe: ${recipe.name} | ${recipe.ingredients.join(', ')} | ${recipe.prepTimeInMinutes} mins`);
      log.push(`[${timestamp}] Sending POST /recipe to backend at ${global.gConfig.webservice_host}:${global.gConfig.webservice_port}`);
      saveRecipe(recipe, (err) => {
        if (err) {
          log.push(`[${timestamp}] ERROR: Could not save - ${err.message}`);
        } else {
          log.push(`[${timestamp}] Backend saved recipe to MongoDB successfully`);
        }
        setTimeout(() => {
          log.push(`[${timestamp}] Sending GET /recipes to backend...`);
          fetchRecipes((err2, recipes) => {
            log.push(`[${timestamp}] GET /recipes → returned ${recipes.length} recipes from MongoDB`);
            res.writeHead(302, { Location: '/?saved=true' });
            res.end();
          });
        }, 500);
      });
    });
    return;
  }

const savedMsg = parsedUrl.query && parsedUrl.query.includes('saved=true');
log.push(`[${timestamp}] GET / received`);
log.push(`[${timestamp}] Fetching all recipes from backend...`);
fetchRecipes((err, recipes) => {
  if (err) {
    log.push(`[${timestamp}] ERROR: ${err.message}`);
  } else {
    log.push(`[${timestamp}] GET /recipes → returned ${recipes.length} recipes from MongoDB`);
  }
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(renderPage(recipes, log, savedMsg));
});

}).listen(global.gConfig.exposedPort);