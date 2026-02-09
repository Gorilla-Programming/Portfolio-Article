import API_BASE_URL from '../config';
import React from 'react';
import { ExternalLink, Github, Mail, Linkedin, Code, Layers, Smartphone, Database, Terminal, Shield, Briefcase, Download } from 'lucide-react';
import './Home.css';

const Home = () => {
    const skills = [
        { name: "Java / Spring Boot", icon: <Code size={20} /> },
        { name: "Maximo Asset Management", icon: <Database size={20} /> },
        { name: "IBM Maximo Customization", icon: <Terminal size={20} /> },
        { name: "SQL (Db2 / PL/SQL)", icon: <Database size={20} /> },
        { name: "Web Development", icon: <Smartphone size={20} /> },
        { name: "CI/CD & Git", icon: <Shield size={20} /> },
    ];

    const projects = [
        {
            title: "Ministry of Defense (e-MMS)",
            desc: "Electronic Maintenance Management System for the Indian Air Force. One of the largest MRO IT implementations globally, transforming paper-based legacy systems into a robust online platform.",
            tags: ["IBM Maximo", "Java", "Oracle", "EAM"]
        },
        {
            title: "User Detection & Recognition",
            desc: "AI-powered application for identifying individuals in restricted areas and automating attendance tracking using computer vision modules.",
            tags: ["Python", "OpenCV", "Deep Learning"]
        },
        {
            title: "HR Management System",
            desc: "End-to-end recruitment, appraisal, and profile management system designed to streamline the entire employee lifecycle.",
            tags: ["Java", "Spring Boot", "React"]
        }
    ];

    const experience = [
        {
            role: "Associate Consultant",
            company: "Infosys Limited",
            duration: "4 Years",
            desc: "Specialized in IBM Maximo Asset Management. Expert in Database Configuration, Application Designer, Integration Modules, and Java Customization. Delivered high-quality EAM solutions for global clients."
        }
    ];

    return (
        <div className="home-container animate-fade-in">
            <section className="hero">
                <h1 className="hero-title">Ankit <span>Chaudhary</span></h1>
                <h2 className="hero-role">Java Developer & Maximo Specialist</h2>
                <p className="hero-subtitle">
                    I am a self-taught programmer and a dedicated advocate of lifelong learning. With over 4 years of experience,
                    I specialize in developing unique programming solutions and optimizing enterprise asset management systems.
                </p>
                <div className="hero-btns">
                    <a
                        href={`${API_BASE_URL}/uploads/CV/UPDATED_Resume.pdf`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="primary-btn"
                    >
                        Download Resume <Download size={18} />
                    </a>
                    <div className="hero-socials">
                        <a href="mailto:info@ankitchaudhary.com"><Mail size={20} /></a>
                        <a href="https://github.com"><Github size={20} /></a>
                        <a href="https://linkedin.com"><Linkedin size={20} /></a>
                    </div>
                </div>
            </section>

            <section className="experience-section section-padding">
                <h2 className="section-title">Professional Experience</h2>
                <div className="experience-grid">
                    {experience.map((exp, i) => (
                        <div key={i} className="experience-card glass-card">
                            <div className="exp-icon"><Briefcase size={24} /></div>
                            <div className="exp-content">
                                <div className="exp-header">
                                    <h3>{exp.role}</h3>
                                    <span className="exp-company">{exp.company}</span>
                                </div>
                                <span className="exp-duration">{exp.duration}</span>
                                <p>{exp.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="skills-section section-padding">
                <h2 className="section-title">Core Expertise</h2>
                <div className="skills-grid">
                    {skills.map((skill, i) => (
                        <div key={i} className="skill-item glass">
                            {skill.icon}
                            <span>{skill.name}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="projects-section section-padding">
                <h2 className="section-title">Notable Projects</h2>
                <div className="projects-grid">
                    {projects.map((project, i) => (
                        <div key={i} className="project-card glass-card">
                            <h3>{project.title}</h3>
                            <p>{project.desc}</p>
                            <div className="project-tags">
                                {project.tags.map(tag => <span key={tag}>{tag}</span>)}
                            </div>
                            <a href="#" className="project-link">
                                Case Study <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
