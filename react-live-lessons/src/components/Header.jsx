import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  return (
    <header className="site-header">
      <div className="container">
        <h1 className="logo">VidyaVatika</h1>
        <nav className="main-nav">
          <Link to="/" className={location.pathname === '/' ? 'highlight' : ''}>Home</Link>
          <Link to="/live" className={location.pathname === '/live' ? 'highlight' : ''}>Live Lessons</Link>
          <Link to="/register" className={location.pathname === '/register' ? 'highlight' : ''}>Register</Link>
          <Link to="/login" className={location.pathname === '/login' ? 'highlight' : ''}>Login</Link>
          <Link to="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
