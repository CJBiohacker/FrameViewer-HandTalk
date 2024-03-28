import { Link, Outlet } from 'react-router-dom';

const defaultStyle = 'tw-font-bold tw-text-center';

const HomePage: React.FC = () => (
  <div>
    <h1 className={`tw-text-4xl ${defaultStyle}`}>Selecione uma opção</h1>
    <div className={`tw-text-2xl tw-underline ${defaultStyle}`}>
    <Link to="/">Home</Link> | <Link to="/upload">Upload</Link> | <Link to="/list">Listagem</Link>
    </div>
    <div id="childrenPage">
        <Outlet />
    </div>
  </div>
);

export default HomePage;
