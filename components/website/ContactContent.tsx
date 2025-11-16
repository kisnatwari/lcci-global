export default function ContactContent() {
  return (
    <section className="pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* Left: form */}
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 mb-4 uppercase">
            Online inquiry
          </p>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-xs font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-(--brand-blue) focus:border-(--brand-blue) text-sm resize-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full mt-2 px-6 py-3 rounded-lg bg-(--brand-blue) text-white text-xs font-semibold tracking-wide hover:bg-[#0087c4] transition-colors"
            >
              Send message
            </button>
          </form>
        </div>

        {/* Right: contact details */}
        <div className="md:self-center">
          <p className="text-xs font-semibold tracking-[0.16em] text-slate-500 mb-4 uppercase">
            Contact details
          </p>
          <div className="space-y-6 text-sm text-slate-800">
            <div>
              <div className="font-semibold text-slate-900 mb-1">Email</div>
              <a
                href="mailto:info@lccigq.com"
                className="text-slate-700 hover:text-(--brand-blue) underline underline-offset-4"
              >
                info@lccigq.com
              </a>
            </div>

            <div>
              <div className="font-semibold text-slate-900 mb-1">Phone</div>
              <a href="tel:+977015442886" className="text-slate-700 hover:text-(--brand-blue)">
                +977-01-5442886
              </a>
            </div>

            <div>
              <div className="font-semibold text-slate-900 mb-1">Office address</div>
              <p className="text-slate-700 leading-relaxed">
                LCCI Global Qualifications PVT.LTD
                <br />
                Ekantakuna Marg, Jawalakhel
                <br />
                Lalitpur, Nepal – 44700
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


