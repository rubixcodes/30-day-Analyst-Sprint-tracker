/* =============================================
   SPRINT 30 — COMPLETE APPLICATION LOGIC
   v2 — null-safe DOM access throughout
   ============================================= */

// ─── HELPER: null-safe element accessor ──────
// Use setEl() / getEl() instead of raw getElementById
// to ensure zero crashes from missing DOM elements.

function setEl(id, prop, val) {
  const el = document.getElementById(id);
  if (!el) return;
  if (prop === 'text')  { el.textContent = val; return; }
  if (prop === 'html')  { el.innerHTML   = val; return; }
  if (prop === 'value') { el.value       = val; return; }
  if (prop === 'width') { el.style.width = val; return; }
  if (prop === 'color') { el.style.color = val; return; }
  if (prop === 'class') { el.className   = val; return; }
}

function getEl(id) {
  return document.getElementById(id);
}

// ─── CONSTANTS ───────────────────────────────

const IBM_COURSES = [
  { id: 1,  name: 'BI Foundations',           days: '1-3'   },
  { id: 2,  name: 'Excel for Data Analysis',  days: '3-5'   },
  { id: 3,  name: 'Data Viz & Dashboards',    days: '5-7'   },
  { id: 4,  name: 'Databases & SQL Basics',   days: '8-10'  },
  { id: 5,  name: 'SQL for Data Science',     days: '10-13' },
  { id: 6,  name: 'Data Warehouse Concepts',  days: '13-15' },
  { id: 7,  name: 'BI Reporting Analytics',   days: '15-17' },
  { id: 8,  name: 'Data Mining & Predictive', days: '17-20' },
  { id: 9,  name: 'Cognos Analytics',         days: '20-22' },
  { id: 10, name: 'IBM Planning Analytics',   days: '22-25' },
  { id: 11, name: 'BI Capstone Project',      days: '25-30' }
];

const LI_POST_DAYS = [4, 8, 11, 15, 17, 22, 25, 30];
const LI_POST_TOPICS = [
  "Starting my 30-Day Operations Analyst Sprint - here's my plan",
  'Week 1 wins: applications sent, IBM BI started, lessons learned',
  'What applying to 50 jobs taught me in 2 weeks',
  'Halfway through my sprint: honest update on progress',
  'Deep dive: why SQL is essential for Operations Analysts',
  'My GXO-inspired Excel dashboard project - behind the scenes',
  'The systems I built to hit 100 job applications in 25 days',
  'Sprint complete: 30 days, 150 applications, 3 projects - full recap'
];

const PROJECT_SUBTASKS = [
  [
    'Design dashboard layout',
    'Create sample inventory data',
    'Build pivot table analysis',
    'Create VBA automation demo',
    'Add charts and visualisations',
    'Write summary of business impact',
    'Take screenshots for LinkedIn',
    'Publish on LinkedIn'
  ],
  [
    'Find dataset on Kaggle',
    'Set up SQL environment',
    'Write 10 business questions',
    'Write SQL queries to answer them',
    'Export and visualise results',
    'Write findings summary',
    'Upload to GitHub',
    'Publish on LinkedIn'
  ],
  [
    'Choose business scenario',
    'Design dashboard layout',
    'Build KPI tracking section',
    'Add trend analysis charts',
    'Write executive summary',
    'Take screenshots',
    'Publish on LinkedIn'
  ]
];

const PROJECTS = [
  {
    id: 1,
    name: 'GXO Operations Dashboard (Excel VBA)',
    days: 'Days 6-13',
    desc: 'Build a professional Excel dashboard with pivot tables, VBA automation, and data visualisations modelled on GXO Logistics operations data. Demonstrates advanced Excel and data analysis skills.'
  },
  {
    id: 2,
    name: 'SQL Data Analysis Project',
    days: 'Days 13-20',
    desc: 'Source a real dataset from Kaggle, write 10 business questions and corresponding SQL queries, visualise results, and publish findings on GitHub and LinkedIn.'
  },
  {
    id: 3,
    name: 'BI Dashboard (Power BI / Tableau)',
    days: 'Days 20-27',
    desc: 'Design and build a professional BI dashboard for a business scenario. Include KPI tracking, trend analysis, and an executive summary. Publish on LinkedIn.'
  }
];

const MILESTONES = [
  { id: 'apps10',   icon: '📨', name: 'First 10 Applications',  desc: 'Send your first 10 applications',        check: s => s.applications.length >= 10 },
  { id: 'response', icon: '📬', name: 'First Response',         desc: 'Receive your first reply',               check: s => s.applications.some(a => ['Response','Interview Scheduled','Interview Done','Offer'].includes(a.status)) },
  { id: 'int1',     icon: '🎤', name: 'First Interview',        desc: 'Secure your first interview',            check: s => s.applications.some(a => ['Interview Scheduled','Interview Done','Offer'].includes(a.status)) },
  { id: 'apps50',   icon: '🔥', name: '50 Applications',        desc: 'Reach 50 total applications',            check: s => s.applications.length >= 50 },
  { id: 'ibm50',    icon: '📊', name: 'IBM BI 50% Complete',    desc: 'Finish at least 5 IBM BI courses',       check: s => s.courses.filter(c => c.status === 'Completed').length >= 5 },
  { id: 'proj1',    icon: '🗂', name: 'First Project Done',     desc: 'Complete your first portfolio project',  check: s => s.projects.some(p => p.status === 'Completed') },
  { id: 'apps100',  icon: '💯', name: '100 Applications',       desc: 'Reach 100 total applications',           check: s => s.applications.length >= 100 },
  { id: 'ibm100',   icon: '🏅', name: 'IBM BI Certified',       desc: 'Complete all 11 IBM BI courses',         check: s => s.courses.filter(c => c.status === 'Completed').length >= 11 },
  { id: 'allproj',  icon: '🎨', name: 'All 3 Projects Done',    desc: 'Complete all portfolio projects',        check: s => s.projects.filter(p => p.status === 'Completed').length >= 3 },
  { id: 'apps150',  icon: '🚀', name: '150 Applications',       desc: 'Hit your 150 applications target',       check: s => s.applications.length >= 150 },
  { id: 'offer',    icon: '🏆', name: 'Offer Received!',        desc: 'Get a job offer - the big one!',         check: s => s.applications.some(a => a.status === 'Offer') }
];

// ─── STATE ────────────────────────────────────

let state = {
  settings:     { startDate: '', visaExpiry: '' },
  tasks:        {},
  applications: [],
  courses:      [],
  posts:        [],
  projects:     [],
  weeklyReviews:{},
  networking:   [],
  currentWeek:  1
};

// ─── INIT ─────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initNav();
  initDaySelector();
  initCourses();
  initPosts();
  initProjects();
  renderDashboard();
  renderDayTasks();
  renderAppsTable();
  renderCourses();
  renderPosts();
  renderProjects();
  renderWeeklyForm();
  renderNetworkTable();
  renderMilestones();
  setInterval(autosave, 30000);
});

// ─── PERSISTENCE ─────────────────────────────

function loadState() {
  try {
    const saved = localStorage.getItem('sprint30_state');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
    }
    const startEl = getEl('startDate');
    const visaEl  = getEl('visaExpiry');
    if (startEl && state.settings.startDate)  startEl.value  = state.settings.startDate;
    if (visaEl  && state.settings.visaExpiry) visaEl.value   = state.settings.visaExpiry;
  } catch(e) { console.warn('Could not load state', e); }
}

function saveState() {
  try {
    localStorage.setItem('sprint30_state', JSON.stringify(state));
  } catch(e) { console.warn('Could not save state', e); }
}

function autosave() { saveState(); }

// ─── DATA INITIALISATION ─────────────────────

function initCourses() {
  if (!state.courses || state.courses.length !== 11) {
    state.courses = IBM_COURSES.map(c => ({
      ...c, status: 'Not Started', startDate: '', completionDate: '',
      hours: '', confidence: 5, skills: '', notes: ''
    }));
    saveState();
  }
}

function initPosts() {
  if (!state.posts || state.posts.length !== 8) {
    state.posts = LI_POST_DAYS.map((day, i) => ({
      id: i + 1, day, topic: LI_POST_TOPICS[i] || '', status: 'Draft',
      datePub: '', views: '', likes: '', comments: '', newConn: '', link: ''
    }));
    saveState();
  }
}

function initProjects() {
  if (!state.projects || state.projects.length !== 3) {
    state.projects = PROJECTS.map((p, i) => ({
      ...p, status: 'Not Started', startDate: '', completionDate: '',
      subtasks: PROJECT_SUBTASKS[i].map(t => ({ label: t, done: false })),
      liLink: ''
    }));
    saveState();
  }
}

// ─── NAVIGATION ──────────────────────────────

function initNav() {
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const section = link.dataset.section;
      showSection(section);
      document.querySelectorAll('.nav-item').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      if (window.innerWidth <= 900) closeSidebar();
    });
  });
}

// KEY FIX: renderDashboard is ONLY called when the
// dashboard section is actually being navigated to.
// Other sections trigger only their own render.
function showSection(name) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  const target = getEl('section-' + name);
  if (target) target.classList.add('active');

  if (name === 'dashboard')    renderDashboard();
  if (name === 'daily-tasks')  renderDayTasks();
  if (name === 'applications') renderAppsTable();
  if (name === 'ibm-bi')       { renderCourses(); renderIBMOverall(); }
  if (name === 'linkedin')     renderPosts();
  if (name === 'portfolio')    renderProjects();
  if (name === 'weekly-review')renderWeeklyForm();
  if (name === 'networking')   renderNetworkTable();
  if (name === 'milestones')   renderMilestones();
}

function toggleSidebar() {
  const sb = getEl('sidebar');
  if (sb) sb.classList.toggle('open');
}
function closeSidebar() {
  const sb = getEl('sidebar');
  if (sb) sb.classList.remove('open');
}

// Returns true only when the dashboard section is visible
function isDashboardActive() {
  const dash = getEl('section-dashboard');
  return dash ? dash.classList.contains('active') : false;
}

// ─── SETTINGS ────────────────────────────────

function updateSettings() {
  const startEl = getEl('startDate');
  const visaEl  = getEl('visaExpiry');
  state.settings.startDate  = startEl ? startEl.value  : '';
  state.settings.visaExpiry = visaEl  ? visaEl.value   : '';
  saveState();
  if (isDashboardActive()) renderDashboard();
}

// ─── DASHBOARD ───────────────────────────────
// Every DOM access in this function is null-safe.

function renderDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Day counter
  if (state.settings.startDate) {
    const start = new Date(state.settings.startDate);
    start.setHours(0, 0, 0, 0);
    const dayNum  = Math.floor((today - start) / 86400000) + 1;
    const clamped = Math.max(1, Math.min(30, dayNum));
    setEl('dayCounter', 'text', clamped + ' / 30');
    setEl('sprintLeft', 'text', Math.max(0, 30 - dayNum + 1));
    const pct = Math.min(100, Math.round(((clamped - 1) / 30) * 100));
    setEl('overallPct', 'text', pct + '%');
    setEl('overallBar', 'width', pct + '%');
  }

  // Visa days
  if (state.settings.visaExpiry) {
    const visa  = new Date(state.settings.visaExpiry);
    visa.setHours(0, 0, 0, 0);
    const vDays = Math.ceil((visa - today) / 86400000);
    const el    = getEl('visaLeft');
    if (el) {
      el.textContent = vDays > 0 ? vDays : 'Expired';
      el.style.color = vDays < 30 ? 'var(--danger)' : 'var(--warning)';
    }
  }

  // Completed days
  const completedCount = Object.keys(state.tasks).filter(k => {
    const n = parseInt(k.replace('day-', ''), 10);
    return !isNaN(n) && isDayComplete(n);
  }).length;
  setEl('completedDays', 'text', completedCount);

  // Streak
  const streak = calcStreak();
  setEl('streakNum', 'text', streak);
  setEl('bigStreak', 'text', streak);

  // Applications ring
  const appTotal = state.applications.length;
  setRing('appRing', appTotal, 150);
  setEl('appCount', 'text', appTotal);
  setStatusPill('appStatusPill', appTotal, 150);

  // IBM BI
  const completedCourses = state.courses.filter(c => c.status === 'Completed').length;
  const ibmPct = Math.round((completedCourses / 11) * 100);
  setRing('ibmRing', ibmPct, 100);
  setEl('ibmPct', 'text', ibmPct + '%');
  const ibmPill = getEl('ibmStatusPill');
  if (ibmPill) {
    if (ibmPct >= 50)      { ibmPill.textContent = 'AHEAD';    ibmPill.className = 'status-pill ahead'; }
    else if (ibmPct >= 30) { ibmPill.textContent = 'ON TRACK'; ibmPill.className = 'status-pill'; }
    else                   { ibmPill.textContent = 'BEHIND';   ibmPill.className = 'status-pill behind'; }
  }

  // LinkedIn
  const liPublished = state.posts.filter(p => p.status === 'Published').length;
  setRing('liRing', liPublished, 8);
  setEl('liCount', 'text', liPublished);
  setStatusPill('liStatusPill', liPublished, 8);

  // Portfolio
  const projDone = state.projects.filter(p => p.status === 'Completed').length;
  setRing('portRing', projDone, 3);
  setEl('portCount', 'text', projDone);
  setStatusPill('portStatusPill', projDone, 3);

  // Interviews
  const intCount = state.applications.filter(
    a => ['Interview Scheduled', 'Interview Done'].includes(a.status)
  ).length;
  setRing('intRing', intCount, 10);
  setEl('intCount', 'text', intCount);
  const intPill = getEl('intStatusPill');
  if (intPill) {
    if (intCount >= 5)      { intPill.textContent = 'AHEAD';    intPill.className = 'status-pill ahead'; }
    else if (intCount >= 2) { intPill.textContent = 'ON TRACK'; intPill.className = 'status-pill'; }
    else                    { intPill.textContent = 'BEHIND';   intPill.className = 'status-pill behind'; }
  }
}

// IBM overall bar lives in the ibm-bi section
function renderIBMOverall() {
  const completed = state.courses.filter(c => c.status === 'Completed').length;
  const pct = Math.round((completed / 11) * 100);
  setEl('ibmOverallPct', 'text', pct + '%');
  setEl('ibmOverallBar', 'width', pct + '%');
}

function setRing(id, val, max) {
  const circ   = 213.6;
  const offset = circ * (1 - Math.min(1, val / max));
  const el     = getEl(id);
  if (el) el.style.strokeDashoffset = offset;
}

function setStatusPill(pillId, val, max) {
  const pct = val / max;
  const el  = getEl(pillId);
  if (!el) return;
  if (pct >= 0.7)      { el.textContent = 'AHEAD';    el.className = 'status-pill ahead'; }
  else if (pct >= 0.4) { el.textContent = 'ON TRACK'; el.className = 'status-pill'; }
  else                 { el.textContent = 'BEHIND';   el.className = 'status-pill behind'; }
}

// ─── STREAK ──────────────────────────────────

function calcStreak() {
  if (!state.settings.startDate) return 0;
  const start = new Date(state.settings.startDate);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const sprintDay = Math.floor((today - start) / 86400000) + 1;
  let streak = 0;
  for (let d = sprintDay; d >= 1; d--) {
    if (isDayComplete(d)) streak++;
    else break;
  }
  return streak;
}

// ─── DAILY TASKS ─────────────────────────────

function initDaySelector() {
  const sel = getEl('taskDaySelect');
  if (!sel) return;
  sel.innerHTML = '';
  for (let d = 1; d <= 30; d++) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = 'Day ' + d;
    sel.appendChild(opt);
  }
  if (state.settings.startDate) {
    const start = new Date(state.settings.startDate);
    start.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    sel.value = Math.max(1, Math.min(30, Math.floor((today - start) / 86400000) + 1));
  }
}

function getIBMCourseForDay(day) {
  if (day <= 3)  return 'IBM BI Course 1: BI Foundations';
  if (day <= 5)  return 'IBM BI Course 2: Excel for Data Analysis';
  if (day <= 7)  return 'IBM BI Course 3: Data Viz & Dashboards';
  if (day <= 10) return 'IBM BI Course 4: Databases & SQL Basics';
  if (day <= 13) return 'IBM BI Course 5: SQL for Data Science';
  if (day <= 15) return 'IBM BI Course 6: Data Warehouse Concepts';
  if (day <= 17) return 'IBM BI Course 7: BI Reporting Analytics';
  if (day <= 20) return 'IBM BI Course 8: Data Mining & Predictive';
  if (day <= 22) return 'IBM BI Course 9: Cognos Analytics';
  if (day <= 25) return 'IBM BI Course 10: IBM Planning Analytics';
  return 'IBM BI Course 11: BI Capstone + Certification Review';
}

function getProjectForDay(day) {
  if (day >= 6  && day <= 13) return 'Project 1 - GXO Excel Dashboard';
  if (day >= 13 && day <= 20) return 'Project 2 - SQL Data Analysis';
  if (day >= 20 && day <= 27) return 'Project 3 - BI Dashboard';
  return null;
}

function buildDayTaskDefs(day) {
  const isPostDay = LI_POST_DAYS.includes(day);
  const project   = getProjectForDay(day);
  const course    = getIBMCourseForDay(day);
  return {
    morning: {
      label: 'Morning Block - 1.5hrs - Job Applications',
      tasks: [
        { id: 'job1',     type: 'job',   label: 'Apply to Job 1' },
        { id: 'job2',     type: 'job',   label: 'Apply to Job 2' },
        { id: 'job3',     type: 'job',   label: 'Apply to Job 3' },
        { id: 'job4',     type: 'job',   label: 'Apply to Job 4' },
        { id: 'job5',     type: 'job',   label: 'Apply to Job 5' },
        { id: 'cover',    type: 'check', label: 'Customise cover letter for top applications' },
        { id: 'followup', type: 'check', label: 'Follow up on previous applications' }
      ]
    },
    afternoon: {
      label: 'Afternoon Block - 3hrs - IBM BI Study',
      tasks: [
        { id: 'study',     type: 'check', label: 'IBM BI study session - ' + course },
        { id: 'exercises', type: 'check', label: 'Complete practice exercises' },
        { id: 'notes',     type: 'check', label: 'Take notes on key concepts' }
      ]
    },
    evening: {
      label: 'Evening Block - 1hr - LinkedIn & Portfolio',
      tasks: [
        { id: 'connect', type: 'check', label: 'Connect with 10 people on LinkedIn' },
        { id: 'engage',  type: 'check', label: 'Engage with 5 posts (comment/like)' },
        ...(isPostDay ? [{ id: 'post',    type: 'check', label: 'Write and publish LinkedIn Post (Day ' + day + ' post day!)' }] : []),
        ...(project    ? [{ id: 'project',type: 'check', label: 'Work on: ' + project }] : [])
      ]
    }
  };
}

function getAllTaskIds(day) {
  const defs = buildDayTaskDefs(day);
  const ids  = [];
  Object.values(defs).forEach(block => {
    block.tasks.forEach(t => {
      ids.push(t.type === 'job' ? t.id + '_done' : t.id);
    });
  });
  return ids;
}

function isDayComplete(day) {
  const dayData = state.tasks['day-' + day] || {};
  const ids     = getAllTaskIds(day);
  return ids.length > 0 && ids.every(id => dayData[id]);
}

function getDayCompletionPct(day) {
  const dayData = state.tasks['day-' + day] || {};
  const ids     = getAllTaskIds(day);
  if (!ids.length) return 0;
  return Math.round((ids.filter(id => dayData[id]).length / ids.length) * 100);
}

function renderDayTasks() {
  const sel       = getEl('taskDaySelect');
  const container = getEl('dayTasksContainer');
  if (!sel || !container) return;

  const day     = parseInt(sel.value, 10);
  const key     = 'day-' + day;
  if (!state.tasks[key]) state.tasks[key] = {};
  const dayData  = state.tasks[key];
  const defs     = buildDayTaskDefs(day);
  const pct      = getDayCompletionPct(day);
  const complete = isDayComplete(day);

  let html = '<div class="day-view">' +
    '<div class="day-view-header">' +
    '<div class="day-view-title">Day ' + day + ' of 30</div>' +
    '<div style="display:flex;align-items:center;gap:12px">' +
    '<div class="day-pct"><strong>' + pct + '%</strong> complete</div>' +
    (complete ? '<div class="day-complete-badge">Day Complete!</div>' : '') +
    '</div></div>';

  ['morning', 'afternoon', 'evening'].forEach(blockKey => {
    const block = defs[blockKey];
    html += '<div class="task-block">' +
      '<div class="block-header">' + block.label + '</div>';

    block.tasks.forEach(task => {
      if (task.type === 'job') {
        const doneId  = task.id + '_done';
        const valId   = task.id + '_val';
        const checked = dayData[doneId] ? 'checked' : '';
        const val     = (dayData[valId] || '').replace(/"/g, '&quot;');
        const filled  = val ? 'filled' : '';
        html += '<div class="task-item">' +
          '<input type="checkbox" class="task-cb" ' + checked +
          ' onchange="setTask(\'' + key + '\',\'' + doneId + '\',this.checked)">' +
          '<div class="task-input-wrap">' +
          '<span class="task-label">' + task.label + '</span>' +
          '<input type="text" class="task-job-input ' + filled + '"' +
          ' placeholder="Company - Role - Platform"' +
          ' value="' + val + '"' +
          ' onchange="setTask(\'' + key + '\',\'' + valId + '\',this.value)"' +
          ' oninput="this.classList.toggle(\'filled\',this.value.length>0)">' +
          '</div></div>';
      } else {
        const checked     = dayData[task.id] ? 'checked' : '';
        const strikeClass = dayData[task.id] ? 'checked' : '';
        html += '<div class="task-item">' +
          '<input type="checkbox" class="task-cb" ' + checked +
          ' onchange="setTask(\'' + key + '\',\'' + task.id + '\',this.checked)">' +
          '<span class="task-label ' + strikeClass + '">' + task.label + '</span>' +
          '</div>';
      }
    });

    html += '</div>';
  });

  html += '</div>';
  container.innerHTML = html;
}

function setTask(key, taskId, value) {
  if (!state.tasks[key]) state.tasks[key] = {};
  state.tasks[key][taskId] = value;
  saveState();

  const day      = parseInt(key.replace('day-', ''), 10);
  const pct      = getDayCompletionPct(day);
  const complete = isDayComplete(day);

  const pctEl = document.querySelector('.day-pct strong');
  if (pctEl) pctEl.textContent = pct + '%';

  const badgeEl = document.querySelector('.day-complete-badge');
  if (complete && !badgeEl) {
    const header = document.querySelector('.day-view-header > div:last-child');
    if (header) {
      header.insertAdjacentHTML('beforeend', '<div class="day-complete-badge">Day Complete!</div>');
      showToast('Day complete! Great work!', 'success');
    }
  }

  // Only touch dashboard DOM if it is currently active
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
}

// ─── APPLICATIONS ─────────────────────────────

function openAppModal(editIndex) {
  editIndex = (editIndex === undefined || editIndex === null) ? null : editIndex;
  const idxEl = getEl('appEditIndex');
  if (!idxEl) return;
  idxEl.value = editIndex !== null ? editIndex : '';

  const titleEl = getEl('appModalTitle');
  if (titleEl) titleEl.textContent = editIndex !== null ? 'Edit Application' : 'Add Application';

  const fields = editIndex !== null ? state.applications[editIndex] : null;
  const today  = new Date().toISOString().split('T')[0];

  function setField(id, key, fallback) {
    const el = getEl(id);
    if (el) el.value = fields ? (fields[key] || fallback) : fallback;
  }

  setField('appDate',     'date',     today);
  setField('appCompany',  'company',  '');
  setField('appRole',     'role',     '');
  setField('appSalary',   'salary',   '');
  setField('appVisa',     'visa',     'Unknown');
  setField('appIndustry', 'industry', 'Logistics');
  setField('appPlatform', 'platform', 'LinkedIn');
  setField('appCL',       'cl',       'N');
  setField('appStatus',   'status',   'Applied');
  setField('appFollowup', 'followup', '');
  setField('appNotes',    'notes',    '');

  openModal('appModal');
}

function saveApplication() {
  const idxEl  = getEl('appEditIndex');
  const compEl = getEl('appCompany');
  if (!idxEl || !compEl) return;

  function fval(id) { const e = getEl(id); return e ? e.value : ''; }

  const idx = idxEl.value;
  const app = {
    date:     fval('appDate'),
    company:  fval('appCompany').trim(),
    role:     fval('appRole').trim(),
    salary:   fval('appSalary').trim(),
    visa:     fval('appVisa'),
    industry: fval('appIndustry'),
    platform: fval('appPlatform'),
    cl:       fval('appCL'),
    status:   fval('appStatus'),
    followup: fval('appFollowup'),
    notes:    fval('appNotes').trim()
  };

  if (!app.company) { showToast('Company name is required', 'error'); return; }

  if (idx !== '') state.applications[parseInt(idx, 10)] = app;
  else            state.applications.push(app);

  saveState();
  closeModal('appModal');
  renderAppsTable();
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
  showToast(idx !== '' ? 'Application updated!' : 'Application added!', 'success');
}

function deleteApp(index) {
  if (!confirm('Delete this application?')) return;
  state.applications.splice(index, 1);
  saveState();
  renderAppsTable();
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
  showToast('Application deleted');
}

function renderAppsTable() {
  const tbody = getEl('appsTableBody');
  if (!tbody) return;

  function fval(id) { const e = getEl(id); return e ? e.value : ''; }
  const statusF   = fval('filterStatus');
  const industryF = fval('filterIndustry');
  const platformF = fval('filterPlatform');
  const sortF     = fval('sortBy') || 'date';

  let apps = state.applications.map((a, i) => ({ ...a, _idx: i }));
  if (statusF)   apps = apps.filter(a => a.status   === statusF);
  if (industryF) apps = apps.filter(a => a.industry === industryF);
  if (platformF) apps = apps.filter(a => a.platform === platformF);
  apps.sort((a, b) => {
    if (sortF === 'company') return (a.company||'').localeCompare(b.company||'');
    if (sortF === 'status')  return (a.status||'').localeCompare(b.status||'');
    return (b.date||'').localeCompare(a.date||'');
  });

  // Stats - all null-safe via setEl
  const all = state.applications;
  setEl('totalApps',       'text', all.length);
  setEl('totalResponses',  'text', all.filter(a => ['Response','Interview Scheduled','Interview Done','Offer'].includes(a.status)).length);
  setEl('totalInterviews', 'text', all.filter(a => ['Interview Scheduled','Interview Done'].includes(a.status)).length);
  setEl('totalOffers',     'text', all.filter(a => a.status === 'Offer').length);
  setEl('totalRejected',   'text', all.filter(a => a.status === 'Rejected').length);

  const badgeMap = {
    'Applied':'badge-applied','Viewed':'badge-viewed','Response':'badge-response',
    'Interview Scheduled':'badge-interview','Interview Done':'badge-interview',
    'Offer':'badge-offer','Rejected':'badge-rejected','Withdrawn':'badge-withdrawn'
  };

  if (!apps.length) {
    tbody.innerHTML = '<tr><td colspan="13" class="empty-state">No applications yet - add your first one!</td></tr>';
    return;
  }

  tbody.innerHTML = apps.map(a => '<tr>' +
    '<td>' + (a._idx + 1) + '</td>' +
    '<td>' + (a.date||'--') + '</td>' +
    '<td><strong>' + esc(a.company) + '</strong></td>' +
    '<td>' + esc(a.role) + '</td>' +
    '<td style="font-size:11px;color:var(--muted)">' + esc(a.salary) + '</td>' +
    '<td><span class="yn-badge ' + (a.visa==='Y'?'yn-y':'yn-n') + '">' + (a.visa||'?') + '</span></td>' +
    '<td style="font-size:11px">' + esc(a.industry) + '</td>' +
    '<td style="font-size:11px">' + esc(a.platform) + '</td>' +
    '<td><span class="yn-badge ' + (a.cl==='Y'?'yn-y':'yn-n') + '">' + (a.cl||'N') + '</span></td>' +
    '<td><span class="status-badge ' + (badgeMap[a.status]||'badge-applied') + '">' + (a.status||'Applied') + '</span></td>' +
    '<td style="font-size:11px;color:var(--muted)">' + (a.followup||'--') + '</td>' +
    '<td style="font-size:11px;color:var(--muted);max-width:120px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(a.notes) + '</td>' +
    '<td class="td-actions">' +
    '<button class="btn-edit" onclick="openAppModal(' + a._idx + ')">Edit</button>' +
    '<button class="btn-danger" onclick="deleteApp(' + a._idx + ')">Del</button>' +
    '</td></tr>'
  ).join('');
}

function exportAppsCSV() {
  const headers = ['#','Date','Company','Role','Salary','Visa','Industry','Platform','Cover Letter','Status','Follow-up','Notes'];
  const rows = state.applications.map((a, i) => [
    i+1, a.date, a.company, a.role, a.salary, a.visa,
    a.industry, a.platform, a.cl, a.status, a.followup, a.notes
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(v => '"' + (v||'').toString().replace(/"/g,'""') + '"').join(','))
    .join('\n');
  downloadFile('applications.csv', csv, 'text/csv');
  showToast('CSV exported!', 'success');
}

// ─── IBM BI TRACKER ───────────────────────────

function renderCourses() {
  const grid = getEl('courseGrid');
  if (!grid) return;

  grid.innerHTML = state.courses.map((c, i) => {
    const cls = c.status === 'Completed' ? 'completed' : c.status === 'In Progress' ? 'in-progress' : '';
    return '<div class="course-card ' + cls + '" id="course-card-' + i + '">' +
      '<div class="course-num">Course ' + c.id + ' of 11 - Days ' + c.days + '</div>' +
      '<div class="course-name">' + c.name + '</div>' +
      '<select class="course-status-select" onchange="updateCourse(' + i + ',\'status\',this.value)">' +
      '<option' + (c.status==='Not Started'?' selected':'') + '>Not Started</option>' +
      '<option' + (c.status==='In Progress'?' selected':'') + '>In Progress</option>' +
      '<option' + (c.status==='Completed'?' selected':'') + '>Completed</option>' +
      '</select>' +
      '<div class="course-fields">' +
      '<div class="field-small"><label>Start Date</label>' +
      '<input type="date" value="' + (c.startDate||'') + '" onchange="updateCourse(' + i + ',\'startDate\',this.value)"></div>' +
      '<div class="field-small"><label>Completion Date</label>' +
      '<input type="date" value="' + (c.completionDate||'') + '" onchange="updateCourse(' + i + ',\'completionDate\',this.value)"></div>' +
      '<div class="field-small"><label>Hours Spent</label>' +
      '<input type="number" min="0" max="100" value="' + (c.hours||'') + '" placeholder="0" onchange="updateCourse(' + i + ',\'hours\',this.value)"></div>' +
      '<div class="field-small"><label>Confidence (<span id="cv-' + i + '">' + (c.confidence||5) + '</span>/10)</label>' +
      '<input type="range" class="confidence-slider" min="1" max="10" value="' + (c.confidence||5) + '"' +
      ' oninput="updateCourse(' + i + ',\'confidence\',parseInt(this.value));var s=document.getElementById(\'cv-' + i + '\');if(s)s.textContent=this.value"></div>' +
      '<div class="field-small course-full"><label>Key Skills Learned</label>' +
      '<input type="text" value="' + esc(c.skills||'') + '" placeholder="e.g. pivot tables, DAX, ETL..." onchange="updateCourse(' + i + ',\'skills\',this.value)"></div>' +
      '<div class="field-small course-full"><label>Notes</label>' +
      '<textarea rows="2" placeholder="Notes..." onchange="updateCourse(' + i + ',\'notes\',this.value)">' + esc(c.notes||'') + '</textarea></div>' +
      '</div></div>';
  }).join('');

  renderIBMOverall();
}

function updateCourse(idx, field, value) {
  state.courses[idx][field] = field === 'confidence' ? parseInt(value, 10) : value;
  const card = getEl('course-card-' + idx);
  if (card && field === 'status') {
    card.className = 'course-card ' + (value==='Completed'?'completed':value==='In Progress'?'in-progress':'');
  }
  saveState();
  renderIBMOverall();
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
}

// ─── LINKEDIN POSTS ───────────────────────────

function renderPosts() {
  const grid = getEl('postGrid');
  if (!grid) return;

  grid.innerHTML = state.posts.map((p, i) => {
    const cls = p.status === 'Published' ? 'published' : '';
    return '<div class="post-card ' + cls + '" id="post-card-' + i + '">' +
      '<div class="post-num-row">' +
      '<span class="post-num">Post ' + p.id + ' of 8</span>' +
      '<span class="post-day-badge">Day ' + p.day + '</span></div>' +
      '<input type="text" class="post-topic-input" placeholder="Post topic / headline..."' +
      ' value="' + esc(p.topic||'') + '" onchange="updatePost(' + i + ',\'topic\',this.value)">' +
      '<select class="post-status-select" onchange="updatePost(' + i + ',\'status\',this.value)">' +
      '<option' + (p.status==='Draft'?' selected':'') + '>Draft</option>' +
      '<option' + (p.status==='Published'?' selected':'') + '>Published</option></select>' +
      '<div class="post-metrics">' +
      '<div class="post-metric"><label>Views</label><input type="number" value="' + (p.views||'') + '" placeholder="0" onchange="updatePost(' + i + ',\'views\',this.value)"></div>' +
      '<div class="post-metric"><label>Likes</label><input type="number" value="' + (p.likes||'') + '" placeholder="0" onchange="updatePost(' + i + ',\'likes\',this.value)"></div>' +
      '<div class="post-metric"><label>Comments</label><input type="number" value="' + (p.comments||'') + '" placeholder="0" onchange="updatePost(' + i + ',\'comments\',this.value)"></div>' +
      '<div class="post-metric"><label>Connections</label><input type="number" value="' + (p.newConn||'') + '" placeholder="0" onchange="updatePost(' + i + ',\'newConn\',this.value)"></div>' +
      '</div>' +
      '<div class="field-small" style="margin-bottom:6px"><label style="font-size:10px;color:var(--muted);display:block;margin-bottom:3px">Date Published</label>' +
      '<input type="date" class="post-topic-input" value="' + (p.datePub||'') + '" onchange="updatePost(' + i + ',\'datePub\',this.value)" style="margin-bottom:0"></div>' +
      '<input type="url" class="post-link-input" placeholder="LinkedIn post URL..."' +
      ' value="' + esc(p.link||'') + '" onchange="updatePost(' + i + ',\'link\',this.value)">' +
      '</div>';
  }).join('');
}

function updatePost(idx, field, value) {
  state.posts[idx][field] = value;
  const card = getEl('post-card-' + idx);
  if (card && field === 'status') {
    card.className = 'post-card ' + (value === 'Published' ? 'published' : '');
  }
  saveState();
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
}

// ─── PORTFOLIO PROJECTS ────────────────────────

function renderProjects() {
  const grid = getEl('portfolioGrid');
  if (!grid) return;

  grid.innerHTML = state.projects.map((p, i) => {
    const donePct = p.subtasks.length
      ? Math.round((p.subtasks.filter(t => t.done).length / p.subtasks.length) * 100) : 0;
    const cls = p.status === 'Completed' ? 'completed' : p.status === 'In Progress' ? 'in-progress' : '';

    const subtaskHtml = p.subtasks.map((t, si) =>
      '<div class="subtask-item">' +
      '<input type="checkbox" id="st-' + i + '-' + si + '"' + (t.done?' checked':'') +
      ' onchange="updateSubtask(' + i + ',' + si + ',this.checked)">' +
      '<label for="st-' + i + '-' + si + '">' + esc(t.label) + '</label></div>'
    ).join('');

    return '<div class="proj-card ' + cls + '" id="proj-card-' + i + '">' +
      '<div class="proj-header">' +
      '<div class="proj-num">Project ' + p.id + ' of 3 - ' + p.days + '</div>' +
      '<div class="proj-name">' + p.name + '</div></div>' +
      '<div class="proj-body">' +
      '<div class="proj-desc">' + p.desc + '</div>' +
      '<select class="proj-status-select" onchange="updateProject(' + i + ',\'status\',this.value)">' +
      '<option' + (p.status==='Not Started'?' selected':'') + '>Not Started</option>' +
      '<option' + (p.status==='In Progress'?' selected':'') + '>In Progress</option>' +
      '<option' + (p.status==='Completed'?' selected':'') + '>Completed</option></select>' +
      '<div class="proj-dates">' +
      '<div class="proj-field"><label>Start Date</label><input type="date" value="' + (p.startDate||'') + '" onchange="updateProject(' + i + ',\'startDate\',this.value)"></div>' +
      '<div class="proj-field"><label>Completion Date</label><input type="date" value="' + (p.completionDate||'') + '" onchange="updateProject(' + i + ',\'completionDate\',this.value)"></div>' +
      '</div>' +
      '<div class="proj-subtasks-title">Subtask Checklist</div>' +
      subtaskHtml +
      '<div class="proj-progress-bar">' +
      '<div class="progress-header"><span>Subtask progress</span><span class="accent-text">' + donePct + '%</span></div>' +
      '<div class="progress-track"><div class="progress-fill" style="width:' + donePct + '%"></div></div></div>' +
      '<div class="proj-link-wrap"><label>LinkedIn Post URL (when published)</label>' +
      '<input type="url" class="proj-link-input" value="' + esc(p.liLink||'') + '" placeholder="https://linkedin.com/..."' +
      ' onchange="updateProject(' + i + ',\'liLink\',this.value)"></div>' +
      '</div></div>';
  }).join('');
}

function updateSubtask(projIdx, taskIdx, done) {
  state.projects[projIdx].subtasks[taskIdx].done = done;
  const proj    = state.projects[projIdx];
  const allDone = proj.subtasks.every(t => t.done);
  const anyDone = proj.subtasks.some(t => t.done);
  if (allDone)                                        proj.status = 'Completed';
  else if (anyDone && proj.status === 'Not Started')  proj.status = 'In Progress';
  saveState();
  renderProjects();
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
}

function updateProject(idx, field, value) {
  state.projects[idx][field] = value;
  const card = getEl('proj-card-' + idx);
  if (card && field === 'status') {
    card.className = 'proj-card ' + (value==='Completed'?'completed':value==='In Progress'?'in-progress':'');
  }
  saveState();
  if (isDashboardActive()) renderDashboard();
  checkMilestones();
}

// ─── WEEKLY REVIEW ────────────────────────────

function selectWeek(w, btn) {
  state.currentWeek = w;
  document.querySelectorAll('.week-tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderWeeklyForm();
}

function renderWeeklyForm() {
  const container = getEl('weeklyContainer');
  if (!container) return;

  const w    = state.currentWeek || 1;
  const wr   = state.weeklyReviews[w] || {};
  const days = 'Days ' + ((w-1)*7+1) + '-' + Math.min(w*7, 30);

  const assessBtns = ['ahead','on track','behind'].map(v => {
    const sel = wr.assessment === v ? ' selected' : '';
    return '<button class="assess-btn' + sel + '" data-val="' + v + '" onclick="setWeeklyField(' + w + ',\'assessment\',\'' + v + '\');this.closest(\'.weekly-assessment\').querySelectorAll(\'.assess-btn\').forEach(b=>b.classList.remove(\'selected\'));this.classList.add(\'selected\')">' + v.toUpperCase() + '</button>';
  }).join('');

  container.innerHTML =
    '<div class="weekly-form">' +
    '<h3>Week ' + w + ' Review - ' + days + '</h3>' +
    '<div class="weekly-grid">' +
    wfNum(w,'applications','Applications Sent',      wr.applications) +
    wfNum(w,'responses',   'Responses Received',     wr.responses) +
    wfNum(w,'interviews',  'Interviews Scheduled',   wr.interviews) +
    wfNum(w,'ibmCourses',  'IBM BI Courses Done',    wr.ibmCourses) +
    wfNum(w,'liPosts',     'LinkedIn Posts Published',wr.liPosts) +
    wfNum(w,'newConn',     'New Connections',        wr.newConn) +
    '</div>' +
    '<div class="weekly-text-fields">' +
    wfText(w,'wins',       'Wins This Week',  wr.wins,       3) +
    wfText(w,'challenges', 'Challenges',      wr.challenges, 3) +
    wfText(w,'nextFocus',  'Next Week Focus', wr.nextFocus,  3) +
    '</div>' +
    '<div class="weekly-confidence">' +
    '<div style="font-size:11px;color:var(--muted);margin-bottom:6px;display:flex;justify-content:space-between"><span>CONFIDENCE LEVEL</span><span class="accent-text" id="wconf-' + w + '">' + (wr.confidence||5) + '/10</span></div>' +
    '<input type="range" class="confidence-slider" min="1" max="10" value="' + (wr.confidence||5) + '" oninput="setWeeklyField(' + w + ',\'confidence\',parseInt(this.value));var e=document.getElementById(\'wconf-' + w + '\');if(e)e.textContent=this.value+\'/10\'">' +
    '</div>' +
    '<div style="font-size:11px;color:var(--muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.08em">Assessment</div>' +
    '<div class="weekly-assessment">' + assessBtns + '</div>' +
    '<div class="wf-field" style="margin-bottom:16px"><label>Portfolio Progress Notes</label>' +
    '<textarea class="wf-textarea" rows="2" placeholder="What did you build this week?" onchange="setWeeklyField(' + w + ',\'portProgress\',this.value)">' + esc(wr.portProgress||'') + '</textarea></div>' +
    '<button class="btn-primary" onclick="saveWeeklyReview(' + w + ')">Save Week ' + w + ' Review</button>' +
    '</div>';
}

function wfNum(w, field, label, val) {
  return '<div class="wf-field"><label>' + label + '</label>' +
    '<input type="number" class="wf-input" min="0" value="' + (val||'') + '" placeholder="0"' +
    ' onchange="setWeeklyField(' + w + ',\'' + field + '\',parseInt(this.value)||0)"></div>';
}

function wfText(w, field, label, val, rows) {
  return '<div class="wf-field"><label>' + label + '</label>' +
    '<textarea class="wf-textarea" rows="' + rows + '" placeholder="..."' +
    ' onchange="setWeeklyField(' + w + ',\'' + field + '\',this.value)">' + esc(val||'') + '</textarea></div>';
}

function setWeeklyField(week, field, value) {
  if (!state.weeklyReviews[week]) state.weeklyReviews[week] = {};
  state.weeklyReviews[week][field] = value;
  saveState();
}

function saveWeeklyReview(week) {
  saveState();
  showToast('Week ' + week + ' review saved!', 'success');
}

// ─── NETWORKING ───────────────────────────────

function openNetworkModal(editIdx) {
  editIdx = (editIdx === undefined || editIdx === null) ? null : editIdx;
  const idxEl = getEl('netEditIndex');
  if (!idxEl) return;
  idxEl.value = editIdx !== null ? editIdx : '';

  const defaults = {
    netName: '', netCompany: '', netRole: '', netPlatform: 'LinkedIn',
    netDate: new Date().toISOString().split('T')[0],
    netMsg: 'Y', netReply: 'N', netFollowup: 'Y', netNotes: ''
  };

  if (editIdx !== null) {
    const c = state.networking[editIdx];
    defaults.netName     = c.name     || '';
    defaults.netCompany  = c.company  || '';
    defaults.netRole     = c.role     || '';
    defaults.netPlatform = c.platform || 'LinkedIn';
    defaults.netDate     = c.date     || '';
    defaults.netMsg      = c.msg      || 'Y';
    defaults.netReply    = c.reply    || 'N';
    defaults.netFollowup = c.followup || 'Y';
    defaults.netNotes    = c.notes    || '';
  }

  Object.entries(defaults).forEach(function(pair) {
    const el = getEl(pair[0]);
    if (el) el.value = pair[1];
  });

  openModal('networkModal');
}

function saveContact() {
  const idxEl = getEl('netEditIndex');
  if (!idxEl) return;

  function fval(id) { const e = getEl(id); return e ? e.value : ''; }

  const idx     = idxEl.value;
  const contact = {
    name:     fval('netName').trim(),
    company:  fval('netCompany').trim(),
    role:     fval('netRole').trim(),
    platform: fval('netPlatform'),
    date:     fval('netDate'),
    msg:      fval('netMsg'),
    reply:    fval('netReply'),
    followup: fval('netFollowup'),
    notes:    fval('netNotes').trim()
  };

  if (!contact.name) { showToast('Name is required', 'error'); return; }

  if (idx !== '') state.networking[parseInt(idx, 10)] = contact;
  else            state.networking.push(contact);

  saveState();
  closeModal('networkModal');
  renderNetworkTable();
  showToast(idx !== '' ? 'Contact updated!' : 'Contact added!', 'success');
}

function deleteContact(idx) {
  if (!confirm('Remove this contact?')) return;
  state.networking.splice(idx, 1);
  saveState();
  renderNetworkTable();
}

function renderNetworkTable() {
  const tbody = getEl('networkTableBody');
  if (!tbody) return;

  if (!state.networking.length) {
    tbody.innerHTML = '<tr><td colspan="10" class="empty-state">No contacts yet - start building your network!</td></tr>';
    return;
  }

  tbody.innerHTML = state.networking.map((c, i) =>
    '<tr>' +
    '<td><strong>' + esc(c.name) + '</strong></td>' +
    '<td>' + esc(c.company) + '</td>' +
    '<td style="font-size:11px">' + esc(c.role) + '</td>' +
    '<td>' + esc(c.platform) + '</td>' +
    '<td style="font-size:11px;color:var(--muted)">' + (c.date||'--') + '</td>' +
    '<td><span class="yn-badge ' + (c.msg==='Y'?'yn-y':'yn-n') + '">' + c.msg + '</span></td>' +
    '<td><span class="yn-badge ' + (c.reply==='Y'?'yn-y':'yn-n') + '">' + c.reply + '</span></td>' +
    '<td><span class="yn-badge ' + (c.followup==='Y'?'yn-y':'yn-n') + '">' + c.followup + '</span></td>' +
    '<td style="font-size:11px;color:var(--muted);max-width:140px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(c.notes) + '</td>' +
    '<td class="td-actions">' +
    '<button class="btn-edit" onclick="openNetworkModal(' + i + ')">Edit</button>' +
    '<button class="btn-danger" onclick="deleteContact(' + i + ')">Del</button>' +
    '</td></tr>'
  ).join('');
}

// ─── MILESTONES ───────────────────────────────

function checkMilestones() {
  let anyNew = false;
  MILESTONES.forEach(function(m) {
    const wasUnlocked = state.tasks['milestone_' + m.id];
    const isUnlocked  = m.check(state);
    if (isUnlocked && !wasUnlocked) {
      state.tasks['milestone_' + m.id] = true;
      anyNew = true;
      showToast('Milestone unlocked: ' + m.name + '!', 'success');
    }
  });
  if (anyNew) {
    saveState();
    const milSec = getEl('section-milestones');
    if (milSec && milSec.classList.contains('active')) renderMilestones();
  }
}

function renderMilestones() {
  const grid = getEl('milestonesGrid');
  if (!grid) return;

  const streak = calcStreak();
  setEl('bigStreak', 'text', streak);

  grid.innerHTML = MILESTONES.map(function(m) {
    const unlocked = m.check(state);
    return '<div class="milestone-item ' + (unlocked?'unlocked':'') + '">' +
      '<div class="milestone-ico">' + m.icon + '</div>' +
      '<div class="milestone-text">' +
      '<div class="milestone-name">' + m.name + '</div>' +
      '<div class="milestone-desc">' + m.desc + '</div>' +
      '</div>' +
      '<div class="milestone-check">' + (unlocked?'&#x2705;':'&#x25CB;') + '</div>' +
      '</div>';
  }).join('');
}

// ─── MODAL HELPERS ────────────────────────────

function openModal(id) {
  const el = getEl(id);
  if (el) el.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const el = getEl(id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// ─── TOAST ───────────────────────────────────

var toastTimer;
function showToast(msg, type) {
  type = type || '';
  const toast = getEl('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = 'toast ' + type + ' show';
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function() { toast.className = 'toast'; }, 3000);
}

// ─── EXPORT / IMPORT ─────────────────────────

function exportJSON() {
  downloadFile('sprint30-backup.json', JSON.stringify(state, null, 2), 'application/json');
  showToast('Data exported!', 'success');
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      state = Object.assign({}, state, parsed);
      saveState();
      if (!state.courses  || state.courses.length  !== 11) initCourses();
      if (!state.posts    || state.posts.length    !== 8)  initPosts();
      if (!state.projects || state.projects.length !== 3)  initProjects();
      const startEl = getEl('startDate');
      const visaEl  = getEl('visaExpiry');
      if (startEl && state.settings.startDate)  startEl.value  = state.settings.startDate;
      if (visaEl  && state.settings.visaExpiry) visaEl.value   = state.settings.visaExpiry;
      renderDashboard();
      renderDayTasks();
      renderAppsTable();
      renderCourses();
      renderPosts();
      renderProjects();
      renderWeeklyForm();
      renderNetworkTable();
      renderMilestones();
      showToast('Data imported successfully!', 'success');
    } catch(err) {
      showToast('Error: invalid JSON file', 'error');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ─── UTILS ───────────────────────────────────

function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type: type });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Close sidebar on outside click (mobile)
document.addEventListener('click', function(e) {
  const sidebar   = getEl('sidebar');
  const hamburger = getEl('hamburgerBtn');
  if (sidebar && hamburger &&
      window.innerWidth <= 900 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      !hamburger.contains(e.target)) {
    closeSidebar();
  }
});

// Escape key closes modals
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function(m) {
      closeModal(m.id);
    });
  }
});
