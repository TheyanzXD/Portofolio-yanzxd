document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('tools-container');
  if (!container) return;

  const tools = [
    {
      title: '🧮 Kalkulator Mini',
      render(parent) {
        parent.innerHTML = `
          <h3>Kalkulator Mini</h3>
          <input type="text" class="calc-display" id="calc-display" readonly value="0">
          <div class="calc-grid">
            <button class="clear" data-value="C">C</button>
            <button class="op" data-value="/">÷</button>
            <button class="op" data-value="*">×</button>
            <button class="op" data-value="-">−</button>
            <button data-value="7">7</button><button data-value="8">8</button><button data-value="9">9</button>
            <button class="op" data-value="+">+</button>
            <button data-value="4">4</button><button data-value="5">5</button><button data-value="6">6</button>
            <button class="eq" data-value="=" rowspan="2">=</button>
            <button data-value="1">1</button><button data-value="2">2</button><button data-value="3">3</button>
            <button data-value="0" style="grid-column:span 2">0</button><button data-value=".">.</button>
          </div>`;
      },
      init(card) {
        const display = card.querySelector('#calc-display');
        let cur = '0', op = null, prev = null, reset = false;
        const upd = v => display.value = v;
        const calc = () => {
          if (!op || prev === null) return cur;
          const a = parseFloat(prev), b = parseFloat(cur);
          switch (op) {
            case '+': return (a + b).toString();
            case '-': return (a - b).toString();
            case '*': return (a * b).toString();
            case '/': return b !== 0 ? (a / b).toString() : 'Error';
          }
          return cur;
        };
        card.querySelectorAll('.calc-grid button').forEach(btn => {
          btn.addEventListener('click', () => {
            const v = btn.dataset.value;
            if (v === 'C') { cur = '0'; op = null; prev = null; reset = false; upd('0'); }
            else if (v === '=') { if (op) { cur = calc(); op = null; prev = null; reset = true; upd(cur); } }
            else if (['+', '-', '*', '/'].includes(v)) {
              if (op && !reset) { cur = calc(); upd(cur); }
              op = v; prev = cur; reset = true;
            } else {
              cur = (reset || cur === '0') ? v : cur + v;
              reset = false;
              upd(cur);
            }
          });
        });
      }
    },
    {
      title: '🎯 Tebak Angka',
      render(parent) {
        parent.innerHTML = `
          <h3>Tebak Angka (1-100)</h3>
          <p id="guess-msg">Saya memikirkan angka. Coba tebak!</p>
          <input type="number" id="guess-input" min="1" max="100" placeholder="Tebakanmu...">
          <div style="display:flex;gap:.5rem;margin-top:.5rem">
            <button id="guess-btn">Tebak</button>
            <button id="guess-reset" class="btn-secondary">Ulangi</button>
          </div>
          <p id="guess-attempts" style="margin-top:.5rem"></p>`;
      },
      init(card) {
        let secret = Math.floor(Math.random() * 100) + 1, att = 0;
        const msg = card.querySelector('#guess-msg');
        const input = card.querySelector('#guess-input');
        const attEl = card.querySelector('#guess-attempts');
        const btn = card.querySelector('#guess-btn');
        const reset = card.querySelector('#guess-reset');
        const resetGame = () => {
          secret = Math.floor(Math.random() * 100) + 1; att = 0;
          msg.textContent = 'Saya memikirkan angka. Coba tebak!';
          attEl.textContent = ''; input.value = ''; input.disabled = false; btn.disabled = false;
        };
        btn.addEventListener('click', () => {
          const g = parseInt(input.value);
          if (isNaN(g) || g < 1 || g > 100) { alert('Masukkan angka 1-100'); return; }
          att++;
          attEl.textContent = `Percobaan: ${att}`;
          if (g === secret) {
            msg.textContent = `Selamat! Angka ${secret} benar dalam ${att} percobaan.`;
            input.disabled = true; btn.disabled = true;
          } else {
            msg.textContent = g < secret ? 'Terlalu rendah!' : 'Terlalu tinggi!';
          }
        });
        reset.addEventListener('click', resetGame);
      }
    },
    {
      title: '⏱ Stopwatch',
      render(parent) {
        parent.innerHTML = `
          <h3>Stopwatch</h3>
          <div style="font-size:2.2rem;font-weight:700;text-align:center;font-family:monospace;color:var(--accent);margin:1rem 0" id="sw-display">00:00.0</div>
          <div style="display:flex;gap:.5rem;justify-content:center">
            <button id="sw-start">Mulai</button>
            <button id="sw-pause" class="btn-secondary">Jeda</button>
            <button id="sw-reset" class="btn-secondary">Reset</button>
          </div>`;
      },
      init(card) {
        let t = null, sec = 0, running = false;
        const disp = card.querySelector('#sw-display');
        const fmt = s => {
          const m = Math.floor(s / 60), sc = Math.floor(s % 60), d = Math.floor((s * 10) % 10);
          return `${String(m).padStart(2, '0')}:${String(sc).padStart(2, '0')}.${d}`;
        };
        card.querySelector('#sw-start').addEventListener('click', () => {
          if (!running) { running = true; t = setInterval(() => { sec += 0.1; disp.textContent = fmt(sec); }, 100); }
        });
        card.querySelector('#sw-pause').addEventListener('click', () => { clearInterval(t); running = false; });
        card.querySelector('#sw-reset').addEventListener('click', () => { clearInterval(t); running = false; sec = 0; disp.textContent = fmt(0); });
      }
    },
    {
      title: '💬 Quotes Motivasi',
      render(parent) {
        parent.innerHTML = `
          <h3>Quotes Motivasi</h3>
          <blockquote id="quote-text">"Jadilah perubahan yang ingin Anda lihat di dunia." - <strong>Mahatma Gandhi</strong></blockquote>
          <button id="new-quote">Quote Baru</button>`;
      },
      init(card) {
        const quotes = [
          { text: "Jadilah perubahan yang ingin Anda lihat di dunia.", author: "Mahatma Gandhi" },
          { text: "Hiduplah seolah-olah Anda akan mati besok. Belajarlah seolah-olah Anda akan hidup selamanya.", author: "Mahatma Gandhi" },
          { text: "Kesuksesan adalah kemampuan untuk beranjak dari kegagalan tanpa kehilangan antusiasme.", author: "Winston Churchill" },
          { text: "Cara terbaik untuk memprediksi masa depan adalah dengan menciptakannya.", author: "Peter Drucker" },
          { text: "Jangan takut gagal. Kegagalan adalah batu loncatan menuju kesuksesan.", author: "Anonim" },
          { text: "Kerja keras mengalahkan bakat ketika bakat tidak bekerja keras.", author: "Tim Notke" },
          { text: "Satu-satunya cara untuk melakukan pekerjaan yang hebat adalah mencintai apa yang Anda lakukan.", author: "Steve Jobs" },
          { text: "Masa depan milik mereka yang percaya pada keindahan impian mereka.", author: "Eleanor Roosevelt" }
        ];
        const qEl = card.querySelector('#quote-text');
        card.querySelector('#new-quote').addEventListener('click', () => {
          const q = quotes[Math.floor(Math.random() * quotes.length)];
          qEl.innerHTML = `"${q.text}" - <strong>${q.author}</strong>`;
        });
      }
    },
    {
      title: '🌡 Konversi Suhu',
      render(parent) {
        parent.innerHTML = `
          <h3>Konversi Suhu</h3>
          <input type="number" id="temp-input" placeholder="Nilai suhu">
          <div style="display:flex;gap:.5rem;align-items:center;margin:.5rem 0;flex-wrap:wrap">
            <select id="temp-from"><option value="C">Celsius</option><option value="F">Fahrenheit</option><option value="K">Kelvin</option></select>
            <span style="color:var(--text3)">→</span>
            <select id="temp-to"><option value="F">Fahrenheit</option><option value="C">Celsius</option><option value="K">Kelvin</option></select>
          </div>
          <button id="convert-btn">Konversi</button>
          <p id="temp-result" style="font-weight:600;margin-top:.5rem;color:var(--accent)"></p>`;
      },
      init(card) {
        const input = card.querySelector('#temp-input');
        const from = card.querySelector('#temp-from');
        const to = card.querySelector('#temp-to');
        const res = card.querySelector('#temp-result');
        card.querySelector('#convert-btn').addEventListener('click', () => {
          const v = parseFloat(input.value);
          if (isNaN(v)) { res.textContent = 'Masukkan angka valid'; return; }
          let result;
          const key = from.value + to.value;
          if (from.value === to.value) result = v;
          else if (key === 'CF') result = (v * 9 / 5) + 32;
          else if (key === 'CK') result = v + 273.15;
          else if (key === 'FC') result = (v - 32) * 5 / 9;
          else if (key === 'FK') result = (v - 32) * 5 / 9 + 273.15;
          else if (key === 'KC') result = v - 273.15;
          else if (key === 'KF') result = (v - 273.15) * 9 / 5 + 32;
          res.textContent = `${v} ${from.value} = ${result.toFixed(2)} ${to.value}`;
        });
      }
    },
    {
      title: '🎲 Random Picker',
      render(parent) {
        parent.innerHTML = `
          <h3>Random Picker</h3>
          <input type="text" id="rp-input" placeholder="Masukkan pilihan (koma dipisah)">
          <button id="rp-btn" style="margin-top:.5rem">Pilih Acak!</button>
          <p id="rp-result" style="font-size:1.2rem;font-weight:700;color:var(--accent);margin-top:1rem;min-height:2rem"></p>`;
      },
      init(card) {
        card.querySelector('#rp-btn').addEventListener('click', () => {
          const input = card.querySelector('#rp-input').value;
          const items = input.split(',').map(s => s.trim()).filter(s => s);
          if (items.length < 2) { alert('Masukkan minimal 2 pilihan dipisah koma'); return; }
          const result = card.querySelector('#rp-result');
          result.textContent = '';
          let count = 0;
          const interval = setInterval(() => {
            result.textContent = items[Math.floor(Math.random() * items.length)];
            count++;
            if (count > 15) { clearInterval(interval); result.textContent = items[Math.floor(Math.random() * items.length)]; }
          }, 80);
        });
      }
    }
  ];

  tools.forEach(tool => {
    const card = document.createElement('div');
    card.className = 'tool-card';
    tool.render(card);
    container.appendChild(card);
    tool.init(card);
  });
});
