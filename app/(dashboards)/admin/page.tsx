"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Activity, Zap, Loader2, AlertCircle, Award, FileText, Building2, Tag } from "lucide-react";
import { apiClient, ENDPOINTS } from "@/lib/api";

interface StatsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: string;
  totalCertificates: number;
  totalCompletedEnrollments: number;
  totalActivePromoCodes: number;
  totalTrainingCentres: number;
  totalBlogs: number;
}

export default function AdminDashboardPage() {
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(ENDPOINTS.stats.get());
        if (response.success && response.data) {
          console.log("Stats data received:", response.data);
          setStatsData(response.data);
        } else {
          throw new Error(response.message || "Failed to fetch stats");
        }
      } catch (err: any) {
        console.error("Failed to fetch stats:", err);
        setError(err.message || "Failed to load dashboard statistics. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number | string): string => {
    const number = typeof num === 'string' ? parseFloat(num) : num;
    if (isNaN(number)) return "0";
    return number.toLocaleString();
  };

  const formatCurrency = (amount: string | number): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return "$0";
    return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const stats = statsData ? [
    {
      title: "Total Users",
      value: formatNumber(statsData.totalUsers),
      change: "All registered users",
      icon: Users,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
    },
    {
      title: "Active Courses",
      value: formatNumber(statsData.totalCourses),
      change: "Total courses available",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
    },
    {
      title: "Enrollments",
      value: formatNumber(statsData.totalEnrollments),
      change: `${formatNumber(statsData.totalCompletedEnrollments)} completed`,
      icon: GraduationCap,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/10 to-teal-500/10",
    },
    {
      title: "Revenue",
      value: formatCurrency(statsData.totalRevenue),
      change: "Total revenue generated",
      icon: DollarSign,
      gradient: "from-orange-500 to-amber-500",
      bgGradient: "from-orange-500/10 to-amber-500/10",
    },
    {
      title: "Certificates",
      value: formatNumber(statsData.totalCertificates),
      change: "Total certificates issued",
      icon: Award,
      gradient: "from-yellow-500 to-orange-500",
      bgGradient: "from-yellow-500/10 to-orange-500/10",
    },
    {
      title: "Training Centres",
      value: formatNumber(statsData.totalTrainingCentres),
      change: "Registered training centres",
      icon: Building2,
      gradient: "from-indigo-500 to-purple-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
    },
    {
      title: "Promo Codes",
      value: formatNumber(statsData.totalActivePromoCodes),
      change: "Active promotional codes",
      icon: Tag,
      gradient: "from-pink-500 to-rose-500",
      bgGradient: "from-pink-500/10 to-rose-500/10",
    },
    {
      title: "Blogs",
      value: formatNumber(statsData.totalBlogs),
      change: "Total blog posts",
      icon: FileText,
      gradient: "from-slate-500 to-slate-600",
      bgGradient: "from-slate-500/10 to-slate-600/10",
    },
  ] : [];

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

          {/* Error State */}
          {error && (
            <div className="rounded-lg border-2 border-red-200 bg-red-50 p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-900">Error Loading Statistics</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <Card key={idx} className="relative overflow-hidden border-2">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    <div className="w-10 h-10 rounded-lg bg-slate-200 animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-32 bg-slate-200 rounded animate-pulse mb-2" />
                    <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Stats Cards */}
          {!isLoading && !error && stats.length > 0 && (
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
          )}

          {/* Empty State */}
          {!isLoading && !error && stats.length === 0 && (
            <div className="rounded-lg border-2 border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-sm text-slate-600">No statistics available</p>
            </div>
          )}

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
