const prompts = {
  reflection: [
    "Write a letter to your future self 5 years from now",
    "What would you tell your 13-year-old self?",
    "Describe the moment you felt most proud of yourself",
    "What is one habit you want to break and why?",
    "What does your ideal day look like in detail?",
    "Write about a failure that taught you something valuable",
    "What are 10 things you are grateful for right now?",
    "Describe the person you want to become",
    "What fear is holding you back the most?",
    "Write about a relationship that changed you",
    "What does success mean to you personally?",
    "If you had one year left to live, how would you spend it?",
    "What is something you need to forgive yourself for?",
    "Describe your happiest childhood memory",
    "What values matter most to you and why?",
    "Write about a time you stepped out of your comfort zone",
    "What do you wish people understood about you?",
    "What is something you keep putting off and why?",
    "Describe the legacy you want to leave behind",
    "What does happiness look like for you today?"
  ],
  productivity: [
    "What is the one skill that would change your life if you mastered it?",
    "Describe your perfect productive day from morning to night",
    "What does the best version of you look like in 90 days?",
    "Write about a mentor who shaped how you think and work",
    "What three habits separate who you are now from who you want to be?",
    "If you could only focus on one goal this year, what would it be and why?",
    "What does discipline mean to you and where do you struggle with it?",
    "Write about a book, podcast, or idea that shifted your mindset",
    "What is one thing you do every day that adds no value to your life?",
    "Describe your relationship with time — are you in control of it?",
    "What would you attempt if you knew you could not fail?",
    "Write about a moment when hard work paid off for you",
    "What does your environment say about your priorities?",
    "How do you handle setbacks and what could you do better?",
    "What are the three biggest distractions in your life right now?",
    "Write a 5 year career plan as if everything goes perfectly",
    "What boundaries do you need to set to protect your growth?",
    "Who in your life pushes you to be better and how?",
    "What does your morning routine say about your mindset?",
    "Write a letter to your future successful self asking for advice"
  ],
  vision: [
    "Create your vision board in words — describe every part of it",
    "Where do you want to be in 10 years — career, relationships, lifestyle?",
    "Where do you want to be in 10 years — career, relationships, lifestyle?",
    "What does financial freedom look like for you?",
    "Describe your dream home inside and out",
    "What three things would change your life if you accomplished them this year?",
    "Write a mission statement for your life",
    "What kind of friend do you want to be known as?",
    "Describe the impact you want to have on your community",
    "Write a letter to someone you admire telling them how they influenced you"
  ]
};

let currentTab = 'reflection';
let currentIndex = 0;

function showTab(tab) {
  currentTab = tab;
  currentIndex = 0;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => {
    if (t.textContent.trim() === tabLabel(tab)) {
      t.classList.add('active');
    }
  });
  renderPrompt();
  loadWriting();
}

function tabLabel(tab) {
  if (tab === 'reflection') return 'Self Reflection';
  if (tab === 'productivity') return 'Productivity & Growth';
  if (tab === 'vision') return 'Vision & Goals';
}

function renderPrompt() {
  const list = prompts[currentTab];
  const el = document.getElementById('prompt-text');
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = list[currentIndex];
    el.style.opacity = '1';
  }, 200);
  document.getElementById('prompt-counter').textContent = (currentIndex + 1) + ' / ' + list.length;
}

function nextPrompt() {
  const list = prompts[currentTab];
  currentIndex = (currentIndex + 1) % list.length;
  renderPrompt();
  loadWriting();
}

function prevPrompt() {
  const list = prompts[currentTab];
  currentIndex = (currentIndex - 1 + list.length) % list.length;
  renderPrompt();
  loadWriting();
}

function getKey() {
  return 'writespace_' + currentTab + '_' + currentIndex;
}

function loadWriting() {
  const saved = localStorage.getItem(getKey()) || '';
  document.getElementById('writing-area').value = saved;
  updateSaveStatus(saved ? 'Draft saved' : '');
}

function updateSaveStatus(msg) {
  document.getElementById('save-status').textContent = msg;
}

function clearWriting() {
  if (!confirm('Clear your writing for this prompt?')) return;
  localStorage.removeItem(getKey());
  document.getElementById('writing-area').value = '';
  updateSaveStatus('');
  renderEntries();
}

function saveEntry(text) {
  const key = getKey();
  const meta = JSON.parse(localStorage.getItem('writespace_meta') || '{}');
  meta[key] = {
    tab: currentTab,
    index: currentIndex,
    prompt: prompts[currentTab][currentIndex],
    date: new Date().toLocaleString()
  };
  localStorage.setItem('writespace_meta', JSON.stringify(meta));
}

function getAllEntries() {
  const meta = JSON.parse(localStorage.getItem('writespace_meta') || '{}');
  return Object.entries(meta).map(([key, data]) => ({
    key,
    ...data,
    text: localStorage.getItem(key) || ''
  })).filter(e => e.text.trim() !== '');
}

function categoryLabel(tab) {
  if (tab === 'reflection') return 'Self Reflection';
  if (tab === 'productivity') return 'Productivity & Growth';
  if (tab === 'vision') return 'Vision & Goals';
}

function renderEntries() {
  const container = document.getElementById('entries-list');
  const entries = getAllEntries();

  if (entries.length === 0) {
    container.innerHTML = '<p class="no-entries">No entries yet.<br>Start writing to see your journey here.</p>';
    return;
  }

  container.innerHTML = entries.reverse().map(e => `
    <div class="entry-card" onclick="goToEntry('${e.key}', '${e.tab}', ${e.index})">
      <div class="entry-category">${categoryLabel(e.tab)}</div>
      <div class="entry-prompt">${e.prompt}</div>
      <div class="entry-date">${e.date}</div>
    </div>
  `).join('');
}

function goToEntry(key, tab, index) {
  currentTab = tab;
  currentIndex = index;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => {
    if (t.textContent.trim() === tabLabel(tab)) {
      t.classList.add('active');
    }
  });
  renderPrompt();
  loadWriting();
  closeSidebar();
}

function openSidebar() {
  renderEntries();
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebar-overlay').style.display = 'block';
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebar-overlay').style.display = 'none';
}

document.getElementById('writing-area').addEventListener('input', function() {
  const text = this.value;
  localStorage.setItem(getKey(), text);
  if (text.trim() !== '') saveEntry(text);
  updateSaveStatus('Saved ✓');
});

renderPrompt();
loadWriting();