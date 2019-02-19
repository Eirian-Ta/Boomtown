import React from 'react'
import { Link } from "react-router-dom";

/*import Login from "./Login"*/



const Sidebar = ({
  setCSRFToken,
}) => {
  return (
    <div>
      <h1>This is the Dashboard</h1>

     <button onClick={()=> {
      localStorage.clear()
      setCSRFToken(null)
    }}>
      Log Out</button>

      <Link to="/"><button>My Items</button></Link>
      <Link to="/Borrowing"><button>Borrowing</button></Link>
      <Link to="/Library"><button>Library</button></Link>
    </div>
  )
}

export default Sidebar