import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import MyItems from './MyItems'




const Dashboard = () => {
  return (
    <div>
      <MyItems/>
    </div>
  )
}

export default Dashboard