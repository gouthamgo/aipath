import { Section, SectionHeader, Card } from "./shared";
import { curriculum, getTotalLessons, getTotalProjects } from "../../learning/data/curriculum";
import { CheckCircle2 } from "lucide-react";

const colorStyles: Record<string, { badge: string; border: string; text: string; bg: string }> = {
  emerald: {
    badge: "bg-emerald-500 text-white",
    border: "border-l-emerald-500",
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  violet: {
    badge: "bg-violet-500 text-white",
    border: "border-l-violet-500",
    text: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  amber: {
    badge: "bg-amber-500 text-zinc-900",
    border: "border-l-amber-500",
    text: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  cyan: {
    badge: "bg-cyan-500 text-white",
    border: "border-l-cyan-500",
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  rose: {
    badge: "bg-rose-500 text-white",
    border: "border-l-rose-500",
    text: "text-rose-400",
    bg: "bg-rose-500/10",
  },
};

export default function Curriculum() {
  const totalLessons = getTotalLessons();
  const totalProjects = getTotalProjects();

  return (
    <Section id="curriculum" size="full">
      <SectionHeader
        badge="Learning Path"
        badgeColor="amber"
        title={
          <>
            From zero to <span className="text-gradient">AI Engineer</span>
          </>
        }
        subtitle={`${totalProjects} projects, ${totalLessons}+ lessons, and 50+ hours of hands-on learning. Complete the path and be job-ready.`}
      />

      {/* Build Progress Banner */}
      <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <div>
              <span className="text-white font-semibold">100% Content Complete</span>
              <span className="text-zinc-400 ml-2">All {totalLessons} lessons with full content</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
              <span className="text-zinc-400">{curriculum.length} Phases</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-violet-400"></div>
              <span className="text-zinc-400">{totalProjects} Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
              <span className="text-zinc-400">{totalLessons} Lessons</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {curriculum.map((phase, i) => {
          const styles = colorStyles[phase.color];
          const phaseLessons = phase.projects.reduce((acc, p) => acc + p.lessons.length, 0);

          return (
            <Card
              key={i}
              className={`border-l-4 ${styles.border} p-6 sm:p-8`}
              hover={true}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                {/* Phase Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${styles.badge}`}>
                      Phase {phase.phase}
                    </span>
                    {phase.isFree && (
                      <span className="badge-free">Free</span>
                    )}
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                      <CheckCircle2 className="w-3 h-3" />
                      Complete
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {phase.title}
                  </h3>
                  <p className="text-zinc-400 mb-6">
                    {phase.description}
                  </p>

                  {/* Projects Grid */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {phase.projects.map((project, j) => (
                      <div
                        key={j}
                        className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all"
                      >
                        <div className="text-white font-medium text-sm mb-1">
                          {project.title}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className={`text-sm ${styles.text}`}>
                            {project.lessons.length} lessons
                          </div>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            project.difficulty === 'beginner' ? 'bg-emerald-500/10 text-emerald-400' :
                            project.difficulty === 'intermediate' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-rose-500/10 text-rose-400'
                          }`}>
                            {project.difficulty}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lesson Count */}
                <div className="text-center lg:text-right lg:pl-8 lg:border-l lg:border-white/5">
                  <div className="text-4xl sm:text-5xl font-bold text-gradient">
                    {phaseLessons}
                  </div>
                  <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                    Lessons
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-12 text-center">
        <p className="text-zinc-500">
          <span className="text-emerald-400 font-medium">Phase 1 is completely free</span>
          {" "}— start learning today with no commitment
        </p>
      </div>
    </Section>
  );
}
