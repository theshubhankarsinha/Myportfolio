import { TrendingUp, Settings, Users, Code } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import ParticleBackground from './ParticleBackground';

export default function SkillsSection() {
  const skillCategories = [
    {
      icon: TrendingUp,
      title: "Strategy & Product Sense",
      description: "This is the \"sheet music\"—the 'what' and 'why'.",
      skills: [
        "Product Lifecycle Management",
        "Go-to-Market (GTM) Strategy",
        "AI for Business Integration",
        "User & Market Research",
        "Financial Modeling",
        "Competitive Analysis",
        "Strategic Roadmapping",
        "OKR Framework",
        "Business Case Development",
        "KPI Definition & Tracking"
      ]
    },
    {
      icon: Settings,
      title: "Operations & Execution",
      description: "This is the \"rhythm section\"—the 'how' and 'when'.",
      skills: [
        "Program & Project Management",
        "Process Optimization (Lean Six Sigma)",
        "Supply Chain & Logistics",
        "Risk Identification & Mitigation",
        "Agile & Scrum Methodologies",
        "Budgeting & Resource Planning",
        "Change Management",
        "Quality Assurance (QA) Processes",
        "Continuous Improvement (Kaizen)"
      ]
    },
    {
      icon: Users,
      title: "Leadership & Collaboration",
      description: "This is the \"baton\"—how I unite the orchestra.",
      skills: [
        "Cross-Functional Leadership",
        "Stakeholder Management & Alignment",
        "Pitching, Storytelling & Buy-In",
        "Vendor & Supplier Management",
        "Team Building & Mentorship",
        "Workshop Facilitation",
        "Conflict Resolution",
        "Executive Presentations",
        "Negotiation & Influence"
      ]
    },
    {
      icon: Code,
      title: "The Data & Digital Toolkit",
      description: "These are the \"instruments\" I play myself.",
      skills: [
        "Data Analysis: SQL, Power BI, MS Excel",
        "Business: Statistics, Corporate Finance",
        "Prototyping: Bolt, Netlify, Figma",
        "Engineering: CATIA, SolidWorks",
        "PM Tools: Jira, Notion, Confluence, Asana, A/B Testing"
      ]
    }
  ];

  return (
    <section id="skills" className="relative w-full bg-[#0A0A0A] py-24 md:py-32 overflow-hidden">
      <ParticleBackground opacity={0.3} particleCount={50} />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <AnimatedSection animation="scale-up" threshold={0.3}>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-[#00A9FF] via-white to-[#FF7A59] bg-clip-text text-transparent">
                Shubhankar's Toolkit
              </span>
            </h2>
            <p className="text-lg md:text-xl text-[#B0B0B0] max-w-4xl mx-auto leading-relaxed">
              I don't just use tools; I orchestrate systems. My skills are grouped by the functions I perform:
              setting the strategy, running the operation, and leading the people.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <AnimatedSection
                key={index}
                animation="fade-up"
                delay={index * 150}
                threshold={0.2}
              >
                <div className="group relative h-full bg-[#1A1A1A] rounded-2xl p-8 transition-all duration-500 hover:bg-[#222222] hover:scale-105 hover:shadow-[0_0_30px_rgba(0,169,255,0.2)] border border-[#2A2A2A] hover:border-[#00A9FF]/30">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00A9FF]/5 via-transparent to-[#FF7A59]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-[#00A9FF] to-[#FF7A59] shadow-lg group-hover:shadow-[0_0_20px_rgba(0,169,255,0.5)] transition-shadow duration-300">
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl md:text-2xl font-bold text-[#00A9FF] mb-3 leading-tight">
                      {category.title}
                    </h3>

                    <p className="text-sm md:text-base text-[#808080] italic mb-6 leading-relaxed">
                      {category.description}
                    </p>

                    <ul className="space-y-3">
                      {category.skills.map((skill, skillIndex) => (
                        <li
                          key={skillIndex}
                          className="flex items-start text-[#E0E0E0] text-sm md:text-base leading-relaxed transition-colors duration-200 hover:text-white"
                        >
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF7A59] mt-2 mr-3 flex-shrink-0" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
