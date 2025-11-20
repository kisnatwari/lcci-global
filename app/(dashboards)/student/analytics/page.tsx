"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, PieChart, Activity } from "lucide-react";

const analyticsSummary = [
  { label: "Learning hours", value: "62h", detail: "+12% vs last month" },
  { label: "Labs completed", value: "14", detail: "3 this week" },
  { label: "Feedback score", value: "4.7/5", detail: "Across all facilitators" },
];

const skillsBreakdown = [
  { skill: "Communication", value: 40, color: "bg-blue-500" },
  { skill: "Leadership", value: 25, color: "bg-amber-500" },
  { skill: "Customer Experience", value: 20, color: "bg-emerald-500" },
  { skill: "Sales Enablement", value: 15, color: "bg-pink-500" },
];

export default function StudentAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="mt-2 text-slate-600">
          Insights across your soft skills journey – learning velocity, skills focus and strengths.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {analyticsSummary.map((metric) => (
          <Card key={metric.label} className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">{metric.label}</p>
              <p className="mt-2 text-3xl font-bold text-slate-900">{metric.value}</p>
              <p className="text-sm text-emerald-600 mt-2">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Learning momentum</CardTitle>
            <CardDescription>Hours spent per week across all cohorts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-40 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <LineChart className="h-10 w-10" />
              <span className="sr-only">Placeholder for sparkline</span>
            </div>
            <p className="text-sm text-slate-500">
              Your most consistent streak happened during weeks 5-7. Keep aiming for 6+ hours per week to
              maintain momentum.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Skill focus</CardTitle>
            <CardDescription>Distribution of time spent by capability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-40 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50 border border-slate-100 flex items-center justify-center text-slate-400">
              <PieChart className="h-10 w-10" />
              <span className="sr-only">Placeholder for pie chart</span>
            </div>
            <div className="space-y-3">
              {skillsBreakdown.map((item) => (
                <div key={item.skill} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.skill}</p>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-slate-500">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Feedback insights</CardTitle>
          <CardDescription>Every facilitator score received during recent labs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {["Clarity of instruction", "Actionable feedback", "Peer collaboration", "Energy & pacing"].map(
              (tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-2">
                  <Activity className="h-3 w-3" />
                  {tag}
                </Badge>
              )
            )}
          </div>
          <p className="text-sm text-slate-600">
            Learners consistently highlight the usefulness of facilitator feedback emails and live coaching
            notes. Keep submitting reflections after each session to unlock even richer insights.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

