import { useEffect, useState } from "react";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import { CardData, sectionConfig } from "../data/CardData";
import "../styles/Dashboard.css";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Edit from "../components/Edit";
import { collection, getDocs, QuerySnapshot, } from "firebase/firestore";
import { db } from "../services/firebase";
const sections = ["Saved", "Applied", "Interview", "Offer"];

function Dashboard() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(null);
  const [isSaved, setIsSaved] = useState([]);
  const { currentUser } = useAuth();

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleEdit = (section) => {
    setShowEdit(section);
  };

  let username = currentUser?.email
    .toString()
    .split("@")[0]
    .replace(/^./, (c) => c.toUpperCase());

  const fetchPost = async () => {
    await getDocs(collection(db, "job")).then((QuerySnapshot) => {
      const newData = QuerySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setIsSaved(newData);
    });
  };


  useEffect(() => {
    fetchPost();
    // addData()
  }, []);
  return (
    <div className="container">
      <Navbar />
      <div className="dashboard-container">
        {showEdit ? (
          <Edit
          section={showEdit}
          />
        ) : (
          <>
            <div className="top-header">
              <h2>Welcome back {username} 👋🏼</h2>
              <p>
                Track your application, follow up on your opportunities and land
                your dream Job faster
              </p>
            </div>
            <div className="cards">
              {sections.map((section) => {
                const filtered = isSaved.filter(
                  (card) => card.status === section
                );
                return (
                  <div key={section} className="section-column">
                    <div className="section-header">
                      <div className="part">
                        <img
                          src={sectionConfig[section]?.icon}
                          alt={sectionConfig[section]?.label}
                        />
                        <h3>{sectionConfig[section]?.label}</h3>
                        <span className="count">{filtered.length}</span>
                      </div>
                    </div>

                    {filtered.map((job) => (
                      <Card
                        key={job.id}
                        job={job}
                        onClick={() => handleCardClick(job)}
                      />
                    ))}

                    <div className="add" onClick={() => handleEdit(section)}>
                      <FaPlus className="plus-btn" />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Modal is conditionally rendered here */}
        {isModalOpen && <Modal job={selectedJob} onClose={handleCloseModal} />}
      </div>
    </div>
  );
}

export default Dashboard;
