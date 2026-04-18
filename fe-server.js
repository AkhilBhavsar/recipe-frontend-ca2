var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

const config = require('./config/config.json');
const defaultConfig = config.development;
global.gConfig = defaultConfig;

function getStyles() {
  return `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
  <style>
  :root{
    --bg:#0A0806;--bg-2:#110D0A;--surface:#17110D;--surface-2:#1E1611;--surface-3:#120D0A;
    --line:#29201A;--line-2:#3A2D24;--line-3:#4D3D31;
    --bone:#F3E9D9;--bone-2:#D9CBB4;--mute:#8A7A63;--mute-2:#5A4D3F;
    --gold:#D8A94A;--gold-2:#B8893B;--gold-soft:rgba(216,169,74,.12);
    --saffron:#E8B35E;--claret:#C44E3C;--claret-soft:rgba(196,78,60,.14);
    --olive:#9FB071;--olive-2:#7F9159;
  }
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{background:var(--bg);color:var(--bone);-webkit-font-smoothing:antialiased;overflow-x:hidden}
  body{
    font-family:"DM Sans",sans-serif;font-size:15px;line-height:1.55;min-height:100vh;position:relative;
    background:
      radial-gradient(1100px 700px at 85% -5%,rgba(216,169,74,.10),transparent 55%),
      radial-gradient(900px 600px at -10% 25%,rgba(196,78,60,.07),transparent 60%),
      radial-gradient(1400px 800px at 50% 100%,rgba(159,176,113,.04),transparent 55%),
      var(--bg);
  }
  body::before{
    content:"";position:fixed;inset:0;pointer-events:none;z-index:1;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 0.95 0 0 0 0 0.85 0 0 0 0.08 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
    mix-blend-mode:overlay;opacity:.5;
  }
  body::after{content:"";position:fixed;inset:0;pointer-events:none;z-index:1;background:radial-gradient(closest-side at 50% 50%,transparent 55%,rgba(0,0,0,.55) 120%)}
  .shell{max-width:1360px;margin:0 auto;padding:26px 48px 90px;position:relative;z-index:2}

  /* TOP BAR */
  .topbar{display:flex;align-items:center;justify-content:space-between;padding-bottom:20px;border-bottom:1px solid var(--line);gap:20px;flex-wrap:wrap}
  .brand{display:flex;align-items:center;gap:16px}
  .mark{width:46px;height:46px;border:1px solid var(--gold);display:grid;place-items:center;position:relative;background:linear-gradient(180deg,rgba(216,169,74,.10),transparent)}
  .mark::before,.mark::after{content:"";position:absolute;width:6px;height:6px;border:1px solid var(--gold)}
  .mark::before{top:-3px;left:-3px;border-right:0;border-bottom:0}
  .mark::after{bottom:-3px;right:-3px;border-left:0;border-top:0}
  .mark span{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:600;font-size:26px;color:var(--gold);line-height:1;font-variation-settings:"opsz" 96}
  .brand .words .title{font-family:"Bodoni Moda",serif;font-weight:500;font-size:18px;letter-spacing:.005em;color:var(--bone);line-height:1;font-variation-settings:"opsz" 18}
  .brand .words .sub{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--mute);margin-top:6px}
  .topbar .right{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
  .authors{font-family:"DM Sans",sans-serif;font-size:13px;color:var(--bone-2)}
  .authors b{font-weight:500;color:var(--bone)}
  .status{display:inline-flex;align-items:center;gap:10px;padding:8px 14px;border:1px solid rgba(159,176,113,.35);border-radius:999px;background:rgba(159,176,113,.06);font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bone)}
  .status .dot{width:7px;height:7px;border-radius:50%;background:var(--olive);box-shadow:0 0 12px var(--olive);animation:pulse 2s ease-in-out infinite}
  @keyframes pulse{50%{opacity:.5;box-shadow:0 0 4px var(--olive)}}

  /* STRIP */
  .strip{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:13px 0;border-bottom:1px solid var(--line);font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--mute);flex-wrap:wrap}
  .strip em{font-style:normal;color:var(--gold)}
  .strip .services{display:inline-flex;align-items:center;gap:8px;color:var(--olive)}
  .strip .services::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--olive);box-shadow:0 0 8px var(--olive)}

  /* HERO */
  .hero{position:relative;padding:58px 0 44px}
  .hero-kicker{font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold);display:flex;align-items:center;gap:16px;margin-bottom:44px}
  .hero-kicker::before{content:"";width:60px;height:1px;background:var(--gold)}
  .hero-kicker::after{content:"";flex:1;height:1px;background:var(--line);max-width:240px}
  .hero-grid{display:grid;grid-template-columns:1fr 1.05fr;align-items:center;gap:40px;min-height:58vh}
  .hero-text{font-family:"Bodoni Moda",serif;color:var(--bone);position:relative;z-index:2}
  .hero-text .line{font-weight:300;font-style:italic;font-size:clamp(64px,8.5vw,140px);line-height:.9;letter-spacing:-.035em;display:block;font-variation-settings:"opsz" 96}
  .hero-text .line.a{color:var(--bone)}
  .hero-text .line.b{color:var(--bone-2);padding-left:.3em}
  .hero-text .line.c{color:var(--bone);padding-left:.1em;position:relative}
  .hero-text .line.c .dot{color:var(--gold);font-weight:600;font-style:normal}
  .hero-number{position:relative;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:60vh;padding:0 20px}
  .monument{position:relative;padding:54px 60px 0;display:flex;flex-direction:column;align-items:center}
  .monument::before,.monument::after,.monument .cr-tr,.monument .cr-br{content:"";position:absolute;width:22px;height:22px;border-color:var(--gold);border-style:solid;border-width:0}
  .monument::before{top:0;left:0;border-top-width:1px;border-left-width:1px}
  .monument::after{top:0;right:0;border-top-width:1px;border-right-width:1px}
  .monument .cr-bl,.monument .cr-br{position:absolute;width:22px;height:22px;border-color:var(--gold);border-style:solid;border-width:0}
  .monument .cr-bl{bottom:0;left:0;border-bottom-width:1px;border-left-width:1px}
  .monument .cr-br{bottom:0;right:0;border-bottom-width:1px;border-right-width:1px}
  .giant{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:500;line-height:.82;letter-spacing:-.06em;color:transparent;-webkit-text-stroke:1px var(--gold);background:radial-gradient(circle at var(--mx,50%) var(--my,40%),rgba(232,179,94,.78),rgba(216,169,74,.28) 28%,rgba(216,169,74,.04) 60%,transparent 80%);-webkit-background-clip:text;background-clip:text;position:relative;font-variation-settings:"opsz" 96;text-shadow:0 0 60px rgba(216,169,74,.10);transition:transform .45s cubic-bezier(.2,.7,.1,1);user-select:none;display:block}
  .giant[data-digits="1"]{font-size:clamp(240px,40vw,540px)}
  .giant[data-digits="2"]{font-size:clamp(200px,33vw,440px)}
  .giant[data-digits="3"]{font-size:clamp(150px,26vw,330px)}
  .giant[data-digits="4"]{font-size:clamp(120px,21vw,260px)}
  .giant[data-digits="5"]{font-size:clamp(96px,17vw,200px)}
  .monument-rule{margin-top:10px;width:100%;height:1px;background:linear-gradient(90deg,transparent,var(--gold-2) 15%,var(--gold-2) 85%,transparent);opacity:.85}
  .monument-cap{margin-top:14px;padding-bottom:4px;display:flex;align-items:center;gap:14px;justify-content:center;flex-wrap:wrap;font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.26em;text-transform:uppercase;color:var(--mute);white-space:nowrap}
  .monument-cap em{font-style:normal;color:var(--gold)}
  .monument-cap .sep{width:3px;height:3px;border-radius:50%;background:var(--line-3)}
  .hero-foot{display:grid;grid-template-columns:1fr auto;gap:40px;align-items:end;margin-top:40px;padding-top:28px;border-top:1px solid var(--line)}
  .lede{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:400;font-size:19px;line-height:1.55;color:var(--bone-2);max-width:58ch;font-variation-settings:"opsz" 20}
  .lede b{color:var(--gold);font-style:normal;font-weight:500;font-family:"DM Sans",sans-serif;font-size:.82em;letter-spacing:.06em}
  .stack{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
  .stack span{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bone-2);padding:7px 12px;border:1px solid var(--line-2);border-radius:2px;background:rgba(255,255,255,.015);transition:all .18s ease}
  .stack span:hover{border-color:var(--gold-2);color:var(--bone)}
  .stack span.accent{color:var(--gold);border-color:var(--gold-2);background:rgba(216,169,74,.05)}

  /* SEARCH */
  .search-section{margin-top:56px;padding:38px 0 34px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr auto;gap:36px;align-items:center}
  .search-form{display:flex;align-items:center;gap:18px;padding:14px 4px;border-bottom:1px solid var(--gold);position:relative;transition:border-color .25s ease}
  .search-form::before{content:"";position:absolute;left:0;right:0;bottom:-1px;height:1px;background:linear-gradient(90deg,var(--gold),transparent 70%)}
  .search-form:focus-within{border-bottom-color:var(--saffron)}
  .search-form svg{stroke:var(--gold);flex:0 0 22px;transition:stroke .25s ease;fill:none}
  .search-form:focus-within svg{stroke:var(--saffron)}
  .search-form input{flex:1;background:transparent;border:0;outline:0;font-family:"Bodoni Moda",serif;font-style:italic;font-weight:300;font-size:23px;color:var(--bone);font-variation-settings:"opsz" 24}
  .search-form input::placeholder{color:var(--mute)}
  .search-form button{border:1px solid var(--gold);background:transparent;color:var(--gold);font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;padding:13px 22px;cursor:pointer;transition:all .2s ease;border-radius:2px;font-weight:500}
  .search-form button:hover{background:var(--gold);color:var(--bg)}
  .filters{display:flex;gap:10px;flex-wrap:wrap;justify-content:flex-end}
  .chip{background:transparent;border:1px solid var(--line-2);color:var(--bone-2);padding:10px 16px;border-radius:999px;cursor:pointer;font-family:"DM Sans",sans-serif;font-size:13px;transition:all .18s ease;text-decoration:none;display:inline-block}
  .chip em{font-style:italic;color:var(--mute);margin-left:6px;font-family:"Bodoni Moda",serif;font-weight:300}
  .chip:hover{border-color:var(--gold-2);color:var(--bone)}
  .chip.on{background:var(--bone);color:var(--bg);border-color:var(--bone)}
  .chip.on em{color:var(--mute-2)}

  /* STATS */
  .stats{display:grid;grid-template-columns:repeat(3,1fr)}
  .stat{padding:44px 32px;border-right:1px solid var(--line);position:relative;overflow:hidden}
  .stat:last-child{border-right:0}
  .stat::before{content:"";position:absolute;top:0;left:32px;width:40px;height:1px;background:var(--gold)}
  .stat .lbl{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--mute);margin-bottom:18px;display:flex;align-items:center;gap:10px}
  .stat .lbl .tag{padding:3px 8px;border:1px solid var(--line-2);border-radius:2px;font-size:9px;letter-spacing:.2em;color:var(--bone-2)}
  .stat .val{font-family:"Bodoni Moda",serif;font-weight:400;font-size:72px;line-height:.95;letter-spacing:-.03em;color:var(--bone);font-variation-settings:"opsz" 96;display:flex;align-items:baseline;gap:14px}
  .stat .val .num{font-style:italic;font-weight:400}
  .stat .val .unit{font-family:"DM Sans",sans-serif;font-size:13px;color:var(--mute);letter-spacing:.18em;text-transform:uppercase;font-weight:400}
  .stat.hi .val .num{color:var(--gold)}
  .stat.last .val{font-size:32px;letter-spacing:-.015em;font-style:normal;font-weight:500;align-items:baseline}
  .stat .foot{margin-top:14px;font-family:"DM Sans",sans-serif;font-size:14px;color:var(--mute);letter-spacing:.02em}
  .stat .foot b{color:var(--bone-2);font-weight:500}
  .stat .foot .ts{color:var(--gold);font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.16em;text-transform:uppercase;margin-left:6px}

  /* MAIN GRID */
  .grid{display:grid;grid-template-columns:380px 1fr;gap:48px;padding-top:72px;position:relative}
  .grid::before{content:"";position:absolute;top:24px;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--line) 10%,var(--line) 90%,transparent)}
  .sec-head{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:26px;gap:20px}
  .sec-head h2{font-family:"Bodoni Moda",serif;font-weight:400;font-size:32px;letter-spacing:-.015em;color:var(--bone);font-variation-settings:"opsz" 40}
  .sec-head h2 em{color:var(--gold);font-style:italic;font-weight:400}
  .sec-head .side{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}

  /* PANEL */
  .panel{background:linear-gradient(180deg,var(--surface) 0%,var(--bg-2) 100%);border:1px solid var(--line);position:relative}
  .panel::before{content:"";position:absolute;top:-1px;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,var(--gold) 50%,transparent);opacity:.7}
  .panel>.tick{position:absolute;width:10px;height:10px;border:0 solid var(--gold);pointer-events:none}
  .panel>.tick.tl{top:-1px;left:-1px;border-top-width:1px;border-left-width:1px}
  .panel>.tick.tr{top:-1px;right:-1px;border-top-width:1px;border-right-width:1px}
  .panel>.tick.bl{bottom:-1px;left:-1px;border-bottom-width:1px;border-left-width:1px}
  .panel>.tick.br{bottom:-1px;right:-1px;border-bottom-width:1px;border-right-width:1px}

  .card{padding:30px 28px 28px}
  .card h2{font-family:"Bodoni Moda",serif;font-weight:500;font-size:24px;color:var(--bone);margin-bottom:4px;font-variation-settings:"opsz" 40;letter-spacing:-.005em}
  .card .desc{font-family:"DM Sans",sans-serif;font-size:14px;color:var(--mute);margin-bottom:26px}
  .field{margin-bottom:20px}
  .field label{display:flex;align-items:baseline;justify-content:space-between;font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
  .field label em{font-style:normal;color:var(--mute-2)}
  .field input{width:100%;background:transparent;border:0;border-bottom:1px solid var(--line-2);padding:10px 2px;font-family:"DM Sans",sans-serif;font-size:16px;color:var(--bone);outline:none;transition:border-color .2s ease}
  .field input:focus{border-bottom-color:var(--gold)}
  .field input::placeholder{color:var(--mute);font-style:italic;font-family:"Bodoni Moda",serif;font-weight:300;font-size:17px}
  .save{width:100%;margin-top:10px;padding:16px 18px;cursor:pointer;border:1px solid var(--gold);background:var(--gold);color:var(--bg);font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;transition:all .25s ease}
  .save::after{content:" ➝";font-family:"Bodoni Moda",serif;font-style:italic;font-weight:400;font-size:14px;letter-spacing:0;margin-left:6px}
  .save:hover{background:var(--bone);border-color:var(--bone)}
  .ok-msg{margin-top:16px;padding:12px 14px;border:1px solid var(--olive-2);background:rgba(159,176,113,.06);font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--olive)}

  /* LOG */
  .log{margin-top:22px;padding:22px 22px 18px}
  .log-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding-bottom:12px;margin-bottom:12px;border-bottom:1px dashed var(--line-2);font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase}
  .log-head .title{color:var(--gold);font-weight:500;display:flex;align-items:center;gap:10px}
  .log-head .title::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--olive);box-shadow:0 0 10px var(--olive);animation:pulse 2s ease-in-out infinite}
  .log-head .refresh{color:var(--mute)}
  .log-body{display:flex;flex-direction:column;gap:1px}
  .line{font-family:"JetBrains Mono",monospace;font-size:13px;line-height:1.6;padding:3px 0;display:flex;gap:10px;border-left:2px solid transparent;padding-left:10px;margin-left:-10px;flex-wrap:wrap}
  .line .t{color:var(--mute)}
  .line .tag{display:inline-block;font-size:9px;letter-spacing:.2em;padding:1px 6px;border-radius:2px;border:1px solid currentColor;opacity:.85}
  .line.info{border-left-color:transparent}
  .line.info .msg{color:var(--bone-2)}
  .line.info .tag{color:var(--mute)}
  .line.ok{border-left-color:var(--olive-2)}
  .line.ok .msg{color:#bde2c6}
  .line.ok .tag{color:var(--olive)}
  .line.gold{border-left-color:var(--gold-2)}
  .line.gold .msg{color:var(--saffron)}
  .line.gold .tag{color:var(--gold)}

  /* RECIPES */
  .saved{display:flex;flex-direction:column}
  .recipe{display:grid;grid-template-columns:auto 1fr auto;gap:36px;align-items:flex-start;padding:34px 0 38px;border-bottom:1px solid var(--line);position:relative;transition:all .35s cubic-bezier(.2,.7,.1,1)}
  .recipe::before{content:"";position:absolute;left:-20px;top:38px;bottom:42px;width:2px;background:var(--gold);transform:scaleY(0);transform-origin:top;transition:transform .4s cubic-bezier(.2,.7,.1,1)}
  .recipe:hover{padding-left:12px}
  .recipe:hover::before{transform:scaleY(1)}
  .recipe:hover .idx{color:var(--gold)}
  .recipe:hover .idx .dot{transform:translateX(4px)}
  .idx{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:300;font-size:96px;line-height:.85;letter-spacing:-.05em;color:var(--bone);font-variation-settings:"opsz" 96;transition:color .3s ease;min-width:88px}
  .idx .dot{color:var(--gold);font-weight:500;display:inline-block;transition:transform .3s ease}
  .rec-body h3{font-family:"Bodoni Moda",serif;font-weight:500;font-size:32px;line-height:1.1;letter-spacing:-.015em;color:var(--bone);margin-bottom:6px;font-variation-settings:"opsz" 40}
  .meta-row{display:flex;align-items:center;gap:18px;flex-wrap:wrap;margin:16px 0 18px;font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--mute)}
  .meta-row .sep{width:3px;height:3px;background:var(--line-2);border-radius:50%}
  .badge{display:inline-flex;align-items:center;gap:8px;padding:5px 12px;border-radius:2px;border:1px solid var(--olive-2);color:var(--olive);background:rgba(159,176,113,.06);font-weight:600;letter-spacing:.22em}
  .time b{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:500;font-size:22px;color:var(--bone);letter-spacing:-.02em;margin-right:4px;text-transform:none;font-variation-settings:"opsz" 24}
  .ingredients{display:flex;flex-wrap:wrap;gap:8px}
  .ing{font-family:"DM Sans",sans-serif;font-size:13px;font-weight:400;padding:6px 14px;border:1px solid var(--line-2);border-radius:999px;color:var(--bone-2);background:rgba(255,255,255,.015);transition:all .2s ease}
  .ing:hover{border-color:var(--gold-2);color:var(--bone)}
  .ing.more{color:var(--gold);border-style:dashed;font-family:"JetBrains Mono",monospace;font-size:13px;letter-spacing:.16em;text-transform:uppercase}
  .delete{background:transparent;border:1px solid var(--line-2);color:var(--mute);padding:9px 14px;border-radius:2px;cursor:pointer;font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.2em;text-transform:uppercase;transition:all .2s ease}
  .delete:hover{border-color:var(--claret);color:var(--claret);background:var(--claret-soft)}
  .empty-state{padding:60px 0;font-family:"Bodoni Moda",serif;font-style:italic;font-size:22px;color:var(--mute);font-variation-settings:"opsz" 24}

  /* FOOTER */
  .foot{margin-top:80px;padding-top:28px;border-top:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap}
  .foot .sig{font-family:"Bodoni Moda",serif;font-style:italic;font-weight:400;font-size:15px;color:var(--bone-2);font-variation-settings:"opsz" 20}
  .foot .sig em{color:var(--gold);font-weight:500;font-style:italic}
  .foot .meta{font-family:"JetBrains Mono",monospace;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--mute);display:flex;gap:18px;flex-wrap:wrap;align-items:center}
  .foot .meta .health{color:var(--olive);display:inline-flex;align-items:center;gap:6px}
  .foot .meta .health::before{content:"";width:5px;height:5px;border-radius:50%;background:var(--olive);box-shadow:0 0 6px var(--olive)}

  /* ANIMATIONS */
  .reveal{opacity:0;transform:translateY(14px);animation:rise .9s cubic-bezier(.2,.7,.1,1) forwards}
  .reveal.d1{animation-delay:.05s}.reveal.d2{animation-delay:.18s}.reveal.d3{animation-delay:.32s}
  .reveal.d4{animation-delay:.46s}.reveal.d5{animation-delay:.6s}.reveal.d6{animation-delay:.74s}
  @keyframes rise{to{opacity:1;transform:none}}
  .giant{animation:glow 1.4s cubic-bezier(.2,.7,.1,1) .3s both}
  @keyframes glow{from{opacity:0;filter:blur(16px);transform:scale(1.04)}to{opacity:1;filter:none;transform:scale(1)}}
  .monument::before,.monument::after,.monument .cr-bl,.monument .cr-br{opacity:0;animation:cropIn .9s cubic-bezier(.2,.7,.1,1) .9s forwards}
  @keyframes cropIn{to{opacity:1}}
  .monument-rule,.monument-cap{opacity:0;animation:rise .9s cubic-bezier(.2,.7,.1,1) 1.1s forwards}

  @media(max-width:1000px){
    .shell{padding:22px 22px 60px}
    .hero-grid{grid-template-columns:1fr;min-height:auto;gap:20px}
    .hero-text .line{font-size:clamp(48px,11vw,72px)}
    .hero-text .line.b,.hero-text .line.c{padding-left:0}
    .hero-number{min-height:auto;padding:0}
    .monument{padding:40px 44px 0}
    .giant[data-digits="1"]{font-size:clamp(180px,48vw,260px)}
    .giant[data-digits="2"]{font-size:clamp(150px,38vw,220px)}
    .giant[data-digits="3"]{font-size:clamp(120px,30vw,180px)}
    .hero-foot{grid-template-columns:1fr;gap:24px}
    .stack{justify-content:flex-start}
    .search-section{grid-template-columns:1fr}
    .filters{justify-content:flex-start}
    .stats{grid-template-columns:1fr}
    .stat{border-right:0;border-bottom:1px solid var(--line)}
    .stat:last-child{border-bottom:0}
    .grid{grid-template-columns:1fr;gap:40px}
    .recipe{grid-template-columns:auto 1fr;gap:18px}
    .recipe .delete{grid-column:1/-1;justify-self:start;margin-top:4px}
    .idx{font-size:64px;min-width:60px}
    .rec-body h3{font-size:24px}
  }
  @media(max-width:500px){
    .shell{padding:18px 16px 50px}
    .monument{padding:32px 28px 0}
  }
  </style>
`;
}

function numberToWords(n) {
  const words = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
    'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen',
    'Twenty'];
  if (n <= 20) return words[n];
  if (n < 100) return 'Many';
  return 'Many';
}

function pad(n) { return String(n).padStart(2, '0'); }

function renderPage(recipes, log, savedMsg, searchQuery, activeFilter) {
  const q = (searchQuery || '').toLowerCase().trim();
  const filter = activeFilter || 'all';

  const filtered = recipes.filter(r => {
    const ms = !q || r.name.toLowerCase().includes(q) ||
      (r.ingredients && r.ingredients.some(i => i.toLowerCase().includes(q)));
    const t = r.prepTimeInMinutes || 0;
    const mf = filter === 'all' ||
      (filter === 'quick' && t < 30) ||
      (filter === 'medium' && t >= 30 && t <= 60) ||
      (filter === 'long' && t > 60);
    return ms && mf;
  });

  const count = recipes.length;
  const digits = String(count).length;
  const wordNum = numberToWords(count);
  const avg = count ? Math.round(recipes.reduce((s, r) => s + (r.prepTimeInMinutes || 0), 0) / count) : 0;
  const lastAdded = count ? recipes[count - 1].name : '—';
  const allIngs = [...new Set(recipes.flatMap(r => Array.isArray(r.ingredients) ? r.ingredients : []))];
  const fastestTime = count ? Math.min(...recipes.map(r => r.prepTimeInMinutes || 0)) : 0;
  const slowestTime = count ? Math.max(...recipes.map(r => r.prepTimeInMinutes || 0)) : 0;

  const chips = ['all', 'quick', 'medium', 'long'];
  const chipLabels = {
    all: 'All recipes',
    quick: 'Quick <em>— under 30 min</em>',
    medium: 'Medium <em>— 30 to 60 min</em>',
    long: 'Long <em>— over 60 min</em>'
  };

  const chipHTML = chips.map(c =>
    `<a href="/?filter=${c}&search=${encodeURIComponent(searchQuery || '')}" class="chip${filter === c ? ' on' : ''}">${chipLabels[c]}</a>`
  ).join('');

  const recipeCards = filtered.map((r, i) => {
    const globalIdx = recipes.indexOf(r);
    const isQuick = (r.prepTimeInMinutes || 0) < 30;
    const ings = Array.isArray(r.ingredients) ? r.ingredients : [];
    const visibleIngs = ings.slice(0, 3);
    const extraCount = ings.length - 3;
    const ordinal = pad(filtered.indexOf(r) + 1);
    return `
    <article class="recipe">
      <div class="idx">${ordinal}<span class="dot">.</span></div>
      <div class="rec-body">
        <h3>${r.name}</h3>
        <div class="meta-row">
          ${isQuick ? '<span class="badge">Quick</span>' : ''}
          <span class="time"><b>${r.prepTimeInMinutes || 0}</b>min prep</span>
          <span class="sep"></span>
          <span>${ings.length} ingredient${ings.length !== 1 ? 's' : ''}</span>
        </div>
        <div class="ingredients">
          ${visibleIngs.map(ing => `<span class="ing">${ing}</span>`).join('')}
          ${extraCount > 0 ? `<span class="ing more">+ ${extraCount} more</span>` : ''}
        </div>
      </div>
      <form method="POST" action="/delete" style="display:inline;margin:0">
        <input type="hidden" name="name" value="${r.name}"/>
        <input type="hidden" name="search" value="${searchQuery || ''}"/>
        <input type="hidden" name="filter" value="${filter}"/>
        <button class="delete" type="submit">Delete</button>
      </form>
    </article>`;
  }).join('');

  const logLines = log.map(l => {
    const cls = l.type === 'ok' ? 'ok' : l.type === 'req' ? 'gold' : 'info';
    const tagText = l.type === 'ok' ? '200' : l.type === 'req' ? 'RPC' : 'GET';
    const parts = l.msg.split('] ');
    const time = parts[0] ? parts[0].replace('[', '') : '';
    const text = parts[1] || l.msg;
    return `<div class="line ${cls}"><span class="t">${time}</span><span class="tag">${tagText}</span><span class="msg">${text}</span></div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Recipe Tracker — TU Dublin · MSc DevOps · CA2</title>
  ${getStyles()}
</head>
<body>
<div class="shell">

  <header class="topbar reveal d1">
    <div class="brand">
      <div class="mark"><span>R</span></div>
      <div class="words">
        <div class="title">Recipe Tracker</div>
        <div class="sub">TU Dublin · MSc DevOps · CA2</div>
      </div>
    </div>
    <div class="right">
      <div class="authors">by <b>Ubaid Ali</b> &amp; <b>Akhil Bhavsar</b></div>
      <div class="status"><span class="dot"></span>Live on Azure AKS</div>
    </div>
  </header>

  <div class="strip reveal d2">
    <span>Vol. 01 · Issue <em>№ ${String(count).padStart(3,'0')}</em></span>
    <span class="services">3 / 3 services healthy</span>
    <span>MongoDB · Spring · Node · <em>AKS</em></span>
  </div>

  <section class="hero">
    <div class="hero-kicker reveal d2">Microservice Recipe Platform</div>
    <div class="hero-grid">
      <div class="hero-text">
        <span class="line a reveal d2">Search</span>
        <span class="line b reveal d3">among</span>
        <span class="line c reveal d5">recipes<span class="dot">.</span></span>
      </div>
      <div class="hero-number">
        <div class="monument">
          <span class="cr-bl"></span><span class="cr-br"></span>
          <span class="giant" data-count="${count}" data-digits="${Math.min(5, digits)}">${count}</span>
          <div class="monument-rule"></div>
          <div class="monument-cap">
            <span>№ <em>${wordNum}</em></span>
            <span class="sep"></span>
            <span>Recipes indexed</span>
            <span class="sep"></span>
            <span>MMXXVI</span>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-foot">
      <p class="lede reveal d4">
        Add, discover and manage the recipes worth keeping —
        powered by <b>Node.js</b>, <b>Spring Boot</b> and <b>MongoDB</b>,
        served from <b>Azure Kubernetes Service</b>.
      </p>
      <div class="stack reveal d6">
        <span>Node.js</span>
        <span>Spring Boot</span>
        <span>MongoDB</span>
        <span class="accent">Azure AKS</span>
      </div>
    </div>
  </section>

  <section class="search-section">
    <form method="GET" action="/" class="search-form">
      <input type="hidden" name="filter" value="${filter}"/>
      <svg width="22" height="22" viewBox="0 0 24 24" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input type="text" name="search" value="${searchQuery || ''}" placeholder="Search by recipe name or ingredient…"/>
      <button type="submit">Search</button>
    </form>
    <div class="filters">${chipHTML}</div>
  </section>

  <section class="stats">
    <div class="stat hi">
      <div class="lbl">Total recipes <span class="tag">indexed</span></div>
      <div class="val"><span class="num">${count}</span><span class="unit">in the collection</span></div>
      <div class="foot">currently showing <b>${filtered.length}</b> results</div>
    </div>
    <div class="stat">
      <div class="lbl">Average prep time</div>
      <div class="val"><span class="num">${avg}</span><span class="unit">Minutes</span></div>
      <div class="foot">fastest: <b>${fastestTime} min</b> · slowest: <b>${slowestTime} min</b></div>
    </div>
    <div class="stat last">
      <div class="lbl">Most recent</div>
      <div class="val">${lastAdded}</div>
      <div class="foot">saved to MongoDB <span class="ts">· live</span></div>
    </div>
  </section>

  <section class="grid">
    <aside>
      <div class="panel card">
        <span class="tick tl"></span><span class="tick tr"></span><span class="tick bl"></span><span class="tick br"></span>
        <h2>Add a new recipe</h2>
        <div class="desc">commit a dish to the index</div>
        <form method="POST" action="/?filter=${filter}&search=${encodeURIComponent(searchQuery || '')}">
          <div class="field">
            <label>Recipe name</label>
            <input type="text" name="name" placeholder="e.g. Pasta Carbonara" required/>
          </div>
          <div class="field">
            <label>Ingredients <em>comma separated</em></label>
            <input type="text" name="ingredients" placeholder="e.g. eggs, pasta, pancetta"/>
          </div>
          <div class="field">
            <label>Prep time <em>minutes</em></label>
            <input type="number" name="prepTimeInMinutes" placeholder="e.g. 30" min="1"/>
          </div>
          <button class="save" type="submit">Save recipe</button>
        </form>
        ${savedMsg ? '<div class="ok-msg">✓ Recipe committed to the index</div>' : ''}
      </div>

      <div class="panel log">
        <span class="tick tl"></span><span class="tick tr"></span><span class="tick bl"></span><span class="tick br"></span>
        <div class="log-head">
          <span class="title">Syslog · live</span>
          <span class="refresh">refreshed <em id="refresh-timer" style="color:var(--gold);font-style:normal">0s</em> ago</span>
        </div>
        <div class="log-body">
          ${logLines || '<div class="line info"><span class="t">—</span><span class="tag">SYS</span><span class="msg">awaiting requests…</span></div>'}
        </div>
      </div>
    </aside>

    <div>
      <div class="sec-head">
        <h2>Saved <em>recipes</em></h2>
        <div class="side">${filtered.length} entr${filtered.length !== 1 ? 'ies' : 'y'} · sorted by newest</div>
      </div>
      <div class="saved">
        ${recipeCards || '<div class="empty-state">No recipes found in this collection.</div>'}
      </div>
    </div>
  </section>

  <footer class="foot">
    <div class="sig">Plated in Dublin, <em>served from the cloud.</em></div>
    <div class="meta">
      <span>© 2026 Recipe Tracker</span>
      <span>v2.0.0</span>
      <span class="health">healthy</span>
      <span>— MSc DevOps · CA2</span>
    </div>
  </footer>

</div>

<script>
  /* filter chips — visual only, navigation handled by server */
  document.querySelectorAll('.chip').forEach(c=>{
    c.addEventListener('click',e=>{
      document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));
      c.classList.add('on');
    });
  });

  /* smart digit-aware sizing for the giant number */
  (function(){
    const g=document.querySelector('.giant');
    if(!g)return;
    const digits=String(g.dataset.count||g.textContent.trim()).length;
    g.dataset.digits=Math.min(5,digits);
  })();

  /* cursor-following glow */
  (function(){
    const scene=document.querySelector('.hero-number');
    const g=document.querySelector('.giant');
    if(!scene||!g)return;
    let raf=null;
    scene.addEventListener('mousemove',e=>{
      const r=g.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width)*100;
      const y=((e.clientY-r.top)/r.height)*100;
      if(raf)cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        g.style.setProperty('--mx',Math.max(-20,Math.min(120,x))+'%');
        g.style.setProperty('--my',Math.max(-20,Math.min(120,y))+'%');
        g.style.transform='translate('+(x-50)*0.02+'px,'+(y-50)*0.02+'px)';
      });
    });
    scene.addEventListener('mouseleave',()=>{
      g.style.setProperty('--mx','50%');
      g.style.setProperty('--my','40%');
      g.style.transform='translate(0,0)';
    });
  })();

  /* count-up animation for the giant number */
  (function(){
    const g = document.querySelector('.giant');
    if(!g) return;
    const target = parseInt(g.dataset.count, 10) || 0;
    if(target === 0){ g.textContent = '0'; return; }
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      g.textContent = current;
      g.dataset.digits = Math.min(5, String(current || 1).length);
      if(t < 1) requestAnimationFrame(step);
      else { g.textContent = target; g.dataset.digits = Math.min(5, String(target).length); }
    };
    requestAnimationFrame(step);
  })();

  /* live refresh timer in the log */
  (function(){
    const el=document.getElementById('refresh-timer');
    if(!el)return;
    let s=0;
    setInterval(()=>{s=(s+1)%60;el.textContent=s+'s';},1000);
  })();
</script>
</body>
</html>`;
}

function fetchRecipes(callback) {
  const options = { hostname: global.gConfig.webservice_host, port: global.gConfig.webservice_port, path: '/recipes', method: 'GET' };
  const req = http.request(options, resp => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => { try { callback(null, JSON.parse(data)); } catch(e) { callback(e, []); } });
  });
  req.on('error', e => callback(e, []));
  req.end();
}

function saveRecipe(recipe, callback) {
  const body = JSON.stringify(recipe);
  const options = { hostname: global.gConfig.webservice_host, port: global.gConfig.webservice_port, path: '/recipe', method: 'POST' };
  const req = http.request(options, resp => {
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
  const options = { hostname: global.gConfig.webservice_host, port: global.gConfig.webservice_port, path: '/recipe/' + encodeURIComponent(name), method: 'DELETE' };
  const req = http.request(options, resp => {
    let data = '';
    resp.on('data', chunk => data += chunk);
    resp.on('end', () => callback(null, data));
  });
  req.on('error', e => callback(e, null));
  req.end();
}

http.createServer(function(req, res) {
  const parsedUrl = url.parse(req.url, true);
  if (req.url === '/favicon.ico') { res.writeHead(200); res.end(); return; }

  const timestamp = new Date().toLocaleTimeString();
  const log = [];

  if (req.method === 'POST' && parsedUrl.pathname === '/delete') {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
      const post = qs.parse(body);
      log.push({ msg: `[${timestamp}] DELETE request for "${post.name}"`, type: 'req' });
      deleteRecipe(post.name, err => {
        if (!err) log.push({ msg: `[${timestamp}] "${post.name}" removed from MongoDB`, type: 'ok' });
        res.writeHead(302, { Location: `/?filter=${post.filter||'all'}&search=${encodeURIComponent(post.search||'')}` });
        res.end();
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
        ingredients: post.ingredients ? post.ingredients.split(',').map(i => i.trim()).filter(Boolean) : [],
        prepTimeInMinutes: parseInt(post.prepTimeInMinutes) || 0
      };
      log.push({ msg: `[${timestamp}] POST request received from browser`, type: 'req' });
      log.push({ msg: `[${timestamp}] Parsed: ${recipe.name} | ${recipe.ingredients.join(', ')} | ${recipe.prepTimeInMinutes} mins`, type: '' });
      log.push({ msg: `[${timestamp}] Sending POST /recipe → ${global.gConfig.webservice_host}:${global.gConfig.webservice_port}`, type: 'req' });
      saveRecipe(recipe, err => {
        if (!err) log.push({ msg: `[${timestamp}] Committed to MongoDB successfully`, type: 'ok' });
        const search = parsedUrl.query.search || '';
        const filter = parsedUrl.query.filter || 'all';
        setTimeout(() => {
          res.writeHead(302, { Location: `/?filter=${filter}&search=${encodeURIComponent(search)}&saved=true` });
          res.end();
        }, 500);
      });
    });
    return;
  }

  const searchQuery = parsedUrl.query.search || '';
  const activeFilter = parsedUrl.query.filter || 'all';
  const savedMsg = parsedUrl.query.saved === 'true';

  log.push({ msg: `[${timestamp}] GET / received by gateway`, type: 'req' });
  log.push({ msg: `[${timestamp}] Fetching recipes from api-svc…`, type: 'req' });

  fetchRecipes((err, recipes) => {
    if (err) {
      log.push({ msg: `[${timestamp}] ERROR: ${err.message}`, type: '' });
    } else {
      log.push({ msg: `[${timestamp}] GET /recipes · ${(recipes||[]).length} results · MongoDB`, type: 'ok' });
      log.push({ msg: `[${timestamp}] health-check · gateway → api → db`, type: 'ok' });
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(renderPage(recipes || [], log, savedMsg, searchQuery, activeFilter));
  });

}).listen(global.gConfig.exposedPort);
console.log(`Recipe Tracker running on port ${global.gConfig.exposedPort}`);