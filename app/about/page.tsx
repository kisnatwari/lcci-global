import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import AboutContent from "@/components/website/AboutContent";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <PageHeader
          badge={{ icon: "🌟", text: "Our Story" }}
          title="About"
          titleHighlight="LCCI"
          description="Empowering professionals worldwide with industry-recognized qualifications."
        />

        <AboutContent />
      </main>
      
      <Footer />
    </div>
  );
}
