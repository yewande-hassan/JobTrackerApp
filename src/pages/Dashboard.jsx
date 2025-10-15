import { useEffect, useState, useCallback } from "react";
import confetti from "canvas-confetti";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import {sectionConfig } from "../data/CardData";
import "../styles/Dashboard.css";
import { FaPlus } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Edit from "../components/Edit";
import { db, query, where, collection,getDocs,doc,updateDoc, onSnapshot } from "../services/firebase";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
const sections = ["Saved", "Applied", "Interview", "Offer"];

function Dashboard() {
  // Inline Edit rendering when creating or editing
  const [showEdit, setShowEdit] = useState(null);
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [profileResumeText, setProfileResumeText] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    // Subscribe to the user's profile doc so resumeText updates in real-time
    if (!currentUser?.uid) {
      setProfileResumeText("");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);
    const unsubscribe = onSnapshot(userRef, (snap) => {
      const data = snap.data();
      setProfileResumeText(data?.resumeText || "");
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const handleCardClick = (job) => {
    setEditingJobId(job.id);
    setShowEdit(job.status || "Saved");
  };

  // no-op: modal removed

  const handleEdit = (section) => {
    setShowEdit(section);
  };

  let username = currentUser?.email
    .toString()
    .split("@")[0]
    .replace(/^./, (c) => c.toUpperCase());

  const fetchJobs = useCallback(async () => {
    if (!currentUser) return;
    const jobsRef = collection(db, "job");
    const q = query(jobsRef, where("userId", "==", currentUser.uid));
    const querySnapshot = await getDocs(q);
    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setJobs(newData);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchJobs();
    }
  }, [currentUser, fetchJobs]);

  // Handle drag and drop
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId;

    // Update local state
    setJobs((prev) =>
      prev.map((job) =>
        job.id === draggableId ? { ...job, status: newStatus } : job
      )
    );
    // Update Firestore
    const jobRef = doc(db, "job", draggableId);
    await updateDoc(jobRef, { status: newStatus });

    // Fire confetti when moved into the Offer column
    if (newStatus === "Offer") {
      // A quick burst
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.3 },
        scalar: 1.1,
      });
      // A second burst with different angle/colors for flair
      setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 100,
          startVelocity: 45,
          ticks: 200,
          colors: ["#34d399", "#3b82f6", "#f59e0b", "#ef4444"],
          origin: { y: 0.2 }
        });
      }, 250);
    }
  };
  return (
    <div className="container">
      <Navbar />
      <div className="dashboard-container">
        {showEdit ? (
          <Edit
            section={showEdit}
            jobId={editingJobId}
            onCancel={() => { setShowEdit(null); setEditingJobId(null); }}
            onJobAdded={fetchJobs}
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
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="cards">
                {sections.map((section) => {
                  const filtered = jobs.filter((job) => job.status === section);
                  return (
                    <Droppable droppableId={section} key={section}>
                      {(provided) => (
                        <div
                          key={section}
                          className="section-column"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
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

                          {filtered.map((job, index) => (
                            <Draggable
                              key={job.id}
                              draggableId={job.id}
                              index={index}
                            >
                              {(provided) => (
                                <Card
                                  job={job}
                                  resumeText={job.resumeText || profileResumeText}
                                  onClick={() => handleCardClick(job)}
                                  onDeleted={(id) => setJobs((prev) => prev.filter((j) => j.id !== id))}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                />
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          <div
                            className="add"
                            onClick={() => handleEdit(section)}
                          >
                            <FaPlus className="plus-btn" />
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            </DragDropContext>
          </>
        )}

  {/* Modal disabled in favor of direct edit navigation */}
      </div>
    </div>
  );
}

export default Dashboard;
