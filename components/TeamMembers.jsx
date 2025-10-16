'use client';
import React, { useState, useEffect } from 'react';

const TeamMembers = () => {
  const [loading, setLoading] = useState(true);
  
  const teamMembers = [
    {
      id: 1,
      name: "Ana Rosa Ramirez Lopez",
      role: "Analista de datos",
      description: "Especialista en React y Next.js con 5 años de experiencia en desarrollo de interfaces modernas y responsivas.",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      github: "https://github.com/AnaRamirez60"
    },
    {
      id: 2,
      name: "Carlos Rafael Fabian Jimenez",
      role: "Backend Developer",
      description: "Derrollador versátil con experiencia en desarrollo de APIs y arquitectura de servidores con Node.js y bases de datos.",
      skills: ["Node.js", "Next.js", "Prisma", "PostgreSQL", "Python", "Oracle", "Sql"],
      github: "https://github.com/ElmarcianitoGtR"
    },
    {
      id: 3,
      name: "Gerardo Jimenez Rodriguez",
      role: "Diseñador de arquitectura IoT",
      description: "Desarrolladora versátil con experiencia tanto en frontend como backend y DevOps.",
      skills: ["Fritzing", "Arduino", "Hardware", "Sensores", "Modulos IoT"],
      github: "https://github.com/GeraMonster"
    },
    {
      id: 4,
      name: "Kay Garcia Sanchez",
      role: "Cientifica de datos",
      description: "Combina habilidades de diseño con desarrollo frontend para crear experiencias excepcionales.",
      skills: ["Figma", "React", "CSS", "UI/UX"],
      github: "https://github.com/Kayychuw"
    },
    {
      id: 5,
      name: "Cristofer Brandon Martinez Guadarrama",
      role: "Frontend Developer",
      description: "Soltero, carismatico con carro",
      skills: ["Canva", "Html", "Figma", "CSS"],
      github: "https://github.com/laurafernandez"
    }
  ];

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Consultando modelo de temperatura...</p>
          <p className="text-gray-500 text-sm">Conectando con la API en http://127.0.0.1:5000</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-50 mb-4">
            Equipo de Desarrollo
          </h1>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group hover:transform hover:-translate-y-1"
            >
              {/* Member Image/Initials */}
              <div className="relative h-48 bg-gradient-to-br from-blue-50/50 to-indigo-100">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {member.description}
                </p>

                {/* Skills */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">
                    Habilidades:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 pt-4 border-t border-gray-100">
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-700 transition-colors duration-200"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;