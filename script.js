// ---- TAB SWITCHING ----
function showTab(tab) {
  document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById(tab).classList.remove('hidden');
  event.target.classList.add('active');
}

// ---- NOTES ----
function getNotes() {
  return JSON.parse(localStorage.getItem('notes') || '[]');
}

function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

function addNote() {
  const title = document.getElementById('note-title').value.trim();
  const body = document.getElementById('note-body').value.trim();
  if (!title && !body) return;

  const notes = getNotes();
  notes.unshift({ id: Date.now(), title, body });
  saveNotes(notes);

  document.getElementById('note-title').value = '';
  document.getElementById('note-body').value = '';
  renderNotes();
}

function deleteNote(id) {
  saveNotes(getNotes().filter(n => n.id !== id));
  renderNotes();
}

function renderNotes() {
  const container = document.getElementById('notes-container');
  const notes = getNotes();
  container.innerHTML = notes.map(n => `
    <div class="note-card">
      <h3>${n.title}</h3>
      <p>${n.body}</p>
      <button class="delete-btn" onclick="deleteNote(${n.id})">Delete</button>
    </div>
  `).join('');
}

// ---- LISTS ----
function getItems() {
  return JSON.parse(localStorage.getItem('listitems') || '[]');
}

function saveItems(items) {
  localStorage.setItem('listitems', JSON.stringify(items));
}

function addListItem() {
  const input = document.getElementById('list-item');
  const text = input.value.trim();
  if (!text) return;

  const items = getItems();
  items.unshift({ id: Date.now(), text, checked: false });
  saveItems(items);

  input.value = '';
  renderList();
}

function toggleItem(id) {
  const items = getItems().map(i => i.id === id ? { ...i, checked: !i.checked } : i);
  saveItems(items);
  renderList();
}

function deleteItem(id) {
  saveItems(getItems().filter(i => i.id !== id))