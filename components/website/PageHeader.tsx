interface PageHeaderProps {
  badge?: {
    icon: string;
    text: string;
  };
  title: string;
  titleHighlight?: string;
  description: string;
  extraContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export default function PageHeader({
  badge,
  title,
  titleHighlight,
  description,
  extraContent,
  rightContent,
}: PageHeaderProps) {
  return (
    <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden bg-white">
      {/* Left Side - Gradient Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#4A9FD8] via-[#6BB5E8] to-cyan-400"
          style={{ clipPath: 'polygon(0 0, 65% 0, 45% 100%, 0 100%)' }}
        ></div>
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white"
          style={{ clipPath: 'polygon(65% 0, 100% 0, 100% 100%, 45% 100%)' }}
        ></div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Blue side orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }}></div>
        
        {/* White side patterns */}
        <div className="absolute top-40 right-40 w-64 h-64 bg-[#4A9FD8]/5 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-400/5 rounded-full blur-2xl"></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-32 right-32 w-24 h-24 bg-[#4A9FD8]/10 rotate-45 rounded-2xl blur-xl animate-float"></div>
        <div className="absolute bottom-40 left-40 w-32 h-32 bg-cyan-200/10 rotate-12 rounded-3xl blur-xl animate-float" style={{ animationDelay: "3s" }}></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 pt-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Side - Blue Gradient Area */}
          <div className="lg:col-span-7 text-white relative">
            {badge && (
              <div className="inline-block mb-8 px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-2xl animate-fade-in-up">
                <span className="text-sm font-black flex items-center gap-2">
                  <span className="text-xl">{badge.icon}</span>
                  {badge.text}
                </span>
              </div>
            )}
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-[0.9] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              {title}
              {titleHighlight && (
                <>
                  <br />
                  <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                    {titleHighlight}
                  </span>
                </>
              )}
            </h1>
            
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 font-bold text-white/90 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              {description}
            </p>

            {extraContent && (
              <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                {extraContent}
              </div>
            )}
          </div>

          {/* Right Side - White Area with Custom Content */}
          <div className="lg:col-span-5 relative hidden lg:block">
            {rightContent ? (
              <div className="animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                {rightContent}
              </div>
            ) : (
              // Default decorative cards (fallback)
              <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
                <div className="premium-card bg-white rounded-2xl p-6 shadow-xl border-2 border-gray-100 hover:border-[#4A9FD8] hover:scale-105 transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4A9FD8]/10 to-transparent rounded-bl-2xl"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all">
                      ✨
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-lg mb-0.5">Excellence</h3>
                      <p className="text-xs text-gray-600 font-semibold">Award-Winning</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Floating decorative elements */}
            <div className="absolute -top-8 -right-8 w-20 h-20 bg-gradient-to-br from-[#4A9FD8] to-cyan-600 rounded-2xl shadow-xl rotate-12 animate-float opacity-20"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl shadow-xl -rotate-12 animate-float opacity-20" style={{ animationDelay: "2s" }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
