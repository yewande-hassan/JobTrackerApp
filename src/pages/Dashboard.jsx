import { useState } from "react";
import Card from "../components/Card"
import Navbar from "../components/Navbar"
import Modal from "../components/Modal";
import cardsData from "../data/CardData";
import "../styles/Dashboard.css"
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const sections = ["saved", "applied", "interview","offer"];
function Dashboard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] =useState(false);
  const {currentUser} = useAuth()
  const handleCardClick = (job)=>{
    setSelectedJob(job)
    setIsModalOpen(true)
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="container">
    <Navbar/>
    <div className="dashboard-container">
    <h2>Welcome back {currentUser.email} 👋🏼</h2>
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
                  :section === "interview"
                  ?"Interview Jobs"
                :"Offer"}
              </h3>
              <span className="count">{filtered.length}</span>
                </div>
               <FaPlus className="plus-btn"/>
            </div> 
            {filtered.map((job) => (
             <Card key={job.id} job={job} onClick={() => handleCardClick(job)} />
            ))}
          </div>
        );
      })}

    </div>
        {/* Modal is conditionally rendered here */}
        {isModalOpen && (
          <Modal job={selectedJob} onClose={handleCloseModal} />
        )}
    </div>
    </div>
  )
}

export default Dashboard