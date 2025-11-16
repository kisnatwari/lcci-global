import Link from "next/link";
import { Clock, Users, Laptop2 } from "lucide-react";

export default function CourseTypesSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-sky-600 mb-2">
            Ways to learn
          </p>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 mb-3">
            Choose the learning style that fits you
          </h2>
          <p className="text-sm md:text-base text-slate-600">
            Study with structured, instructor-led cohorts or move at your own pace with
            on-demand content—whichever suits your schedule best.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Guided Courses */}
          <div className="relative rounded-2xl bg-white border border-slate-200 p-7 lg:p-8 shadow-sm overflow-hidden">
            <div className="absolute -top-10 -right-10 h-28 w-28 rounded-3xl bg-sky-100 blur-2xl opacity-70" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <Users className="w-3.5 h-3.5" />
                Guided programmes
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Learn together with expert guidance
              </h3>
              <p className="text-sm text-slate-600">
                Ideal for schools, colleges and organisations that prefer scheduled classes
                and live facilitation.
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li>• Instructor-led sessions with defined timetables</li>
                <li>• Regular check-ins, assessments and feedback</li>
                <li>• Cohort-based learning and collaboration</li>
                <li>• Support for centres, coordinators and tutors</li>
              </ul>
              <Link
                href="/courses?type=guided"
                className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-800 hover:bg-sky-50 transition-colors"
              >
                View guided courses
              </Link>
            </div>
          </div>

          {/* Self-paced Courses */}
          <div className="relative rounded-2xl bg-white border border-slate-200 p-7 lg:p-8 shadow-sm overflow-hidden">
            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-3xl bg-cyan-100 blur-2xl opacity-70" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-sky-700">
                <Laptop2 className="w-3.5 h-3.5" />
                Self-paced courses
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-slate-900">
                Learn on your schedule, from anywhere
              </h3>
              <p className="text-sm text-slate-600">
                Best for individual professionals who want flexibility to learn around
                work and other commitments.
              </p>
              <ul className="space-y-1.5 text-sm text-slate-700">
                <li>• Learn anytime, on any device</li>
                <li>• Structured modules and downloadable resources</li>
                <li>• Move faster or slower as you need</li>
                <li>• Access to content updates during your enrolment</li>
              </ul>
              <Link
                href="/courses?type=self-paced"
                className="inline-flex items-center justify-center rounded-lg border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-sky-800 hover:bg-sky-50 transition-colors"
              >
                View self-paced courses
              </Link>
            </div>
          </div>
        </div>

        {/* Small footer hint */}
        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Clock className="w-3.5 h-3.5" />
          <span>Switch between learning styles as your needs change.</span>
        </div>
      </div>
    </section>
  );
}


