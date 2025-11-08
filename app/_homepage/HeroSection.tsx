import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden bg-white">
      {/* Spacer for fixed header */}
      <div className="absolute top-0 left-0 right-0 h-20"></div>
      
      {/* Diagonal Split Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A9FD8] via-[#6BB5E8] to-cyan-400" style={{ clipPath: 'polygon(0 0, 100% 0, 70% 100%, 0 100%)' }}></div>
        <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(70% 0, 100% 0, 100% 100%, 70% 100%)' }}></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Left side - Blue gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        
        {/* Right side - White area patterns */}
        <div className="absolute top-40 right-40 w-64 h-64 bg-[#4A9FD8]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400/5 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center h-full">
          {/* Left Side - Blue Gradient Area */}
          <div className="lg:col-span-7 text-white relative">
            {/* Floating Badge */}
            <div className="inline-block mb-8 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl animate-fade-in-up">
              <span className="text-sm font-black flex items-center gap-2">
                <span className="text-xl">🎯</span>
                Professional Excellence Starts Here
              </span>
            </div>
            
            {/* Main Headline - Large & Bold */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-8 leading-[0.9] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              BUILD YOUR
              <br />
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                FUTURE
              </span>
              <br />
              <span className="text-5xl md:text-6xl lg:text-7xl">WITH LCCI</span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-2xl md:text-3xl lg:text-4xl mb-12 font-bold text-white/90 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Industry-leading qualifications that transform careers worldwide
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <Link
                href="/courses"
                className="group relative px-10 py-6 bg-white text-[#4A9FD8] rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#4A9FD8]/10 to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">Start Learning</span>
                <svg className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                href="/about"
                className="px-10 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/40 text-white rounded-2xl font-black text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 shadow-2xl"
              >
                Explore Programs
              </Link>
            </div>

            {/* Quick Stats - Horizontal */}
            <div className="flex flex-wrap gap-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
              {[
                { number: "25K+", label: "Students" },
                { number: "120+", label: "Partners" },
                { number: "40+", label: "Courses" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-black mb-1 text-white">{stat.number}</div>
                  <div className="text-sm font-bold text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - White Area with Cards */}
          <div className="lg:col-span-5 relative">
            {/* Floating Course Cards */}
            <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
              {/* Card 1 - Top Right */}
              <div className="premium-card bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100 hover:border-[#4A9FD8] hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4A9FD8]/10 to-transparent rounded-bl-3xl"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                    🍴
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl mb-1">Hospitality</h3>
                    <p className="text-sm text-gray-600 font-semibold">Culinary Excellence</p>
                  </div>
                </div>
              </div>

              {/* Card 2 - Middle */}
              <div className="premium-card bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100 hover:border-green-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group ml-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-3xl"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                    💻
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl mb-1">Computing & IT</h3>
                    <p className="text-sm text-gray-600 font-semibold">Tech Innovation</p>
                  </div>
                </div>
              </div>

              {/* Card 3 - Bottom */}
              <div className="premium-card bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100 hover:border-purple-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-3xl"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                    📚
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl mb-1">English</h3>
                    <p className="text-sm text-gray-600 font-semibold">Cambridge Programs</p>
                  </div>
                </div>
              </div>

              {/* Card 4 - Offset */}
              <div className="premium-card bg-white rounded-3xl p-8 shadow-2xl border-2 border-gray-100 hover:border-orange-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group ml-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-3xl"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all">
                    🎨
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-xl mb-1">Soft Skills</h3>
                    <p className="text-sm text-gray-600 font-semibold">Personal Growth</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-3xl shadow-2xl rotate-12 animate-float opacity-20"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl shadow-2xl -rotate-12 animate-float opacity-20" style={{ animationDelay: "2s" }}></div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#4A9FD8]/60 rounded-full flex justify-center bg-white/10 backdrop-blur-md">
          <div className="w-1.5 h-3 bg-[#4A9FD8] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}

