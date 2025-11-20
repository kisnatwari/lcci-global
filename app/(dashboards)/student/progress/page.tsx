"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Target, Clock, TrendingUp } from "lucide-react";

const courseProgress = [
  {
    id: "course-1",
    name: "Executive Communication Lab",
    progress: 78,
    hoursLogged: 24,
    nextMilestone: "Final storytelling lab",
    badge: "Communication",
  },
  {
    id: "course-2",
    name: "Leadership Presence Accelerator",
    progress: 46,
    hoursLogged: 18,
    nextMilestone: "Coaching conversation #3",
    badge: "Leadership",
  },
  {
    id: "course-3",
    name: "Customer Experience Excellence",
    progress: 100,
    hoursLogged: 30,
    nextMilestone: "Capstone reflection",
    badge: "Customer Success",
  },
];

export default function StudentProgressPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Progress</h1>
          <p className="mt-2 text-slate-600">Stay on track with every cohort and lab you’re enrolled in.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            3 active cohorts
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            42 hours this month
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {courseProgress.map((course) => (
          <Card key={course.id} className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl">{course.name}</CardTitle>
              <CardDescription>
                {course.progress === 100 ? "Completed" : `Next: ${course.nextMilestone}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Progress</span>
                <span className="font-semibold text-slate-900">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-3" />
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Hours logged</span>
                <span className="font-semibold text-slate-900">{course.hoursLogged}h</span>
              </div>
              <Badge variant="outline">{course.badge}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Momentum tracker</CardTitle>
            <CardDescription>Your learning streak over the past eight weeks</CardDescription>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            +18% vs last month
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 gap-3">
            {[6, 5, 7, 4, 8, 9, 7, 8].map((value, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-full bg-gradient-to-b from-[color:var(--brand-blue)] to-[color:var(--brand-cyan)]"
                  style={{ height: `${value * 8}px` }}
                />
                <span className="text-xs text-slate-500">W{idx + 1}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

