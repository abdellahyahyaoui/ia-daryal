// // Navbar.jsx
// import Logo from '../logo/Logo'
// import Menu from '../menu/Menu'
// import './Navbar.scss'
// import '../logo/Logo.scss'

// export default function Navbar() {
//   return (
//     <div className="navbar">
      
//       <Menu />
//     </div>
//   )
// }
// Navbar.jsx
import Menu from "../menu/Menu"
import "./Navbar.scss"

export default function Navbar() {
  return (
    <div className="navbar-container">
      <Menu />
    </div>
  )
}
