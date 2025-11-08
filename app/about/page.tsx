import Link from "next/link";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <PageHeader
          badge={{ icon: "🌟", text: "Our Story" }}
          title="About"
          titleHighlight="LCCI"
          description="Empowering professionals worldwide with industry-recognized qualifications"
          extraContent={
            <div className="flex flex-wrap gap-8">
              {[
                { number: "25K+", label: "Students" },
                { number: "120+", label: "Partners" },
                { number: "40+", label: "Programs" },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl md:text-5xl font-black mb-1 text-white">{stat.number}</div>
                  <div className="text-sm font-bold text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          }
          rightContent={
            <div className="space-y-4">
              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#4A9FD8] hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4A9FD8]/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    🏆
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Award-Winning</h3>
                    <p className="text-xs text-gray-600 font-semibold">Industry Leader</p>
                  </div>
                </div>
              </div>

              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-green-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group ml-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    🌍
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Global Reach</h3>
                    <p className="text-xs text-gray-600 font-semibold">Worldwide Recognition</p>
                  </div>
                </div>
              </div>

              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-orange-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    💡
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Innovation</h3>
                    <p className="text-xs text-gray-600 font-semibold">Future-Focused</p>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-5xl py-20">
          {/* Mission Section */}
          <section className="mb-20 animate-fade-in-up">
            <div className="premium-card bg-white border-2 border-gray-100 rounded-3xl p-10 md:p-14 shadow-xl">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">Our Mission</h2>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-semibold">
                LCCI Global Qualifications (LCCI GQ) is an award-winning and one of the leading 
                organisations in the field of Soft Skills, Management Skills, English Skills, 
                Hospitality Skills and Computing & IT Skills dedicated to empower thousands of 
                people in business, life skills and related fields, in a competitive and prosperous world.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-semibold">
                LCCI GQ is focused on building itself as institution of repute and to work as 
                an emerging education enterprise globally.
              </p>
            </div>
          </section>

          {/* What We Offer */}
          <section className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center tracking-tight">What We Offer</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="premium-card bg-white border-2 border-gray-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-2">
                <div className="text-6xl mb-6">🎯</div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  Comprehensive Qualifications
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg font-semibold">
                  From entry-level certificates to advanced diplomas, we offer a complete 
                  range of qualifications to suit every career stage.
                </p>
              </div>
              
              <div className="premium-card bg-white border-2 border-gray-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-2">
                <div className="text-6xl mb-6">🔄</div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  Flexible Learning Options
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg font-semibold">
                  Choose between guided courses for structured learning or self-paced 
                  courses for maximum flexibility.
                </p>
              </div>
              
              <div className="premium-card bg-white border-2 border-gray-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-2">
                <div className="text-6xl mb-6">🌍</div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  Industry Recognition
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg font-semibold">
                  Our qualifications are recognized by employers worldwide and provide 
                  a solid foundation for career success.
                </p>
              </div>
              
              <div className="premium-card bg-white border-2 border-gray-100 p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-2">
                <div className="text-6xl mb-6">👨‍🏫</div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 tracking-tight">
                  Expert Support
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg font-semibold">
                  Learn from experienced professionals and receive comprehensive support 
                  throughout your learning journey.
                </p>
              </div>
            </div>
          </section>

          {/* Values */}
          <section className="mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-12 text-center tracking-tight">Our Values</h2>
            <div className="premium-card bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-10 md:p-14 border-2 border-[#4A9FD8]/20 shadow-xl">
              <ul className="space-y-8">
                {[
                  { icon: "⭐", title: "Excellence", desc: "We maintain the highest standards in education and assessment" },
                  { icon: "🚀", title: "Accessibility", desc: "We make quality education accessible to everyone" },
                  { icon: "💡", title: "Innovation", desc: "We continuously evolve our programs to meet industry needs" },
                  { icon: "🤝", title: "Integrity", desc: "We operate with honesty and transparency in everything we do" },
                ].map((value, idx) => (
                  <li key={idx} className="flex items-start gap-5 p-6 rounded-2xl hover:bg-white/50 transition-colors">
                    <span className="text-5xl">{value.icon}</span>
                    <div>
                      <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">{value.title}</h3>
                      <p className="text-gray-700 text-lg font-semibold">{value.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-br from-[#4A9FD8] via-[#6BB5E8] to-cyan-500 text-white p-12 md:p-16 rounded-3xl text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0">
              <div className="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Ready to Get Started?</h2>
              <p className="text-xl md:text-2xl mb-10 text-white/95 font-semibold">
                Join thousands of professionals advancing their careers with LCCI
              </p>
              <Link
                href="/courses"
                className="inline-flex items-center gap-3 px-10 py-5 bg-white text-[#4A9FD8] rounded-2xl font-black text-lg shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                Browse Our Courses
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
