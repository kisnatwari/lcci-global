import Link from "next/link";

export default function CourseTypesSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-blue-50 via-white to-cyan-50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#4A9FD8]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight drop-shadow-sm">
            Choose Your Learning Path
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-semibold">
            We offer flexible learning options tailored to your schedule and learning style
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Guided Courses */}
          <div className="group relative premium-card bg-white rounded-3xl p-10 border-2 border-gray-100 hover:border-[#4A9FD8] transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-3xl"></div>
            
            <div className="text-7xl mb-6 relative z-10">🎓</div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 tracking-tight relative z-10">
              Guided Courses
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-semibold relative z-10">
              Perfect for structured learning with expert instructor-led sessions. 
              Ideal for schools, colleges, and corporate training programs.
            </p>
            <ul className="space-y-4 text-gray-700 mb-10 relative z-10">
              {["Instructor-led sessions", "Regular assessments", "Group learning environment", "Scheduled classes"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-lg">
                  <span className="text-green-600 text-2xl font-black">✓</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/courses?type=guided"
              className="glossy-button inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative z-10"
            >
              <span className="relative z-10">View Guided Courses</span>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>

          {/* Self-Paced Courses */}
          <div className="group relative premium-card bg-white rounded-3xl p-10 border-2 border-gray-100 hover:border-[#4A9FD8] transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#4A9FD8]/10 to-transparent rounded-bl-3xl"></div>
            
            <div className="text-7xl mb-6 relative z-10">📚</div>
            <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-5 tracking-tight relative z-10">
              Self-Paced Courses
            </h3>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed font-semibold relative z-10">
              Learn at your own pace with comprehensive materials. 
              Access course content anytime, anywhere, on any device.
            </p>
            <ul className="space-y-4 text-gray-700 mb-10 relative z-10">
              {["Learn at your own pace", "Comprehensive materials", "24/7 access to content", "Flexible schedule"].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-lg">
                  <span className="text-[#4A9FD8] text-2xl font-black">✓</span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/courses?type=self-paced"
              className="glossy-button inline-flex items-center gap-3 px-8 py-4 text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative z-10"
            >
              <span className="relative z-10">View Self-Paced Courses</span>
              <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

