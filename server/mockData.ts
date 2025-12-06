// TypeScript interfaces for resume data structure

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  technologies: string[];
  url?: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary?: string;
  experience: ExperienceItem[];
  projects?: ProjectItem[];
  education?: EducationItem[];
  skills?: string[];
}

// Mock resume data for testing and demonstration
export const mockResumeData: ResumeData = {
  personalInfo: {
    name: "Jane Developer",
    title: "Senior Full-Stack Engineer",
    email: "jane.developer@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/janedeveloper",
    github: "github.com/janedeveloper",
    website: "janedeveloper.com"
  },
  summary: "Experienced full-stack engineer with 8+ years of expertise in building scalable web applications. Proficient in modern JavaScript frameworks, cloud architecture, and agile methodologies. Passionate about clean code, performance optimization, and mentoring junior developers.",
  experience: [
    {
      company: "Tech Innovations Inc.",
      position: "Senior Full-Stack Engineer",
      location: "San Francisco, CA",
      startDate: "Jan 2021",
      endDate: "Present",
      responsibilities: [
        "Led development of microservices architecture serving 2M+ daily active users",
        "Reduced API response times by 40% through optimization and caching strategies",
        "Mentored team of 5 junior developers, conducting code reviews and technical training",
        "Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60%"
      ]
    },
    {
      company: "StartupXYZ",
      position: "Full-Stack Developer",
      location: "Remote",
      startDate: "Mar 2018",
      endDate: "Dec 2020",
      responsibilities: [
        "Built responsive web applications using React, Node.js, and PostgreSQL",
        "Designed and implemented RESTful APIs handling 100K+ requests per day",
        "Collaborated with product team to define features and technical requirements",
        "Improved test coverage from 45% to 85% through comprehensive unit and integration tests"
      ]
    },
    {
      company: "Digital Solutions Corp",
      position: "Junior Developer",
      location: "New York, NY",
      startDate: "Jun 2016",
      endDate: "Feb 2018",
      responsibilities: [
        "Developed client-facing features using JavaScript, HTML5, and CSS3",
        "Participated in agile ceremonies including daily standups and sprint planning",
        "Fixed bugs and implemented enhancements based on user feedback",
        "Contributed to technical documentation and knowledge base articles"
      ]
    }
  ],
  projects: [
    {
      name: "DevCVServer",
      description: "Microservice for generating high-quality PDF resumes using Playwright and React templates",
      technologies: ["TypeScript", "Node.js", "Playwright", "React", "Express"],
      url: "github.com/janedeveloper/devcvserver"
    },
    {
      name: "Task Management Platform",
      description: "Real-time collaborative task management application with WebSocket support",
      technologies: ["React", "Socket.io", "MongoDB", "Docker", "Redis"],
      url: "taskplatform.demo.com"
    },
    {
      name: "E-commerce Analytics Dashboard",
      description: "Analytics dashboard for tracking sales metrics and customer behavior insights",
      technologies: ["Vue.js", "D3.js", "Python", "FastAPI", "PostgreSQL"]
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2012",
      endDate: "2016",
      gpa: "3.8"
    }
  ],
  skills: [
    "JavaScript/TypeScript",
    "React",
    "Node.js",
    "Express",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "Kubernetes",
    "AWS",
    "Git",
    "CI/CD",
    "REST APIs",
    "GraphQL",
    "Agile/Scrum"
  ]
};
