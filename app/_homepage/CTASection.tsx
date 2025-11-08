import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-28 bg-gradient-to-br from-[#4A9FD8] via-[#6BB5E8] to-cyan-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#4A9FD8]/95 via-[#6BB5E8]/95 to-cyan-600/95"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-cyan-300/25 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl animate-pulse-glow"></div>
      </div>
      
      <div className="absolute inset-0 shimmer-bg opacity-20"></div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl md:text-6xl font-black mb-8 tracking-tight leading-tight drop-shadow-2xl">
            Start Your Career with Professional Trainings
          </h2>
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-semibold text-white/95 drop-shadow-lg">
            Join thousands of professionals advancing their careers with LCCI Global Qualifications. 
            Begin your journey to success today.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link
              href="/courses"
              className="px-12 py-6 bg-white text-[#4A9FD8] rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4A9FD8]/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10">Get Started Today</span>
              <svg className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/contact-us"
              className="px-12 py-6 glass-effect border-2 border-white/40 text-white rounded-2xl font-black text-xl hover:bg-white/25 hover:scale-105 transition-all duration-300 shadow-2xl backdrop-blur-xl"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

