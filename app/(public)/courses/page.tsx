import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import PageHeader from "@/components/website/PageHeader";
import CoursesContent from "@/components/website/CoursesContent";

interface CoursesPageProps {
  searchParams: Promise<{ categoryId?: string; type?: string }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;
  const categoryId = params.categoryId;
  const type = params.type;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1">
        <PageHeader
          badge={{ icon: "📚", text: "Explore Our Programs" }}
          title="All"
          titleHighlight="Courses"
          description="Explore our full range of LCCI programmes, from guided cohorts to flexible self-paced options."
        />

        <CoursesContent
          initialCategoryId={categoryId || null}
          initialType={type || null}
        />
      </main>
      
      <Footer />
    </div>
  );
}
