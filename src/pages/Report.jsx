import Navbar from "../components/Navbar"
import "../styles/Report.css"


function Report() {

  return (
    <div className="container">
    <Navbar/>
    <div className="report-container">
      <div className="report-header">
      <p className="heading">Visual insights into your job search</p>
    <p className="text">Track progress, analyze trends, and identify opportunities for improvement.</p>
      </div>
    </div>
    </div>
  )
}

export default Report