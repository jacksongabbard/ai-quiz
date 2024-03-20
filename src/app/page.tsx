import { QuizQuestion, questions } from "@/lib/questions";
import styles from "./page.module.css";

type QuizData = {
  cordAccessToken: string;
  questions: (QuizQuestion & {
    cordThreadID: string;
  })[];
};

async function getQuizData(): Promise<QuizData> {
  return {
    cordAccessToken: "",
    questions: questions.map((q) => ({ ...q, cordThreadID: "" })),
  };
}

export default async function Home() {
  const _ = await getQuizData();
  return <main className={styles.main}>Quiz coming soon!</main>;
}
