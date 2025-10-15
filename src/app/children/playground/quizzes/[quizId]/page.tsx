import { use } from "react";

export default function QuizPlayPage({
    params
}: {
    params: Promise<{ quizId: string }>;
}) {
    const { quizId } = use(params);
    return (
        <div></div>
    );
}