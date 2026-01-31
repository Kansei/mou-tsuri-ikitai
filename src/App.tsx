import { HashRouter, Routes, Route, NavLink } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ShipsPage } from './pages/ShipsPage';
import './App.css';

function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="header">
          <div className="header-content">
            <h1 className="site-title">
              <NavLink to="/">もう釣りいきたい</NavLink>
            </h1>
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
          <p>もう釣りいきたい - 遊漁船検索サービス</p>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
