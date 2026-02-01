import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ShipsPage } from './pages/ShipsPage';
import './App.css';

function FishIcon() {
  return (
    <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
      <path d="M12 20L12.76 19.64C14.78 18.74 16.54 17.38 17.95 15.64C19.92 13.18 20.96 10.62 20.96 8.5C20.96 8.5 21 8 20.5 7.5C20 7 18 6 16 7C14.5 7.75 13.5 9 12 9C10.5 9 9.5 7.75 8 7C6 6 4 7 3.5 7.5C3 8 3.04 8.5 3.04 8.5C3.04 10.62 4.08 13.18 6.05 15.64C7.46 17.38 9.22 18.74 11.24 19.64L12 20Z"/>
      <circle cx="7" cy="10" r="1"/>
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
