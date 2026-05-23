import { useState, useEffect, useRef } from 'react'

// ─── CONFIG ──────────────────────────────────────────────────────────────────
// Replace with your PythonAnywhere URL when deployed
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
const API_URL = `${API_BASE}/api/tasks/`

// ─── ICONS ───────────────────────────────────────────────────────────────────
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
  </svg>
)

const SpinnerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="30" strokeDashoffset="10" strokeLinecap="round"/>
  </svg>
)

const EmptyIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <rect x="8" y="12" width="32" height="28" rx="4" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 12V9C16 7.895 16.895 7 18 7H30C31.105 7 32 7.895 32 9V12" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 22H30M18 29H26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// ─── TASK ITEM ────────────────────────────────────────────────────────────────
function TaskItem({ task, index }) {
  const style = { '--delay': `${index * 60}ms` }
  return (
    <div className={`task-item ${task.is_completed ? 'done' : ''}`} style={style}>
      <div className={`task-check ${task.is_completed ? 'checked' : ''}`}>
        {task.is_completed && <CheckIcon />}
      </div>
      <div className="task-body">
        <span className="task-title">{task.title}</span>
        <span className="task-meta">
          {task.is_completed ? 'Completed' : 'Pending'} · #{task.id}
        </span>
      </div>
      <div className={`task-badge ${task.is_completed ? 'badge-done' : 'badge-pending'}`}>
        {task.is_completed ? 'Done' : 'Pending'}
      </div>
    </div>
  )
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tasks, setTasks]       = useState([])
  const [title, setTitle]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [posting, setPosting]   = useState(false)
  const [error, setError]       = useState(null)
  const [inputErr, setInputErr] = useState('')
  const [added, setAdded]       = useState(false)
  const inputRef = useRef(null)

  // ── Fetch all tasks (GET)
  const fetchTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data = await res.json()
      setTasks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTasks() }, [])

  // ── Add a new task (POST)
  const handleAdd = async (e) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) { setInputErr('Task title cannot be empty.'); return }
    setInputErr('')
    setPosting(true)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed, is_completed: false }),
      })
      if (!res.ok) throw new Error(`Failed to add task: ${res.status}`)
      const newTask = await res.json()
      setTasks(prev => [newTask, ...prev])
      setTitle('')
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
      inputRef.current?.focus()
    } catch (err) {
      setInputErr(err.message)
    } finally {
      setPosting(false)
    }
  }

  const pending   = tasks.filter(t => !t.is_completed).length
  const completed = tasks.filter(t => t.is_completed).length

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .app { min-height: 100vh; padding: 48px 20px; display: flex; flex-direction: column; align-items: center; }

        /* ── HEADER ── */
        .header { width: 100%; max-width: 620px; margin-bottom: 40px; animation: fadeUp 0.5s ease both; }
        .header-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
        .header-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
        .header-title { font-family: 'Syne', sans-serif; font-size: 36px; font-weight: 700; color: var(--ink); line-height: 1.05; letter-spacing: -0.02em; }
        .header-title span { color: var(--accent); }
        .header-sub { font-size: 13px; color: var(--ink-3); margin-top: 6px; line-height: 1.5; }
        .api-badge { display: inline-flex; align-items: center; gap: 6px; background: var(--accent-bg); border: 1px solid rgba(45,90,61,0.2); border-radius: var(--radius-pill); padding: 6px 12px; font-size: 11px; font-weight: 500; color: var(--accent); white-space: nowrap; margin-top: 4px; }
        .api-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: pulse 2s ease-in-out infinite; }

        /* ── STATS ── */
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; animation: fadeUp 0.5s ease 0.08s both; }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; }
        .stat-label { font-size: 10px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 6px; }
        .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: var(--ink); line-height: 1; }
        .stat-value.green { color: var(--accent); }

        /* ── FORM ── */
        .form-card { width: 100%; max-width: 620px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; margin-bottom: 16px; animation: fadeUp 0.5s ease 0.14s both; }
        .form-label { font-size: 11px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-3); margin-bottom: 10px; display: block; }
        .form-row { display: flex; gap: 8px; }
        .task-input { flex: 1; height: 48px; padding: 0 16px; background: var(--bg); border: 1.5px solid var(--border); border-radius: var(--radius-sm); color: var(--ink); font-family: 'Outfit', sans-serif; font-size: 14px; font-weight: 400; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
        .task-input::placeholder { color: var(--ink-4); }
        .task-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(45,90,61,0.1); }
        .task-input.err-input { border-color: var(--danger); }
        .add-btn { height: 48px; padding: 0 20px; background: var(--ink); border: none; border-radius: var(--radius-sm); color: #000000; font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.04em; cursor: pointer; display: flex; align-items: center; gap: 8px; white-space: nowrap; transition: background 0.2s, transform 0.15s; flex-shrink: 0; }
        .add-btn:hover:not(:disabled) { background: var(--accent); transform: translateY(-1px); }
        .add-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .input-err { font-size: 12px; color: var(--danger); margin-top: 8px; display: flex; align-items: center; gap: 4px; }
        .input-err::before { content: '⚠'; font-size: 11px; }
        .success-flash { font-size: 12px; color: var(--accent); margin-top: 8px; display: flex; align-items: center; gap: 4px; animation: fadeUp 0.3s ease both; }
        .success-flash::before { content: '✓'; font-weight: 600; }

        /* ── TASK LIST ── */
        .list-card { width: 100%; max-width: 620px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; animation: fadeUp 0.5s ease 0.2s both; }
        .list-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid var(--border-2); }
        .list-header-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; color: var(--ink); }
        .count-chip { background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius-pill); padding: 3px 10px; font-size: 12px; color: var(--ink-3); font-weight: 400; }

        /* loading skeleton */
        .skeleton-wrap { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .skeleton { height: 56px; background: var(--bg); border-radius: var(--radius-sm); animation: pulse 1.4s ease-in-out infinite; }

        /* empty */
        .empty { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 56px 20px; gap: 14px; color: var(--ink-3); }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 600; color: var(--ink-2); }
        .empty-sub { font-size: 13px; text-align: center; max-width: 260px; line-height: 1.6; }

        /* error */
        .err-banner { margin: 16px; background: var(--danger-bg); border: 1px solid rgba(192,57,43,0.2); border-radius: var(--radius-sm); padding: 14px 16px; font-size: 13px; color: var(--danger); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .retry-btn { font-size: 12px; font-weight: 500; color: var(--danger); background: none; border: 1px solid rgba(192,57,43,0.3); border-radius: var(--radius-pill); padding: 4px 12px; cursor: pointer; white-space: nowrap; transition: background 0.2s; }
        .retry-btn:hover { background: rgba(192,57,43,0.08); }

        /* task item */
        .task-item { display: flex; align-items: center; gap: 14px; padding: 14px 20px; border-bottom: 1px solid var(--border-2); transition: background 0.15s; animation: slideIn 0.35s ease both; animation-delay: var(--delay, 0ms); }
        .task-item:last-child { border-bottom: none; }
        .task-item:hover { background: var(--surface-2); }
        .task-item.done .task-title { text-decoration: line-through; color: var(--ink-3); }

        .task-check { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid var(--ink-4); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; color: #fff; }
        .task-check.checked { background: var(--accent); border-color: var(--accent); }

        .task-body { flex: 1; min-width: 0; }
        .task-title { display: block; font-size: 14px; font-weight: 400; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .task-meta { display: block; font-size: 11px; color: var(--ink-3); margin-top: 2px; }

        .task-badge { padding: 3px 10px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 500; flex-shrink: 0; }
        .badge-pending { background: #FEF3C7; color: #92400E; }
        .badge-done { background: var(--accent-bg); color: var(--accent); }

        /* footer */
        .footer { margin-top: 40px; font-size: 11px; color: var(--ink-4); text-align: center; animation: fadeUp 0.5s ease 0.3s both; letter-spacing: 0.04em; }

        @media (max-width: 500px) {
          .header-title { font-size: 28px; }
          .stats { grid-template-columns: repeat(3, 1fr); }
          .stat-value { font-size: 22px; }
          .form-row { flex-direction: column; }
          .add-btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <div className="app">
        {/* ── HEADER ── */}
        <div className="header">
          <div className="header-top">
            <div>
              <p className="header-eyebrow">Finals Quiz #3</p>
              <h1 className="header-title">Task<span>Board</span></h1>
              </div>
             
          </div>

          {/* ── STATS ── */}
          <div className="stats">
            <div className="stat-card">
              <p className="stat-label">Total</p>
              <p className="stat-value">{tasks.length}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Pending</p>
              <p className="stat-value">{pending}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Done</p>
              <p className="stat-value green">{completed}</p>
            </div>
          </div>
        </div>

        {/* ── ADD TASK FORM ── */}
        <div className="form-card" style={{ width: '100%', maxWidth: 620 }}>
          <label className="form-label">New Task</label>
          <form onSubmit={handleAdd}>
            <div className="form-row">
              <input
                ref={inputRef}
                className={`task-input ${inputErr ? 'err-input' : ''}`}
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={e => { setTitle(e.target.value); setInputErr(''); }}
              />
              <button className="add-btn" type="submit" disabled={posting}>
                {posting ? <SpinnerIcon /> : <PlusIcon />}
                {posting ? 'Adding…' : 'Add Task'}
              </button>
            </div>
            {inputErr && <p className="input-err">{inputErr}</p>}
            {added && <p className="success-flash">Task added successfully!</p>}
          </form>
        </div>

        {/* ── TASK LIST ── */}
        <div className="list-card">
          <div className="list-header">
            <span className="list-header-title">All Tasks</span>
            <span className="count-chip">{tasks.length} tasks</span>
          </div>

          {loading && (
            <div className="skeleton-wrap">
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ animationDelay: `${i*150}ms` }} />)}
            </div>
          )}

          {!loading && error && (
            <div className="err-banner">
              <span>⚠ {error}</span>
              <button className="retry-btn" onClick={fetchTasks}>Retry</button>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="empty">
              <EmptyIcon />
              <p className="empty-title">No tasks yet</p>
              <p className="empty-sub">Add your first task using the form above to get started.</p>
            </div>
          )}

          {!loading && !error && tasks.map((task, i) => (
            <TaskItem key={task.id} task={task} index={i} />
          ))}
        </div>

        <p className="footer">
        </p>
      </div>
    </>
  )
}