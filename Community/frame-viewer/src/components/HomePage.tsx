import { Link, Outlet } from 'react-router-dom';

const HomePage: React.FC = () => (
  <div>
    <h1>Selecione uma opção</h1>
    <Link to="/upload">Upload</Link> | <Link to="/list">Listagem</Link>
    <div id="childrenPage">
        <Outlet />
    </div>
  </div>
);

export default HomePage;
