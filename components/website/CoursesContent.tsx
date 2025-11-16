import Link from "next/link";
import CourseCard from "@/components/website/CourseCard";
import { Course } from "@/types/course";

interface CoursesContentProps {
  courses: Course[];
  allCount: number;
  guidedCount: number;
  selfPacedCount: number;
  activeType?: "guided" | "self-paced";
}

export default function CoursesContent({
  courses,
  allCount,
  guidedCount,
  selfPacedCount,
  activeType,
}: CoursesContentProps) {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-16">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-10 border-b border-slate-200 pb-4">
        <FilterTab href="/courses" label={`All courses (${allCount})`} active={!activeType} />
        <FilterTab
          href="/courses?type=guided"
          label={`Guided (${guidedCount})`}
          active={activeType === "guided"}
        />
        <FilterTab
          href="/courses?type=self-paced"
          label={`Self-paced (${selfPacedCount})`}
          active={activeType === "self-paced"}
        />
      </div>

      {/* Results Count */}
      {activeType && (
        <div className="mb-6">
          <p className="text-sm md:text-base text-slate-600">
            Showing{" "}
            <span className="font-semibold text-sky-700">{courses.length}</span>{" "}
            {activeType === "guided" ? "guided" : "self-paced"} course
            {courses.length !== 1 ? "s" : ""}.
          </p>
        </div>
      )}

      {/* Courses Grid / Empty state */}
      {courses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-xl font-semibold text-slate-900 mb-2">No courses found</p>
          <p className="text-sm text-slate-600 mb-4">
            Try a different filter or view all courses to see everything that&apos;s available.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-300 hover:bg-slate-50 transition-colors"
          >
            Reset filters
          </Link>
        </div>
      )}
    </div>
  );
}

interface FilterTabProps {
  href: string;
  label: string;
  active: boolean;
}

function FilterTab({ href, label, active }: FilterTabProps) {
  return (
    <Link
      href={href}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors border ${
        active
          ? "bg-sky-700 text-white border-sky-700"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
      }`}
    >
      {label}
    </Link>
  );
}


