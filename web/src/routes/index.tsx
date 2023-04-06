import { createQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";

const fetchTodos = async () => [1, 2, 3];

export default function Home() {
  const query = createQuery(() => ["todos"], fetchTodos);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Switch>
        <Match when={query.isError}>Error</Match>
        <Match when={query.isSuccess}>{query.data}</Match>
      </Switch>
    </main>
  );
}
