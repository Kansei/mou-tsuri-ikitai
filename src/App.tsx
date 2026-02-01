import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ShipsPage } from './pages/ShipsPage';
import './App.css';

function FishIcon() {
  return (
    <svg className="logo-icon" viewBox="0 0 32 32" fill="currentColor" width="32" height="32">
      {/* 魚の体 */}
      <ellipse cx="14" cy="16" rx="11" ry="7" />
      {/* 尾びれ */}
      <path d="M24 16 L31 9 L31 23 Z" />
      {/* 目 */}
      <circle cx="7" cy="14" r="2" fill="#fff" />
      <circle cx="7" cy="14" r="1" fill="#1a1a1a" />
      {/* 背びれ */}
      <path d="M12 9 Q14 4 18 9" fill="currentColor" />
    </svg>
  );
}

function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <NavLink to="/" className="logo">
              <FishIcon />
              <div className="logo-text">
                <span className="logo-main">もうツリイキタイ</span>
                <span className="logo-sub">釣船検索</span>
              </div>
            </NavLink>
            <nav className="nav">
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} end>
                プラン検索
              </NavLink>
              <NavLink to="/ships" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                遊漁船一覧
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ships" element={<ShipsPage />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>もうツリイキタイ 釣船検索</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
