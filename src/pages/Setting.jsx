import Navbar from "../components/Navbar"
import "../styles/Setting.css"


function Setting() {

  return (
     <div className="container">
    <Navbar/>
    <div className="setting-container">
  <div className="report-header">
      <p className="heading">Settings</p>
    <p className="text">Manage your app preferences and data.</p>
      </div>
    </div>
    </div>
  )
}

export default Setting