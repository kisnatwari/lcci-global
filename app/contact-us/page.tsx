import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <PageHeader
          badge={{ icon: "💬", text: "Let's Connect" }}
          title="Contact"
          titleHighlight="Us"
          description="We're here to help. Get in touch with our team for any questions or inquiries."
          extraContent={
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3 glass-effect px-6 py-3 rounded-full border border-white/30 backdrop-blur-xl">
                <span className="text-2xl">📧</span>
                <span className="text-white font-bold">info@lccigq.com</span>
              </div>
              <div className="flex items-center gap-3 glass-effect px-6 py-3 rounded-full border border-white/30 backdrop-blur-xl">
                <span className="text-2xl">📞</span>
                <span className="text-white font-bold">+977-01-5442886</span>
              </div>
            </div>
          }
          rightContent={
            <div className="space-y-4">
              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#4A9FD8] hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4A9FD8]/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    📧
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Email Support</h3>
                    <p className="text-xs text-gray-600 font-semibold">24/7 Available</p>
                  </div>
                </div>
              </div>

              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-green-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group ml-6">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-400/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    📞
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Phone Support</h3>
                    <p className="text-xs text-gray-600 font-semibold">Mon-Fri 9AM-5PM</p>
                  </div>
                </div>
              </div>

              <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-purple-500 hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-2xl"></div>
                <div className="flex items-center gap-3 relative z-10">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-all">
                    💬
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 text-lg mb-0.5">Quick Response</h3>
                    <p className="text-xs text-gray-600 font-semibold">Within 24 Hours</p>
                  </div>
                </div>
              </div>
            </div>
          }
        />

        <div className="container mx-auto px-4 lg:px-8 max-w-6xl py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 tracking-tight">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="premium-card bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-1">
                  <h3 className="font-black text-gray-900 mb-4 text-xl flex items-center gap-3">
                    <span className="text-4xl">📧</span>
                    Email
                  </h3>
                  <p className="text-gray-700 text-lg font-bold">info@lccigq.com</p>
                  <p className="text-gray-500 text-sm mt-2 font-medium">We typically respond within 24 hours</p>
                </div>
                
                <div className="premium-card bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-1">
                  <h3 className="font-black text-gray-900 mb-4 text-xl flex items-center gap-3">
                    <span className="text-4xl">📞</span>
                    Phone
                  </h3>
                  <p className="text-gray-700 text-lg font-bold">+977-01-5442886</p>
                  <p className="text-gray-500 text-sm mt-2 font-medium">Monday - Friday, 9:00 AM - 5:00 PM NPT</p>
                </div>
                
                <div className="premium-card bg-white border-2 border-gray-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all hover:border-[#4A9FD8] hover:-translate-y-1">
                  <h3 className="font-black text-gray-900 mb-4 text-xl flex items-center gap-3">
                    <span className="text-4xl">📍</span>
                    Address
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-lg font-bold">
                    LCCI Global Qualifications PVT.LTD<br />
                    Ekantakuna Marg, Jawalakhel<br />
                    Lalitpur, Nepal - 44700
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-10 tracking-tight">Send us a Message</h2>
              
              <form className="space-y-6 premium-card bg-white p-10 rounded-3xl border-2 border-gray-100 shadow-xl">
                <div>
                  <label htmlFor="name" className="block text-sm font-black text-gray-700 mb-3">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all font-semibold"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-black text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all font-semibold"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-black text-gray-700 mb-3">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all font-semibold"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-black text-gray-700 mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#4A9FD8] focus:border-[#4A9FD8] transition-all resize-none font-semibold"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="glossy-button w-full px-8 py-5 text-white rounded-xl font-black text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 relative"
                >
                  <span className="relative z-10">Send Message</span>
                </button>
              </form>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-20 premium-card bg-gradient-to-br from-blue-50 to-cyan-50 p-12 rounded-3xl border-2 border-[#4A9FD8]/20 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-12 text-center tracking-tight">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  q: "How do I enroll in a course?",
                  a: "You can browse our courses and enroll directly through the website. For guided courses, you may need to contact your institution or our support team."
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major payment methods. Contact us for more information about payment options."
                },
                {
                  q: "Can I get a refund?",
                  a: "Yes, we offer refunds within 14 days of enrollment. Please contact our support team for assistance with refunds."
                }
              ].map((faq, idx) => (
                <div key={idx} className="premium-card bg-white p-8 rounded-2xl border-2 border-gray-100 hover:shadow-xl transition-all hover:border-[#4A9FD8] hover:-translate-y-1">
                  <h3 className="font-black text-gray-900 mb-4 text-lg">{faq.q}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed font-semibold">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
