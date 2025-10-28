import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "../styles/Profile.css";
import { db, onSnapshot } from "../services/firebase";
import { uploadFiles } from "../services/uploadFiles";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { parseResumeToProfile } from "../services/resumeServices";
import { addNotification } from "../services/notificationsService";
import { extractTextFromFile } from "../services/textExtract";
import { FaPlus, FaTimes } from "react-icons/fa";

function Profile() {
  const { currentUser } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    location: "",
    linkedin: "",
    website: "",
    professionalSummary: "",
    // resume-related persisted fields
    resumeUrl: "",
    resumeFileName: "",
    resumeUpdatedAt: "",
    resumeText: "",
    skills: [],
    workExperience: [],
    education: [],
    certifications: [],
    projects: [],
    languages: []
  });

  // Inline add-form states
  const [newSkill, setNewSkill] = useState({ name: "", level: "Beginner" });
  const [newExp, setNewExp] = useState({ title: "", company: "", period: "", location: "", responsibilitiesText: "" });
  const [newEdu, setNewEdu] = useState({ degree: "", institution: "", period: "" });
  const [newCert, setNewCert] = useState({ name: "", issuer: "", date: "" });
  const [newProject, setNewProject] = useState({ name: "", description: "", technologies: "", link: "" });
  const [newLang, setNewLang] = useState({ name: "", level: "Basic" });

  // Load and subscribe to profile data from Firestore
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userRef = doc(db, "users", currentUser.uid);
    let unsub = () => {};
    (async () => {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        setProfileData(prev => ({ ...prev, ...snap.data() }));
      } else {
        setProfileData(prev => ({
          ...prev,
          fullName: currentUser.displayName || "",
          email: currentUser.email || "",
        }));
      }
      // Subscribe for live updates
      unsub = onSnapshot(userRef, (s) => {
        const data = s.data();
        if (data) setProfileData(prev => ({ ...prev, ...data }));
      });
    })();
    return () => unsub();
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email]);

  // Helper to persist partial changes
  const savePartial = async (partial) => {
    if (!currentUser?.uid) return;
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, partial, { merge: true });
  };

  // Handle resume file upload
  async function handleSyncResume() {
    if (!resumeFile || !currentUser) return;
    setSyncing(true);
    try {
      // 1) Upload file to Storage
      const resumeUrl = await uploadFiles(resumeFile, "resumes");
  // 2) Extract clean text from file (PDF/DOCX supported)
  const text = await extractTextFromFile(resumeFile);
  const nowIso = new Date().toISOString();
  // If extraction failed, keep previous resumeText instead of overwriting with empty
  const safeText = text && text.trim() ? text : (profileData.resumeText || "");
  // Parse resume into profile sections (may be shallow with empty)
  const parsed = await parseResumeToProfile(safeText);
      const userRef = doc(db, "users", currentUser.uid);
      // 3) Save metadata + text + parsed sections to Firestore
      await setDoc(
        userRef,
        {
          resumeUrl: resumeUrl || "",
          resumeFileName: resumeFile.name,
          resumeUpdatedAt: nowIso,
          resumeText: safeText,
          // Merge parsed structured fields
          ...parsed,
        },
        { merge: true }
      );
      // 4) Reflect in local state so it persists in UI after reload
      setProfileData((prev) => ({
        ...prev,
        resumeUrl: resumeUrl || "",
        resumeFileName: resumeFile.name,
        resumeUpdatedAt: nowIso,
  resumeText: safeText,
        ...parsed,
      }));
      try {
        await addNotification(currentUser, {
          title: "Resume synced",
          body: "Your resume was synced and profile sections updated."
        });
      } catch { /* ignore */ }
      alert("Resume synced to profile!");
    } catch (error) {
      console.error("Failed to sync resume:", error);
      alert("Failed to sync resume.");
    }
    setSyncing(false);
  }

  // Handle photo change (local preview only)
  function handlePhotoChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSkill = async () => {
    if (!newSkill.name) return;
    setProfileData(prev => {
      const updated = [...prev.skills, newSkill];
      savePartial({ skills: updated });
      return { ...prev, skills: updated };
    });
    setNewSkill({ name: "", level: "Beginner" });
  };

  const removeSkill = (index) => {
    setProfileData(prev => {
      const updated = prev.skills.filter((_, i) => i !== index);
      savePartial({ skills: updated });
      return { ...prev, skills: updated };
    });
  };

  // Experience
  const addExperience = () => {
    if (!newExp.title || !newExp.company) return;
    const responsibilities = newExp.responsibilitiesText
      ? newExp.responsibilitiesText.split("\n").map(s => s.trim()).filter(Boolean)
      : [];
    const item = { title: newExp.title, company: newExp.company, period: newExp.period, location: newExp.location, responsibilities };
    setProfileData(prev => {
      const updated = [...prev.workExperience, item];
      savePartial({ workExperience: updated });
      return { ...prev, workExperience: updated };
    });
    setNewExp({ title: "", company: "", period: "", location: "", responsibilitiesText: "" });
  };
  const removeExperience = (index) => {
    setProfileData(prev => {
      const updated = prev.workExperience.filter((_, i) => i !== index);
      savePartial({ workExperience: updated });
      return { ...prev, workExperience: updated };
    });
  };

  // Education
  const addEducation = () => {
    if (!newEdu.degree || !newEdu.institution) return;
    setProfileData(prev => {
      const updated = [...prev.education, newEdu];
      savePartial({ education: updated });
      return { ...prev, education: updated };
    });
    setNewEdu({ degree: "", institution: "", period: "" });
  };
  const removeEducation = (index) => {
    setProfileData(prev => {
      const updated = prev.education.filter((_, i) => i !== index);
      savePartial({ education: updated });
      return { ...prev, education: updated };
    });
  };

  // Certifications
  const addCertification = () => {
    if (!newCert.name) return;
    setProfileData(prev => {
      const updated = [...prev.certifications, newCert];
      savePartial({ certifications: updated });
      return { ...prev, certifications: updated };
    });
    setNewCert({ name: "", issuer: "", date: "" });
  };
  const removeCertification = (index) => {
    setProfileData(prev => {
      const updated = prev.certifications.filter((_, i) => i !== index);
      savePartial({ certifications: updated });
      return { ...prev, certifications: updated };
    });
  };

  // Projects
  const addProject = () => {
    if (!newProject.name) return;
    setProfileData(prev => {
      const updated = [...prev.projects, newProject];
      savePartial({ projects: updated });
      return { ...prev, projects: updated };
    });
    setNewProject({ name: "", description: "", technologies: "", link: "" });
  };
  const removeProject = (index) => {
    setProfileData(prev => {
      const updated = prev.projects.filter((_, i) => i !== index);
      savePartial({ projects: updated });
      return { ...prev, projects: updated };
    });
  };

  // Languages
  const addLanguage = () => {
    if (!newLang.name) return;
    setProfileData(prev => {
      const updated = [...prev.languages, newLang];
      savePartial({ languages: updated });
      return { ...prev, languages: updated };
    });
    setNewLang({ name: "", level: "Basic" });
  };
  const removeLanguage = (index) => {
    setProfileData(prev => {
      const updated = prev.languages.filter((_, i) => i !== index);
      savePartial({ languages: updated });
      return { ...prev, languages: updated };
    });
  };

  const getInitials = (name, email) => {
    const cleaned = (name || "").trim();
    if (cleaned.length) {
      const parts = cleaned.split(/\s+/).slice(0, 2);
      return parts.map(p => p[0]?.toUpperCase() || "").join("") || "?";
    }
    return (email?.[0] || "?").toUpperCase();
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
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
            />
            <div className="profile-photo">
              {(photoPreview || profileData.photoUrl) ? (
                <img src={photoPreview || profileData.photoUrl} alt="Profile" />
              ) : (
                <div className="default-avatar">
                  <span className="avatar-initials">{getInitials(profileData.fullName, profileData.email)}</span>
                </div>
              )}
            </div>
            <h3 className="profile-name">{profileData.fullName}</h3>
            <label htmlFor="photo-upload" className="change-photo-btn">Change Photo</label>
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
                  {resumeFile ? resumeFile.name : (profileData.resumeFileName || "No file chosen")}
                </span>
              </div>
              <p className="resume-description">
                Upload your resume (PDF/DOC) with size not more than 2.00MB, to automatically fill in your profile.
              </p>
              {/* Intentionally hiding last sync/link/preview per request */}
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
          <div className="mini-form">
            <div className="form-row">
              <input className="form-input" placeholder="Skill name" value={newSkill.name} onChange={(e)=>setNewSkill(s=>({...s,name:e.target.value}))} />
              <select className="form-input" value={newSkill.level} onChange={(e)=>setNewSkill(s=>({...s,level:e.target.value}))}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
              <button className="add-btn" onClick={addSkill}><FaPlus /> Add new skill</button>
            </div>
          </div>
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
              <button className="remove-skill-btn" onClick={()=>removeExperience(index)} title="Remove"><FaTimes /></button>
            </div>
          ))}
          <div className="mini-form">
            <div className="form-row">
              <input className="form-input" placeholder="Title" value={newExp.title} onChange={(e)=>setNewExp(s=>({...s,title:e.target.value}))} />
              <input className="form-input" placeholder="Company" value={newExp.company} onChange={(e)=>setNewExp(s=>({...s,company:e.target.value}))} />
            </div>
            <div className="form-row">
              <input className="form-input" placeholder="Period (e.g., Jan 2022 - Present)" value={newExp.period} onChange={(e)=>setNewExp(s=>({...s,period:e.target.value}))} />
              <input className="form-input" placeholder="Location" value={newExp.location} onChange={(e)=>setNewExp(s=>({...s,location:e.target.value}))} />
            </div>
            <div className="form-row">
              <textarea className="summary-textarea" placeholder="Responsibilities - one per line" value={newExp.responsibilitiesText} onChange={(e)=>setNewExp(s=>({...s,responsibilitiesText:e.target.value}))} />
            </div>
            <button className="add-btn" onClick={addExperience}><FaPlus /> Add Work Experience</button>
          </div>
        </div>

        {/* Education Section */}
        <div className="profile-section">
          <h3 className="section-title">Education</h3>
          {profileData.education.map((edu, index) => (
            <div key={index} className="education-item">
              <h4 className="education-degree">{edu.degree}</h4>
              <p className="education-institution">{edu.institution}</p>
              <p className="education-period">{edu.period}</p>
              <button className="remove-skill-btn" onClick={()=>removeEducation(index)} title="Remove"><FaTimes /></button>
            </div>
          ))}
          <div className="mini-form">
            <div className="form-row">
              <input className="form-input" placeholder="Degree" value={newEdu.degree} onChange={(e)=>setNewEdu(s=>({...s,degree:e.target.value}))} />
              <input className="form-input" placeholder="Institution" value={newEdu.institution} onChange={(e)=>setNewEdu(s=>({...s,institution:e.target.value}))} />
            </div>
            <div className="form-row">
              <input className="form-input" placeholder="Period" value={newEdu.period} onChange={(e)=>setNewEdu(s=>({...s,period:e.target.value}))} />
            </div>
            <button className="add-btn" onClick={addEducation}><FaPlus /> Add Education</button>
          </div>
        </div>

        {/* Certifications Section */}
        <div className="profile-section">
          <h3 className="section-title">Certifications</h3>
          {profileData.certifications.map((cert, index) => (
            <div key={index} className="certification-item">
              <h4 className="certification-name">{cert.name}</h4>
              <p className="certification-issuer">{cert.issuer}</p>
              <p className="certification-date">Date Obtained: {cert.date}</p>
              <button className="remove-skill-btn" onClick={()=>removeCertification(index)} title="Remove"><FaTimes /></button>
            </div>
          ))}
          <div className="mini-form">
            <div className="form-row">
              <input className="form-input" placeholder="Certification name" value={newCert.name} onChange={(e)=>setNewCert(s=>({...s,name:e.target.value}))} />
              <input className="form-input" placeholder="Issuer" value={newCert.issuer} onChange={(e)=>setNewCert(s=>({...s,issuer:e.target.value}))} />
            </div>
            <div className="form-row">
              <input className="form-input" placeholder="Date (e.g., May 2023)" value={newCert.date} onChange={(e)=>setNewCert(s=>({...s,date:e.target.value}))} />
            </div>
            <button className="add-btn" onClick={addCertification}><FaPlus /> Add Certification</button>
          </div>
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
              <button className="remove-skill-btn" onClick={()=>removeProject(index)} title="Remove"><FaTimes /></button>
            </div>
          ))}
          <div className="mini-form">
            <div className="form-row">
              <input className="form-input" placeholder="Project name" value={newProject.name} onChange={(e)=>setNewProject(s=>({...s,name:e.target.value}))} />
              <input className="form-input" placeholder="Technologies (comma-separated)" value={newProject.technologies} onChange={(e)=>setNewProject(s=>({...s,technologies:e.target.value}))} />
            </div>
            <div className="form-row">
              <input className="form-input" placeholder="Link" value={newProject.link} onChange={(e)=>setNewProject(s=>({...s,link:e.target.value}))} />
            </div>
            <div className="form-row">
              <textarea className="summary-textarea" placeholder="Short description" value={newProject.description} onChange={(e)=>setNewProject(s=>({...s,description:e.target.value}))} />
            </div>
            <button className="add-btn" onClick={addProject}><FaPlus /> Add Project</button>
          </div>
        </div>

        {/* Languages Section */}
        <div className="profile-section">
          <h3 className="section-title">Languages</h3>
          {profileData.languages.map((lang, index) => (
            <div key={index} className="language-item">
              <span className="language-name">{lang.name}</span>
              <span className="language-level">- {lang.level}</span>
              <button className="remove-skill-btn" onClick={()=>removeLanguage(index)} title="Remove"><FaTimes /></button>
            </div>
          ))}
          <div className="mini-form">
            <div className="form-row">
              <input className="form-input" placeholder="Language" value={newLang.name} onChange={(e)=>setNewLang(s=>({...s,name:e.target.value}))} />
              <select className="form-input" value={newLang.level} onChange={(e)=>setNewLang(s=>({...s,level:e.target.value}))}>
                <option>Basic</option>
                <option>Conversational</option>
                <option>Fluent</option>
                <option>Native</option>
              </select>
              <button className="add-btn" onClick={addLanguage}><FaPlus /> Add Language</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
