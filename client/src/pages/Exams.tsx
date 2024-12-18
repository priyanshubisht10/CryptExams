import { useState } from "react";
import ExamCard from "../components/Exam/ExamCard";
import ExamWarning from "../components/Exam/ExamWarning";
import { useNavigate } from "react-router-dom";

const availableExams = [
  {
    id: 1,
    examTitle: "JEE Exam",
    duration: "45 minutes",
    totalQuestions: 5,
    subject: "Mathematics, Physics, Chemistry",
  },
];

export default function Exams() {
  const [showWarning, setShowWarning] = useState(false);
  const [selectedExam, setSelectedExam] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleStartExam = (examId: number) => {
    setSelectedExam(examId);
    setShowWarning(true);
  };

  const handleAcceptRules = () => {
    setShowWarning(false);
    navigate("/student/exams/questions");
    // Navigate to exam page or start exam logic
    console.log(`Starting exam ${selectedExam}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Available Exams</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableExams.map((exam) => (
            <ExamCard
              key={exam.id}
              {...exam}
              onStart={() => handleStartExam(exam.id)}
            />
          ))}
        </div>

        {showWarning && (
          <ExamWarning
            onAccept={handleAcceptRules}
            onCancel={() => setShowWarning(false)}
          />
        )}
      </div>
    </div>
  );
}
