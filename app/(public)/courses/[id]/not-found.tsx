import Link from "next/link";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function CourseNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-6">
            <BookOpen className="w-12 h-12 text-slate-600" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Course Not Found
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            The course you're looking for doesn't exist or may have been removed.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)] text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              Browse All Courses
            </Link>
            
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border-2 border-slate-200 text-slate-700 font-semibold hover:border-[color:var(--brand-blue)] hover:text-[color:var(--brand-blue)] transition-all duration-300"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

