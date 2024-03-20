import { QuizQuestion, questions } from "@/lib/questions";
import styles from "./page.module.css";
import { uuid } from "@/lib/uuid";
import { fetchCordRESTApi } from "@/lib/fetchCordRESTApi";
import { getClientAuthToken } from "@cord-sdk/server";
import { CORD_API_SECRET, CORD_APPLICATION_ID } from "@/lib/env";

type QuizData = {
  cordAccessToken: string;
  questions: (QuizQuestion & {
    cordThreadID: string;
  })[];
};

async function getQuizData(): Promise<QuizData> {
  const id = uuid();

  const human = "h:" + id;
  const bot = "b:" + id;
  const group = "g:" + id;
  const thread = (n: number) => "t:" + id + ":" + String(n);

  await fetchCordRESTApi(
    "/v1/groups/" + group,
    "PUT",
    JSON.stringify({
      name: "Quiz Group for " + id,
    })
  );

  await Promise.all([
    fetchCordRESTApi(
      "/v1/users/" + human,
      "PUT",
      JSON.stringify({
        name: "Human",
        addGroups: [group],
      })
    ),
    fetchCordRESTApi(
      "/v1/users/" + bot,
      "PUT",
      JSON.stringify({
        name: "AI",
        addGroups: [group],
      })
    ),
  ]);

  return {
    cordAccessToken: getClientAuthToken(CORD_APPLICATION_ID, CORD_API_SECRET, {
      user_id: human,
    }),
    questions: questions.map((q, n) => ({ ...q, cordThreadID: thread(n) })),
  };
}

export default async function Home() {
  const data = await getQuizData();
  return (
    <main className={styles.main}>
      Quiz coming soon!<div>{JSON.stringify(data)}</div>
    </main>
  );
}
