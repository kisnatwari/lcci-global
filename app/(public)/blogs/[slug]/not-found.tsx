import Link from "next/link";
import Header from "@/components/website/Header";
import Footer from "@/components/website/Footer";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Blog Not Found</h1>
          <p className="text-slate-600 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/blogs">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

