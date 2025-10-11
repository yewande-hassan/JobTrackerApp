import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";
import { db } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { FaPlus, FaTimes } from "react-icons/fa";

function Profile() {
  const { currentUser } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Connor Jason",
    email: "Connorjason@gmail.com",
    phone: "+234 8823 4444 123",
    dateOfBirth: "",
    gender: "",
    location: "Lagos, Nigeria",
    linkedin: "Http://linkedin/connorjason",
    website: "http://connorjason",
    professionalSummary: "",
    skills: [
      { name: "JavaScript", level: "Expert" },
      { name: "Problem-solving", level: "Intermediate" },
      { name: "Python", level: "Intermediate" },
      { name: "CSS", level: "Expert" }
    ],
    workExperience: [
      {
        title: "Frontend Developer",
        company: "Interswitch",
        period: "Jan 2022 - Present",
        location: "Lagos, Nigeria",
        responsibilities: [
          "Developed and maintained user-facing features using React.js.",
          "Collaborated with designers to implement responsive UI/UX designs.",
          "Build new feature that helps enhance the product and boost users activities in the website"
        ]
      }
    ],
    education: [
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Lagos",
        period: "Sept 2018 - June 2022"
      }
    ],
    certifications: [
      {
        name: "Certified Scrum Master",
        issuer: "Scrum Alliance",
        date: "May 2023"
      }
    ],
    projects: [
      {
        name: "Portfolio Website",
        description: "A personal website showcasing my projects and skills.",
        technologies: "HTML, CSS, JavaScript",
        link: "#"
      }
    ],
    languages: [
      { name: "English", level: "Native" },
      { name: "French", level: "Basic" }
    ]
  });

  // Load profile data from Firestore
  useEffect(() => {
    async function fetchProfile() {
      if (!currentUser) return;
      const userRef = doc(db, "users", currentUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        setProfileData(prev => ({ ...prev, ...data }));
      }
    }
    fetchProfile();
  }, [currentUser]);

  // Handle resume file upload
  async function handleSyncResume() {
    if (!resumeFile || !currentUser) return;
    setSyncing(true);
    try {
      const text = await resumeFile.text();
      // Save to Firestore user profile
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { resumeText: text }, { merge: true });
      alert("Resume synced to profile!");
    } catch (error) {
      console.error("Failed to sync resume:", error);
      alert("Failed to sync resume.");
    }
    setSyncing(false);
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = () => {
    const skillName = prompt("Enter skill name:");
    const skillLevel = prompt("Enter skill level (Beginner/Intermediate/Expert):");
    if (skillName && skillLevel) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName, level: skillLevel }]
      }));
    }
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const saveProfile = async () => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, profileData, { merge: true });
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Failed to save profile.");
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header">
          <div className="profile-header-content">
            <h1 className="profile-title">My Profile</h1>
            <p className="profile-subtitle">
              Manage your personal details, preferences, and job search settings all in one place.
            </p>
          </div>
          <button className="save-profile-btn" onClick={saveProfile}>
            Save Profile
          </button>
        </div>

        {/* Profile Photo and Resume Section */}
        <div className="profile-main-section">
          {/* Profile Photo Section */}
          <div className="profile-photo-card">
            <div className="profile-photo">
              {/* This could be an img tag if you have a photo URL */}
              <div className="default-avatar">
                <span className="avatar-initials">
                  {profileData.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            </div>
            <h3 className="profile-name">{profileData.fullName}</h3>
            <button className="change-photo-btn">Change Photo</button>
          </div>
          
          {/* Resume Section */}
          <div className="resume-card">
            <div className="resume-card-content">
              <h4 className="resume-title">Resume</h4>
              <div className="resume-upload">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={e => setResumeFile(e.target.files[0])}
                  id="resume-upload"
                  style={{ display: 'none' }}
                />
                <label htmlFor="resume-upload" className="file-upload-btn">
                  Choose File
                </label>
                <span className="file-status">
                  {resumeFile ? resumeFile.name : "No file choosen"}
                </span>
              </div>
              <p className="resume-description">
                Upload your resume (PDF/DOC) with size not more than 2.00MB, to automatically fill in your profile.
              </p>
            </div>
            <button
              className="sync-resume-btn"
              onClick={handleSyncResume}
              disabled={!resumeFile || syncing}
            >
              {syncing ? "Syncing..." : "Sync Resume"}
            </button>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="profile-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full name</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="form-input"
                placeholder="Connor Jason"
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="form-input"
                placeholder="Connorjason@gmail.com"
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="form-input"
                placeholder="+234 8823 4444 123"
              />
            </div>
            <div className="form-group">
              <label>Date of Birth (Optional)</label>
              <input
                type="text"
                placeholder="DD/MM/YY"
                value={profileData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="form-input"
                onFocus={(e) => (e.target.type = 'date')}
                onBlur={(e) => (e.target.type = 'text')}
              />
            </div>
            <div className="form-group">
              <label>Gender (Optional)</label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="form-input"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location (City, State, Country)</label>
              <input
                type="text"
                value={profileData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="form-input"
                placeholder="Lagos, Nigeria"
              />
            </div>
            <div className="form-group">
              <label>LinkedIn Profile</label>
              <input
                type="url"
                value={profileData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="form-input"
                placeholder="Http://linkedin/connorjason"
              />
            </div>
            <div className="form-group">
              <label>Personal Website/Portfolio</label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="form-input"
                placeholder="http://connorjason"
              />
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="profile-section">
          <h3 className="section-title">Professional Summary</h3>
          <textarea
            value={profileData.professionalSummary}
            onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
            placeholder="Write a short bio about your career goals and strengths...."
            className="summary-textarea"
          />
        </div>

        {/* Skills Section */}
        <div className="profile-section">
          <h3 className="section-title">Skills</h3>
          <div className="skills-grid">
            {profileData.skills.map((skill, index) => (
              <div key={index} className="skill-item">
                <div>
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-level">{skill.level}</span>
                </div>
                <button 
                  className="remove-skill-btn"
                  onClick={() => removeSkill(index)}
                >
                  <FaTimes />
                </button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={addSkill}>
            <FaPlus /> Add new skill
          </button>
        </div>

        {/* Work Experience Section */}
        <div className="profile-section">
          <h3 className="section-title">Work Experience</h3>
          {profileData.workExperience.map((exp, index) => (
            <div key={index} className="experience-item">
              <h4 className="experience-title">{exp.title}</h4>
              <p className="experience-company">{exp.company}</p>
              <p className="experience-period">{exp.period} | {exp.location}</p>
              <ul className="experience-responsibilities">
                {exp.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
          <button className="add-btn">
            <FaPlus /> Add Work Experience
          </button>
        </div>

        {/* Education Section */}
        <div className="profile-section">
          <h3 className="section-title">Education</h3>
          {profileData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <h4 className="education-degree">{edu.degree}</h4>
              <p className="education-institution">{edu.institution}</p>
              <p className="education-period">{edu.period}</p>
            </div>
          ))}
          <button className="add-btn">
            <FaPlus /> Add Education
          </button>
        </div>

        {/* Certifications Section */}
        <div className="profile-section">
          <h3 className="section-title">Certifications</h3>
          {profileData.certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              <h4 className="certification-name">{cert.name}</h4>
              <p className="certification-issuer">{cert.issuer}</p>
              <p className="certification-date">Date Obtained: {cert.date}</p>
            </div>
          ))}
          <button className="add-btn">
            <FaPlus /> Add Certification
          </button>
        </div>

        {/* Projects Section */}
        <div className="profile-section">
          <h3 className="section-title">Projects</h3>
          {profileData.projects.map((project, index) => (
            <div key={index} className="project-item">
              <h4 className="project-name">{project.name}</h4>
              <p className="project-description">{project.description}</p>
              <p className="project-technologies">Technologies Used: {project.technologies}</p>
              <a href={project.link} className="project-link">View Project</a>
            </div>
          ))}
          <button className="add-btn">
            <FaPlus /> Add Project
          </button>
        </div>

        {/* Languages Section */}
        <div className="profile-section">
          <h3 className="section-title">Languages</h3>
          {profileData.languages.map((lang, index) => (
            <div key={index} className="language-item">
              <span className="language-name">{lang.name}</span>
              <span className="language-level">- {lang.level}</span>
            </div>
          ))}
          <button className="add-btn">
            <FaPlus /> Add Language
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
