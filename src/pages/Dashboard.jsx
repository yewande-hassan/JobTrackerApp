import Card from "../components/Card"
import Navbar from "../components/Navbar"
import "../styles/Dashboard.css"


function Dashboard() {

  return (
    <div className="container">
    <Navbar/>
    <div className="dashboard-container">
    <h2>Welcome back Yewande! 👋🏼</h2>
    <div className="cards">
    <Card title='Saved Jobs'/>
    <Card title='Applied to Jobs'/>
    <Card title='Interview Jobs'/>
    <Card title='Offer'/>
    </div>

    </div>
    </div>
  )
}

export default Dashboard