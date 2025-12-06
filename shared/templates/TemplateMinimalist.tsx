import React from 'react';
import type { ResumeData } from '../types';
import { getTemplateConfig } from '../templateConfigs';

export interface TemplateProps {
  resumeData: ResumeData;
  mode?: 'client' | 'server';
  fontFamily?: string;
}

export const TemplateMinimalist: React.FC<TemplateProps> = ({ 
  resumeData, 
  mode = 'client',
  fontFamily 
}) => {
  const { personalInfo, summary, experience, projects, education, skills } = resumeData;
  const templateConfig = getTemplateConfig('minimalist');
  const effectiveFontFamily = fontFamily || templateConfig.fontFamily;

  const styles = `
    ${mode === 'server' ? `
      @page {
        size: A4;
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: ${effectiveFontFamily};
        font-size: 11pt;
        line-height: 1.5;
        color: #222;
        background: white;
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 18mm;
      }
    ` : `
      .resume-preview {
        font-family: ${effectiveFontFamily};
        font-size: 11pt;
        line-height: 1.5;
        color: #222;
        background: white;
        width: 210mm;
        min-height: 297mm;
        padding: 15mm 18mm;
        margin: 0;
        box-sizing: border-box;
      }

      @page {
        size: A4;
        margin: 0;
      }
    `}

    ${mode === 'server' ? '.header' : '.resume-preview .header'} {
      margin-bottom: 20px;
      border-bottom: 2px solid #222;
      padding-bottom: 12px;
    }

    ${mode === 'server' ? '.name' : '.resume-preview .name'} {
      font-size: 28pt;
      font-weight: 700;
      color: #000;
      margin-bottom: 4px;
      letter-spacing: -0.5px;
    }

    ${mode === 'server' ? '.title' : '.resume-preview .title'} {
      font-size: 13pt;
      color: #555;
      margin-bottom: 10px;
      font-weight: 400;
    }

    ${mode === 'server' ? '.contact' : '.resume-preview .contact'} {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 9.5pt;
      color: #444;
    }

    ${mode === 'server' ? '.contact-item' : '.resume-preview .contact-item'} {
      display: flex;
      align-items: center;
    }

    ${mode === 'server' ? '.section' : '.resume-preview .section'} {
      margin-bottom: 18px;
      page-break-inside: avoid;
    }

    ${mode === 'server' ? '.section-title' : '.resume-preview .section-title'} {
      font-size: 14pt;
      font-weight: 700;
      color: #000;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid #ddd;
      padding-bottom: 4px;
    }

    ${mode === 'server' ? '.summary' : '.resume-preview .summary'} {
      font-size: 10.5pt;
      line-height: 1.6;
      color: #333;
      text-align: justify;
    }

    ${mode === 'server' ? '.experience-item, .project-item, .education-item' : '.resume-preview .experience-item, .resume-preview .project-item, .resume-preview .education-item'} {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }

    ${mode === 'server' ? '.experience-header, .project-header, .education-header' : '.resume-preview .experience-header, .resume-preview .project-header, .resume-preview .education-header'} {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 4px;
    }

    ${mode === 'server' ? '.company, .project-name, .institution' : '.resume-preview .company, .resume-preview .project-name, .resume-preview .institution'} {
      font-size: 12pt;
      font-weight: 700;
      color: #000;
    }

    ${mode === 'server' ? '.position, .degree' : '.resume-preview .position, .resume-preview .degree'} {
      font-size: 11pt;
      font-weight: 600;
      color: #333;
      margin-bottom: 2px;
    }

    ${mode === 'server' ? '.location, .date-range, .field' : '.resume-preview .location, .resume-preview .date-range, .resume-preview .field'} {
      font-size: 9.5pt;
      color: #666;
      font-style: italic;
    }

    ${mode === 'server' ? '.responsibilities' : '.resume-preview .responsibilities'} {
      list-style-position: outside;
      margin-left: 18px;
      margin-top: 6px;
    }

    ${mode === 'server' ? '.responsibilities li' : '.resume-preview .responsibilities li'} {
      margin-bottom: 4px;
      font-size: 10pt;
      color: #333;
      line-height: 1.5;
    }

    ${mode === 'server' ? '.project-description' : '.resume-preview .project-description'} {
      font-size: 10pt;
      color: #333;
      margin-top: 4px;
      line-height: 1.5;
    }

    ${mode === 'server' ? '.technologies' : '.resume-preview .technologies'} {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }

    ${mode === 'server' ? '.tech-tag' : '.resume-preview .tech-tag'} {
      background: #f0f0f0;
      padding: 3px 8px;
      border-radius: 3px;
      font-size: 9pt;
      color: #444;
      font-weight: 500;
    }

    ${mode === 'server' ? '.skills-list' : '.resume-preview .skills-list'} {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 8px;
    }

    ${mode === 'server' ? '.skill-item' : '.resume-preview .skill-item'} {
      background: #f5f5f5;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 9.5pt;
      color: #333;
      font-weight: 500;
    }

    ${mode === 'server' ? '.url' : '.resume-preview .url'} {
      font-size: 9pt;
      color: #0066cc;
      margin-top: 3px;
      font-style: italic;
    }

    @media print {
      ${mode === 'server' ? 'body' : '.resume-preview'} {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
        ${mode === 'client' ? 'box-shadow: none;' : ''}
      }
    }
  `;

  const content = (
    <>
      {/* Header Section */}
      <div className="header">
        <h1 className="name">{personalInfo.name}</h1>
        <div className="title">{personalInfo.title}</div>
        <div className="contact">
          <span className="contact-item">{personalInfo.email}</span>
          <span className="contact-item">{personalInfo.phone}</span>
          <span className="contact-item">{personalInfo.location}</span>
          {personalInfo.linkedin && (
            <span className="contact-item">{personalInfo.linkedin}</span>
          )}
          {personalInfo.github && (
            <span className="contact-item">{personalInfo.github}</span>
          )}
          {personalInfo.website && (
            <span className="contact-item">{personalInfo.website}</span>
          )}
        </div>
      </div>

      {/* Summary Section */}
      {summary && (
        <div className="section">
          <h2 className="section-title">Professional Summary</h2>
          <p className="summary">{summary}</p>
        </div>
      )}

      {/* Experience Section */}
      {experience && experience.length > 0 && (
        <div className="section">
          <h2 className="section-title">Professional Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <div>
                  <div className="company">{exp.company}</div>
                  <div className="position">{exp.position}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="date-range">
                    {exp.startDate} - {exp.endDate}
                  </div>
                  <div className="location">{exp.location}</div>
                </div>
              </div>
              <ul className="responsibilities">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx}>{resp}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {projects && projects.length > 0 && (
        <div className="section">
          <h2 className="section-title">Notable Projects</h2>
          {projects.map((project, index) => (
            <div key={index} className="project-item">
              <div className="project-name">{project.name}</div>
              <p className="project-description">{project.description}</p>
              {project.url && <div className="url">{project.url}</div>}
              <div className="technologies">
                {project.technologies.map((tech, idx) => (
                  <span key={idx} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {education && education.length > 0 && (
        <div className="section">
          <h2 className="section-title">Education</h2>
          {education.map((edu, index) => (
            <div key={index} className="education-item">
              <div className="education-header">
                <div>
                  <div className="institution">{edu.institution}</div>
                  <div className="degree">
                    {edu.degree} in {edu.field}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="date-range">
                    {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.gpa && <div className="field">GPA: {edu.gpa}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {skills && skills.length > 0 && (
        <div className="section">
          <h2 className="section-title">Technical Skills</h2>
          <div className="skills-list">
            {skills.map((skill, index) => (
              <span key={index} className="skill-item">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </>
  );

  if (mode === 'server') {
    return (
      <html>
        <head>
          <meta charSet="UTF-8" />
          {templateConfig.googleFontsUrl && (
            <>
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              <link href={templateConfig.googleFontsUrl} rel="stylesheet" />
            </>
          )}
          <style>{styles}</style>
        </head>
        <body>{content}</body>
      </html>
    );
  }

  return (
    <div className="bg-white w-full h-full overflow-auto">
      <style>{styles}</style>
      <div className="resume-preview">{content}</div>
    </div>
  );
};
