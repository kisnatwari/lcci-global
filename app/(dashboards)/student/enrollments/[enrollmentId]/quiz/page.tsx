"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2, X, BookOpen, Trophy, Sparkles } from "lucide-react";
import { getCourseQuizzes } from "@/lib/api/quizzes";
import { getEnrollmentById, markQuizComplete } from "@/lib/api/enrollments";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";

interface Quiz {
  quizId: string;
  courseId: string;
  title: string;
  description?: string;
  questions?: Question[];
  createdAt?: string;
}

interface Question {
  questionId: string;
  questionText: string;
  options: Option[];
  orderIndex?: number;
}

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  is_correct?: boolean;
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params.enrollmentId as string;
  
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWrongAnswer, setShowWrongAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQuizzes();
  }, [enrollmentId]);

  const fetchQuizzes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const enrollment = await getEnrollmentById(enrollmentId);
      const courseId = enrollment?.courseId || enrollment?.course?.courseId || enrollment?.course?.id;
      
      if (!courseId) {
        throw new Error("Course ID not found");
      }

      const quizzesData = await getCourseQuizzes(courseId);
      setQuizzes(quizzesData);
      
      // Take the first quiz set
      if (quizzesData && quizzesData.length > 0) {
        const firstQuiz = quizzesData[0];
        // Sort questions by orderIndex
        if (firstQuiz.questions) {
          firstQuiz.questions.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
        }
        setCurrentQuiz(firstQuiz);
      }
    } catch (err: any) {
      console.error("Failed to fetch quizzes:", err);
      setError(err.message || "Failed to load quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (isSubmitting || showWrongAnswer) return;
    setSelectedOption(optionId);
    setShowWrongAnswer(false);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || !currentQuiz?.questions) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    // Handle both object and string options
    const selectedOptionData = currentQuestion.options.find((opt: any) => {
      if (typeof opt === 'object') {
        return opt.id === selectedOption;
      }
      return false;
    });
    const isCorrect = selectedOptionData && typeof selectedOptionData === 'object' 
      ? (selectedOptionData.isCorrect === true || selectedOptionData.is_correct === true)
      : false;

    setIsSubmitting(true);

    // Animate the answer check
    await new Promise(resolve => setTimeout(resolve, 500));

    if (isCorrect) {
      // Correct answer - move to next question
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowWrongAnswer(false);
      } else {
        // All questions completed
        await handleQuizComplete();
      }
    } else {
      // Wrong answer - show message and block progression
      setShowWrongAnswer(true);
    }

    setIsSubmitting(false);
  };

  const handleQuizComplete = async () => {
    if (!currentQuiz) return;

    setIsMarkingComplete(true);
    try {
      await markQuizComplete(enrollmentId, { quizId: currentQuiz.quizId });
      setIsCompleted(true);
    } catch (err: any) {
      console.error("Failed to mark quiz as complete:", err);
      setError(err.message || "Failed to mark quiz as complete");
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const currentQuestion = currentQuiz?.questions?.[currentQuestionIndex];
  const progress = currentQuiz?.questions ? ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100 : 0;

  // Spring animation for progress bar
  const progressSpring = useSpring({
    width: `${progress}%`,
    config: { tension: 100, friction: 30 }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 animate-spin text-[color:var(--brand-blue)]" />
          <p className="text-slate-600">Loading quiz...</p>
        </motion.div>
      </div>
    );
  }

  if (error && !currentQuiz) {
    return (
      <Card className="border-red-200 bg-red-50 m-6">
        <CardContent className="p-8">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading quiz</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button onClick={fetchQuizzes} className="mt-4" variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuiz || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="m-6">
          <CardContent className="p-8 text-center">
            <p className="text-slate-600">No quiz available</p>
            <Button
              onClick={() => router.push(`/student/enrollments/${enrollmentId}`)}
              className="mt-4"
              variant="outline"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success screen
  if (isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="max-w-2xl w-full"
        >
          <Card className="border-2 border-green-200 shadow-2xl">
            <CardContent className="p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, duration: 0.6 }}
                className="mb-6"
              >
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-4xl font-bold text-slate-900 mb-4"
              >
                Congratulations! 🎉
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-slate-600 mb-8"
              >
                You've successfully completed <span className="font-semibold text-slate-900">{currentQuiz.title}</span>!
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  onClick={() => router.push(`/student/enrollments/${enrollmentId}`)}
                  size="lg"
                  className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white px-8 py-6 text-lg"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Course
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(`/student/enrollments/${enrollmentId}`)}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-right">
            <h2 className="text-sm text-slate-500">Question</h2>
            <p className="text-2xl font-bold text-slate-900">
              {currentQuestionIndex + 1} / {currentQuiz.questions?.length || 0}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full bg-slate-200 rounded-full h-3 overflow-hidden"
        >
          <animated.div
            style={progressSpring}
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
          />
        </motion.div>

        {/* Quiz Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <Card className="border-2 border-slate-200 shadow-xl">
              <CardContent className="p-8">
                {/* Quiz Title */}
                <div className="mb-6 pb-4 border-b border-slate-200">
                  <h1 className="text-2xl font-bold text-slate-900 mb-2">{currentQuiz.title}</h1>
                  {currentQuiz.description && (
                    <p className="text-slate-600">{currentQuiz.description}</p>
                  )}
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-900 mb-6 leading-relaxed">
                    {currentQuestion.questionText}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option: any, index: number) => {
                      // Handle both object and string options
                      const optionId = typeof option === 'object' ? option.id : `option-${index}`;
                      const optionText = typeof option === 'object' ? option.text : option;
                      const isCorrect = typeof option === 'object' ? (option.isCorrect === true || option.is_correct === true) : false;
                      
                      const isSelected = selectedOption === optionId;
                      const letter = String.fromCharCode(65 + index);

                      return (
                        <motion.button
                          key={optionId}
                          onClick={() => handleOptionSelect(optionId)}
                          disabled={isSubmitting || showWrongAnswer}
                          whileHover={!isSubmitting && !showWrongAnswer ? { scale: 1.02 } : {}}
                          whileTap={!isSubmitting && !showWrongAnswer ? { scale: 0.98 } : {}}
                          className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? showWrongAnswer
                                ? 'border-red-500 bg-red-50'
                                : 'border-[color:var(--brand-blue)] bg-blue-50'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                          } ${isSubmitting || showWrongAnswer ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0 ${
                              isSelected
                                ? showWrongAnswer
                                  ? 'bg-red-500 text-white'
                                  : 'bg-[color:var(--brand-blue)] text-white'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {letter}
                            </div>
                            <span className={`flex-1 font-medium ${
                              isSelected && showWrongAnswer ? 'text-red-900' : 'text-slate-900'
                            }`}>
                              {option.text}
                            </span>
                            {isSelected && !showWrongAnswer && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-[color:var(--brand-blue)]"
                              >
                                <CheckCircle2 className="w-5 h-5" />
                              </motion.div>
                            )}
                            {isSelected && showWrongAnswer && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="text-red-500"
                              >
                                <X className="w-5 h-5" />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Wrong Answer Message */}
                <AnimatePresence>
                  {showWrongAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: "auto" }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-red-900 mb-1">Incorrect Answer</h3>
                          <p className="text-sm text-red-700">
                            Please review the course materials and try again. You must answer correctly to proceed.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit Button */}
                <div className="flex justify-end">
                  {showWrongAnswer ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3"
                    >
                      <Button
                        onClick={() => {
                          setShowWrongAnswer(false);
                          setSelectedOption(null);
                        }}
                        variant="outline"
                        size="lg"
                        className="px-8 border-slate-300"
                      >
                        <BookOpen className="w-5 h-5 mr-2" />
                        Review & Try Again
                      </Button>
                    </motion.div>
                  ) : (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedOption || isSubmitting || isMarkingComplete}
                      size="lg"
                      className="bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue)]/90 text-white px-8"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          {currentQuestionIndex < (currentQuiz.questions?.length || 0) - 1 ? "Submit Answer" : "Complete Quiz"}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
