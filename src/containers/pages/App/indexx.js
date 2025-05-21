import logo from '../../../assets/img/logo/logo.svg';
import './App.css';

function App() {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <nav>
          <ul>
            <li>Users</li>
            <li>Analytics</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main">
        <header className="header">
          <h1>Welcome to the Dashboard</h1>
        </header>

        <section className="cards">
          <div className="card">
            <h3>Total Users</h3>
            <p>1,024</p>
          </div>
          <div className="card">
            <h3>Active Sessions</h3>
            <p>312</p>
          </div>
          <div className="card">
            <h3>Revenue</h3>
            <p>$7,540</p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;