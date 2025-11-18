import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Activity, Zap } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+20.1% from last month",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Active Courses",
      value: "45",
      change: "+3 new this month",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Enrollments",
      value: "2,567",
      change: "+12.5% from last month",
      icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      title: "Revenue",
      value: "$45,231",
      change: "+18.2% from last month",
      icon: DollarSign,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Card with all content */}
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
            <CardDescription className="mt-1">
              Welcome back! Here's an overview of your admin panel.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="relative overflow-hidden border-2 hover:shadow-lg transition-all duration-300 group">
              {/* Gradient background overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              {/* Decorative corner accent */}
              <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
              
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-emerald-600" />
                  <span>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
          })}
          </div>

          {/* Activity and Actions */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 relative overflow-hidden border-2">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[color:var(--brand-blue)]/5 to-transparent rounded-full blur-2xl -mr-20 -mt-20" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="h-5 w-5 text-[color:var(--brand-blue)]" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Activity feed will be displayed here...
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 relative overflow-hidden border-2">
          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-[color:var(--brand-cyan)]/5 to-transparent rounded-full blur-2xl -ml-20 -mb-20" />
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-5 w-5 text-[color:var(--brand-cyan)]" />
              <CardTitle>Quick Actions</CardTitle>
            </div>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="space-y-2 text-sm text-muted-foreground">
              Quick actions will be displayed here...
            </div>
          </CardContent>
          </Card>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}

