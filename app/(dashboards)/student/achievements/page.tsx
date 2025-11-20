"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Flame, Target, Award } from "lucide-react";

const achievements = [
  {
    id: "ach-1",
    title: "Storytelling Sprint",
    description: "Delivered three concise executive updates in a row.",
    earnedAt: "2025-11-18T10:00:00.000Z",
    icon: Trophy,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "ach-2",
    title: "Coaching Champion",
    description: "Hosted five peer coaching conversations.",
    earnedAt: "2025-11-16T09:00:00.000Z",
    icon: Target,
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "ach-3",
    title: "Consistency Flame",
    description: "Maintained a 14-day learning streak.",
    earnedAt: "2025-11-12T07:30:00.000Z",
    icon: Flame,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "ach-4",
    title: "CX Advocate",
    description: "Completed customer experience capstone with distinction.",
    earnedAt: "2025-11-05T18:15:00.000Z",
    icon: Award,
    color: "from-blue-500 to-cyan-500",
  },
];

export default function StudentAchievementsPage() {
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Achievements</h1>
        <p className="mt-2 text-slate-600">
          Track the milestones you’ve unlocked across your soft-skills journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card key={achievement.id} className="border-slate-200 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <div
                  className={`rounded-2xl bg-gradient-to-br ${achievement.color} p-3 text-white shadow-lg`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{formatDate(achievement.earnedAt)}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">{achievement.description}</p>
                <div className="mt-4">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                    Soft Skills
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

