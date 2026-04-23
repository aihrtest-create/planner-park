const STATUS_LABELS = {
  new:'Новый', bot_connected:'В боте', link_sent:'Ссылка отправлена',
  configuring:'Заполняет', submitted:'✅ Заявка', contacted:'Связались', confirmed:'Подтверждён'
};
const PKG = { basic:'Базовый', premium:'Премиум', exclusive:'Эксклюзив', custom:'Индивидуальный' };

let allLeads=[], currentFilter='all', currentLeadId=null;

async function loadLeads() {
  try {
    const r = await fetch('/api/leads');
    const d = await r.json();
    allLeads = d.leads || [];
    renderStats(d.stats || []);
    renderFilters(d.stats || []);
    renderTable();
  } catch(e) { console.error(e); }
}

function renderStats(stats) {
  const sc = k => (stats.find(s=>s.status===k)||{}).count||0;
  document.getElementById('stats-bar').innerHTML = [
    ['Всего лидов', allLeads.length, ''],
    ['Новые заявки', sc('submitted'), 'orange'],
    ['Заполняют', sc('configuring'), 'blue'],
    ['Подтверждено', sc('confirmed'), 'green'],
  ].map(([l,v,c])=>`<div class="stat-card"><div class="stat-label">${l}</div><div class="stat-value ${c}">${v}</div></div>`).join('');
}

function renderFilters(stats) {
  const sc = k => (stats.find(s=>s.status===k)||{}).count||0;
  const fs = [
    ['all','Все',allLeads.length],['submitted','✅ Заявки',sc('submitted')],
    ['configuring','Заполняют',sc('configuring')],['new','Новые',sc('new')],
    ['link_sent','Ссылка отправлена',sc('link_sent')],['contacted','Связались',sc('contacted')],
    ['confirmed','Подтверждено',sc('confirmed')]
  ];
  document.getElementById('filters').innerHTML = fs.map(([k,l,c])=>
    `<button class="filter-btn ${currentFilter===k?'active':''}" onclick="setFilter('${k}')">${l}<span class="filter-count">${c}</span></button>`
  ).join('');
}

function setFilter(f) { currentFilter=f; loadLeads(); }

function renderTable() {
  const list = currentFilter==='all' ? allLeads : allLeads.filter(l=>l.status===currentFilter);
  if(!list.length) {
    document.getElementById('leads-table').innerHTML = '<tr><td colspan="6"><div class="empty-state"><div class="empty-state-icon">📭</div>Нет заявок</div></td></tr>';
    return;
  }
  document.getElementById('leads-table').innerHTML = list.map(l => {
    const cfg = l.config_data ? JSON.parse(l.config_data) : null;
    const ico = l.messenger==='telegram' ? '💬' : '📱';
    return `<tr onclick="openLead('${l.id}')">
      <td><span class="lead-name">${esc(l.name)}</span></td>
      <td><a class="phone-link" href="tel:${l.phone}" onclick="event.stopPropagation()">${esc(l.phone)}</a></td>
      <td>${ico} ${l.messenger==='telegram'?'Telegram':'Max'}</td>
      <td><span class="status-badge status-${l.status}"><span class="status-dot"></span>${STATUS_LABELS[l.status]||l.status}</span></td>
      <td><span class="time-ago">${timeAgo(l.created_at)}</span></td>
      <td>${cfg?.totalPrice ? `<span class="total-price">${Number(cfg.totalPrice).toLocaleString('ru-RU')} ₽</span>` : '—'}</td>
    </tr>`;
  }).join('');
}

function openLead(id) {
  currentLeadId=id;
  const l = allLeads.find(x=>x.id===id); if(!l) return;
  const cfg = l.config_data ? JSON.parse(l.config_data) : null;
  document.getElementById('modal-title').textContent = `${l.name} — ${STATUS_LABELS[l.status]}`;
  
  let h = `<div class="detail-grid">
    <div><div class="detail-label">Контакт</div><div>${esc(l.name)}</div><a class="phone-link" href="tel:${l.phone}">${esc(l.phone)}</a></div>
    <div><div class="detail-label">Мессенджер</div><div>${l.messenger==='telegram'?'💬 Telegram':'📱 Max'}</div>${l.bot_username?`<div style="color:#71717A">@${esc(l.bot_username)}</div>`:''}</div>
  </div>`;
  
  if(cfg?.packageType) {
    h += `<div class="detail-label">Конфигурация</div><div style="margin-bottom:12px"><span class="total-price">${Number(cfg.totalPrice||0).toLocaleString('ru-RU')} ₽</span></div><div class="detail-grid">`;
    const ci = (l,v) => `<div class="config-item"><div class="config-item-label">${l}</div><div class="config-item-value">${esc(String(v))}</div></div>`;
    h += ci('Пакет', PKG[cfg.packageType]||cfg.packageType);
    if(cfg.questType&&cfg.questType!=='none') h += ci('Квест', cfg.questType);
    if(cfg.date) h += ci('Дата', cfg.date);
    if(cfg.time) h += ci('Время', cfg.time);
    h += ci('Дети', cfg.childrenCount||'—');
    h += ci('Взрослые', cfg.adultsCount||'—');
    if(cfg.animators?.length) h += ci('Аниматоры', cfg.animators.join(', '));
    if(cfg.shows?.length) h += ci('Шоу', cfg.shows.join(', '));
    if(cfg.masterClasses?.length) h += ci('МК', cfg.masterClasses.join(', '));
    if(cfg.patiroomDetails) h += ci('Патирум', cfg.patiroomDetails);
    if(cfg.cakeChoice) h += ci('Торт', cfg.cakeChoice);
    h += '</div>';
    if(cfg.contactComment) h += `<div class="detail-label" style="margin-top:16px">Комментарий</div><div style="color:#E4E4E7;font-size:14px">${esc(cfg.contactComment)}</div>`;
  }
  
  h += `<div style="margin-top:20px"><div class="detail-label">Заметки менеджера</div>
    <textarea class="notes-input" id="manager-notes" placeholder="Добавьте заметку...">${esc(l.manager_notes||'')}</textarea></div>`;
  
  document.getElementById('modal-body').innerHTML = h;
  
  let a = `<button class="btn btn-secondary" onclick="saveNotes()">💾 Сохранить</button>`;
  if(l.status==='submitted') a += `<button class="btn btn-primary" onclick="markStatus('contacted')">📞 Связался</button>`;
  if(l.status==='contacted') a += `<button class="btn btn-success" onclick="markStatus('confirmed')">✅ Подтвердить</button>`;
  document.getElementById('modal-actions').innerHTML = a;
  document.getElementById('modal-overlay').classList.add('active');
}

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); currentLeadId=null; }

async function saveNotes() {
  if(!currentLeadId) return;
  await fetch(`/api/leads/${currentLeadId}/notes`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({notes:document.getElementById('manager-notes').value}) });
  loadLeads();
}

async function markStatus(status) {
  if(!currentLeadId) return;
  await fetch(`/api/leads/${currentLeadId}/status`, { method:'PATCH', headers:{'Content-Type':'application/json'}, body:JSON.stringify({status}) });
  closeModal(); loadLeads();
}

function esc(s) { const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }

function timeAgo(ds) {
  const ms = Date.now() - new Date(ds+'Z').getTime();
  const m = Math.floor(ms/60000);
  if(m<1) return 'только что';
  if(m<60) return m+' мин назад';
  const h = Math.floor(m/60);
  if(h<24) return h+' ч назад';
  return Math.floor(h/24)+' дн назад';
}

document.getElementById('modal-overlay').addEventListener('click', e => { if(e.target===e.currentTarget) closeModal(); });
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });
loadLeads();
setInterval(loadLeads, 10000);
