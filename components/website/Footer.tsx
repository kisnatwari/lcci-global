import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Logo className="mb-4" />
            <p className="text-sm leading-relaxed mt-4 text-gray-400">
              Award-winning organization in Soft Skills, Management Skills, English Skills, 
              Hospitality Skills and Computing & IT Skills.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Courses
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Courses</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/courses?type=guided" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Guided Courses
                </Link>
              </li>
              <li>
                <Link href="/courses?type=self-paced" className="hover:text-white transition-colors hover:translate-x-1 inline-block">
                  Self-Paced Courses
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <span>info@lccigq.com</span>
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span>
                <span>+977-01-5442886</span>
              </li>
              <li className="flex items-start gap-2 mt-2">
                <span>📍</span>
                <span>Ekantakuna Marg, Jawalakhel<br />Lalitpur, Nepal - 44700</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} LCCI Global Qualifications PVT.LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
