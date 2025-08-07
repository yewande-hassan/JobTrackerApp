import Card from "../components/Card"
import Navbar from "../components/Navbar"
import cardsData from "../data/CardData";
import "../styles/Dashboard.css"
import { FaPlus } from "react-icons/fa";

const sections = ["saved", "applied", "interview"];
function Dashboard() {

  return (
    <div className="container">
    <Navbar/>
    <div className="dashboard-container">
    <h2>Welcome back Yewande! 👋🏼</h2>
    <div className="cards">
        {sections.map((section) => {
        const filtered = cardsData.filter((card) => card.status === section);
        return (
          <div key={section} className="section-column">
            <div className="section-header">
                <div className="part">
              <h3>
                {section === "saved"
                  ? "Saved Jobs"
                  : section === "applied"
                  ? "Applied to Jobs"
                  : "Interview Jobs"}
              </h3>
              <span className="count">{filtered.length}</span>
                </div>
               <FaPlus className="plus-btn"/>
            </div> 
            {filtered.map((job) => (
              <Card
                key={job.id}
                company={job.company}
                role={job.role}
                date={job.date}
                logo={job.logo}
              />
            ))}
          </div>
        );
      })}

    </div>
    </div>
    </div>
  )
}

export default Dashboard