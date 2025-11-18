import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import ContactContent from "@/components/website/ContactContent";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <main className="flex-1">
        <PageHeader
          badge={{ icon: "💬", text: "Get in touch" }}
          title="Contact"
          titleHighlight="Us"
          description="Share a few details or use the direct contact information below. Our team will respond as soon as possible."
        />

        <ContactContent />
      </main>
      
      <Footer />
    </div>
  );
}
