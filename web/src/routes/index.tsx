import { createQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";

const fetchTodos = async () =>
  fetch("http://0.0.0.0:3030/api/list").then((r) => r.json());

export default function Home() {
  const query = createQuery(() => ["todos"], fetchTodos);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Switch>
        <Match when={query.isError}>Error</Match>
        <Match when={query.isFetched}>{JSON.stringify(query.data)}</Match>
      </Switch>
    </main>
  );
}
