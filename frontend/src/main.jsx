import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookOpen, Boxes, BriefcaseBusiness, Building2, CalendarCheck, GraduationCap, Home, Landmark, Lock, Moon, Package, ReceiptText, Search, Settings, Sun, Users, WalletCards } from 'lucide-react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { request, setToken, dataApi } from './api';
import './styles/app.css';

const nav = [
  ['dashboard', 'Dashboard', Home],
  ['students', 'Students', GraduationCap],
  ['courses', 'Courses', BookOpen],
  ['admissions', 'Admissions', CalendarCheck],
  ['fees', 'Fees & Billing', ReceiptText],
  ['departments', 'Departments', Building2],
  ['projects', 'Company Projects', BriefcaseBusiness],
  ['assets', 'Assets', Boxes],
  ['employees', 'Employees', Users],
  ['inventory', 'Inventory', Package],
  ['reports', 'Reports', BarChart3],
  ['admin', 'Admin', Settings],
  ['guide', 'User Guide', Landmark]
];
const modules = { students: 'students', courses: 'courses', admissions: 'admissions', departments: 'departments', projects: 'projects', assets: 'assets', employees: 'employees', inventory: 'products' };
const fields = {
  students: ['admission_no', 'name', 'phone', 'email', 'program', 'semester', 'status', 'fee_due'],
  courses: ['code', 'title', 'department', 'faculty', 'credits', 'capacity', 'enrolled'],
  admissions: ['application_no', 'student_name', 'program', 'stage', 'counselor', 'score'],
  fee_payments: ['receipt_no', 'student_id', 'payment_date', 'amount', 'method', 'status', 'notes'],
  departments: ['name', 'head', 'type', 'budget', 'location'],
  projects: ['code', 'name', 'client', 'department', 'manager', 'budget', 'spent', 'status', 'due_date'],
  assets: ['asset_tag', 'name', 'category', 'owner', 'location', 'purchase_value', 'status'],
  employees: ['name', 'phone', 'role', 'shift', 'salary', 'attendance_status', 'performance_score'],
  products: ['name', 'sku', 'category', 'sale_price', 'stock', 'low_stock', 'warehouse']
};
function money(v) { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v || 0); }
function Login({ onLogin }) {
  const [form, setForm] = useState({ email: 'admin@campuscompany.local', password: 'admin123' });
  const [err, setErr] = useState('');
  async function submit(e) {
    e.preventDefault();
    try { const data = await request('/auth/login', { method: 'POST', body: form }); setToken(data.token); onLogin(data.user); }
    catch (ex) { setErr(ex.message); }
  }
  return <div className="login"><motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="login-card"><div className="brand"><span>CC</span><div><h1>CampusCompany ERP</h1><p>ERP software for colleges and companies</p></div></div><label>Email<input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label><label>Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>{err && <b className="error">{err}</b>}<button><Lock size={18} /> Secure Login</button><small>Demo: admin@campuscompany.local / admin123</small></motion.form></div>;
}
function App() {
  const [user, setUser] = useState(localStorage.cce_token ? { name: 'Admin User', role: 'admin' } : null);
  const [page, setPage] = useState('dashboard');
  const [dark, setDark] = useState(true);
  const [query, setQuery] = useState('');
  useEffect(() => window.campusCompany?.onShortcut(k => { if (k === 'billing') setPage('fees'); if (k === 'search') document.querySelector('#globalSearch')?.focus(); }), []);
  if (!user) return <Login onLogin={setUser} />;
  const current = nav.find(n => n[0] === page);
  return <div className={dark ? 'app dark' : 'app'}><aside><div className="logo"><span>CC</span><div><b>CampusCompany ERP</b><small>College + Corporate</small></div></div>{nav.map(([id, label, Icon]) => <button key={id} onClick={() => setPage(id)} className={page === id ? 'active' : ''}><Icon size={19} />{label}</button>)}</aside><main><header><div><h2>{current?.[1]}</h2><p>One ERP for admissions, academics, fees, HR, projects, inventory, assets and reports.</p></div><div className="tools"><div className="search"><Search size={17} /><input id="globalSearch" placeholder="Search students, employees, fees, assets..." value={query} onChange={e => setQuery(e.target.value)} /></div><button onClick={() => setDark(!dark)}>{dark ? <Sun /> : <Moon />}</button><div className="avatar">{user.name?.[0] || 'A'}</div></div></header><AnimatePresence mode="wait"><motion.section key={page} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{page === 'dashboard' && <Dashboard />}{page === 'fees' && <Fees />}{modules[page] && <DataModule table={modules[page]} title={current[1]} q={query} />}{page === 'reports' && <Reports />}{page === 'admin' && <Admin />}{page === 'guide' && <Guide />}</motion.section></AnimatePresence></main></div>;
}
function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { request('/dashboard').then(setD); }, []);
  if (!d) return <div className="loader">Loading CampusCompany analytics...</div>;
  const cards = [['Collected Revenue', money(d.totalSales), WalletCards], ['Transactions', d.totalOrders, ReceiptText], ['Pending Fees & Dues', money(d.pendingPayments), Users], ['Net Operating Margin', money(d.monthlyProfit), BarChart3], ['Active Students', d.students, GraduationCap]];
  return <><div className="cards five">{cards.map(([l, v, I]) => <div className="card" key={l}><I /><span>{l}</span><b>{v}</b></div>)}</div><div className="grid two"><Panel title="Fee Collection Trend"><ResponsiveContainer height={260}><AreaChart data={d.monthly}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey="sales" stroke="#38bdf8" fill="#38bdf855" /></AreaChart></ResponsiveContainer></Panel><Panel title="Project Portfolio"><ResponsiveContainer height={260}><BarChart data={d.projects}><XAxis dataKey="status" /><YAxis /><Tooltip /><Bar dataKey="budget" fill="#6366f1" /><Bar dataKey="spent" fill="#22c55e" /></BarChart></ResponsiveContainer></Panel></div><div className="grid three"><List title="Course Capacity" rows={d.courseLoad} cols={['code', 'title', 'enrolled', 'capacity']} /><List title="Admissions Pipeline" rows={d.admissions} cols={['stage', 'count']} /><List title="Top Employees" rows={d.workers} cols={['name', 'role', 'performance_score']} /></div><div className="grid two"><List title="Asset Summary" rows={d.assets} cols={['category', 'count', 'value']} /><List title="Low Inventory Alerts" rows={d.lowStock} cols={['name', 'stock', 'low_stock']} /></div></>;
}
function Fees() {
  return <div className="grid module"><DataEntry table="fee_payments" title="Fee Receipt" /><BillingPanel /></div>;
}
function BillingPanel() {
  const [students, setStudents] = useState([]), [items, setItems] = useState([]), [receipt, setReceipt] = useState(null);
  useEffect(() => { dataApi('students').list().then(setStudents); }, []);
  const plans = [{ description: 'Tuition Fee', price: 25000 }, { description: 'Library & Lab Fee', price: 4500 }, { description: 'Corporate Training Fee', price: 12000 }];
  const total = items.reduce((s, i) => s + i.quantity * i.price * (1 + (i.tax_rate || 0) / 100), 0);
  const add = p => setItems([...items, { description: p.description, quantity: 1, price: p.price, tax_rate: 0 }]);
  async function create() { const inv = await request('/billing/invoice', { method: 'POST', body: { customer_id: students[0]?.id, items, paid: total, payment_method: 'UPI' } }); setReceipt(inv); }
  return <Panel title="Fast College/Company Billing"><div className="product-pills">{plans.map(p => <button key={p.description} onClick={() => add(p)}>{p.description}<small>{money(p.price)}</small></button>)}</div><table><tbody>{items.map((i, idx) => <tr key={idx}><td>{i.description}</td><td><input type="number" value={i.quantity} onChange={e => setItems(items.map((x, n) => n === idx ? { ...x, quantity: +e.target.value } : x))} /></td><td>{money(i.price)}</td></tr>)}</tbody></table><div className="checkout"><b>Total {money(total)}</b><button disabled={!items.length} onClick={create}>Generate Receipt</button></div>{receipt && <div className="invoice"><h2>CampusCompany ERP</h2><p>Fee / Service Receipt • QR Enabled</p><b>{receipt.invoice_no}</b><h1>{money(receipt.total)}</h1><img src={receipt.qr} /><p>Status: {receipt.status}</p></div>}</Panel>;
}
function DataModule({ table, title, q }) {
  return <div className="grid module"><DataEntry table={table} title={title} /><DataTable table={table} title={title} q={q} /></div>;
}
function DataEntry({ table, title }) {
  const [form, setForm] = useState({});
  const [saved, setSaved] = useState(false);
  const api = useMemo(() => dataApi(table), [table]);
  async function save() { await api.create(form); setForm({}); setSaved(true); setTimeout(() => setSaved(false), 1800); }
  return <Panel title={`Add ${title}`}>{fields[table].map(f => <input key={f} placeholder={f.replaceAll('_', ' ')} value={form[f] || ''} onChange={e => setForm({ ...form, [f]: e.target.value })} />)}<button onClick={save}>Save Record</button>{saved && <small className="success">Saved. Refresh/search to view the new record.</small>}</Panel>;
}
function DataTable({ table, title, q }) {
  const [rows, setRows] = useState([]);
  const api = useMemo(() => dataApi(table), [table]);
  useEffect(() => { api.list(q).then(setRows); }, [table, q]);
  return <Panel title={`${title} Records`}><div className="table-wrap"><table><thead><tr>{fields[table].map(f => <th key={f}>{f.replaceAll('_', ' ')}</th>)}</tr></thead><tbody>{rows.map(r => <tr key={r.id}>{fields[table].map(f => <td key={f}>{r[f]}</td>)}</tr>)}</tbody></table></div></Panel>;
}
function Reports() { return <div className="grid three"><ExportCard type="excel" label="Complete ERP Excel Workbook" /><ExportCard type="xml/all" label="XML Data Backup" /><ExportCard type="csv/students" label="Students CSV" /><ExportCard type="csv/projects" label="Projects CSV" /><ExportCard type="csv/assets" label="Assets CSV" /></div>; }
function ExportCard({ type, label }) { const [file, setFile] = useState(''); return <Panel title={label}><p>One-click exports for auditors, accreditation teams, finance, HR and management reviews.</p><button onClick={() => request(`/export/${type}`).then(r => setFile(r.file))}>Export</button>{file && <small>{file}</small>}</Panel>; }
function Admin() { return <div className="grid two"><Panel title="Security & Roles"><p>Admin authentication, encrypted passwords, JWT sessions and role-ready API permissions for registrar, finance, HR, asset and project users.</p></Panel><Panel title="Backup & Restore"><button onClick={() => request('/export/excel/backup', { method: 'POST' }).then(r => alert(`Backup created: ${r.file}`))}>Create Excel Backup Now</button><div className="drop">Drag & drop XML/Excel files here for guided restore</div></Panel></div>; }
function Guide() { return <Panel title="CampusCompany ERP User Guide"><ol><li>Use Students, Admissions and Courses to operate college lifecycle workflows.</li><li>Use Fees & Billing for receipts, dues, service invoices and QR-ready payment proof.</li><li>Use Departments, Employees, Projects and Assets for company operations and shared services.</li><li>Use Inventory for books, lab kits, ID cards, office supplies and training materials.</li><li>Export Excel, CSV and XML reports from Reports; create backups from Admin.</li></ol><p>Keyboard shortcuts: Ctrl+B fees/billing and Ctrl+F global search.</p></Panel>; }
function Panel({ title, children }) { return <div className="panel"><h3>{title}</h3>{children}</div>; }
function List({ title, rows = [], cols }) { return <Panel title={title}><table><tbody>{rows.map((r, i) => <tr key={i}>{cols.map(c => <td key={c}>{typeof r[c] === 'number' && String(c).includes('value') ? money(r[c]) : r[c]}</td>)}</tr>)}</tbody></table></Panel>; }
createRoot(document.getElementById('root')).render(<App />);
