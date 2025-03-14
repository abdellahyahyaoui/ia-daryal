import './Menu.scss';
import { FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Menu() {
  return (
    <div className="menu">
      <Link to="/" className="menu-item">
        Diagnosis
      </Link>
      <Link to="/code" className="menu-item">
        Códigos
      </Link>
      {/* <Link to="/login" className="menu-item">
        Login
      </Link>
      <Link to="/register" className="menu-item">
        Registro
      </Link> */}
    </div>
  );
}





//  <div className='item'>
//       <a href="#registro" className="menu-item">
//         <FaUser /> {/* Icono de usuario */}
//       </a>

//       <a href="#carrito" className="menu-item">
//         <FaShoppingCart /> {/* Icono de carrito */}
//       </a>
//       </div>