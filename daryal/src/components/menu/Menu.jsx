import './Menu.scss';
import { FaUser } from 'react-icons/fa';

export default function Menu() {
  return (
    <div className="menu">
      <a href="/" className="menu-item">
        Diagnocis
      </a>
      <a href="/code" className="menu-item">
         Codigos
      </a>
     
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