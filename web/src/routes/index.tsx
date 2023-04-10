import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { createSignal, JSX, Match, Switch } from "solid-js";

const fetchEntries = async () =>
  fetch("http://0.0.0.0:3030/api/list/", {
    mode: "cors",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());

type InputProps = {
  name: string;
  value: string;
  setValue: (newValue: string) => void;
  label: string;
};
const Input = (props: InputProps) => (
  <label class="flex flex-col items-start w-full grow m-1">
    <span>{props.label}</span>
    <input
      type="text"
      name={props.name}
      value={props.value}
      onkeyup={(evt) => props.setValue(evt.currentTarget.value)}
      class="border rounded px-1 grow w-full"
    />
  </label>
);

const Button = (props: { children: JSX.Element; onClick: () => void }) => (
  <button
    class="bg-teal-200 m-1 rounded py-0.5 px-3 active:translate-y-1 w-full"
    onclick={props.onClick}
  >
    {props.children}
  </button>
);

const NewEntryForm = () => {
  const queryClient = useQueryClient();
  const [name, setName] = createSignal<string>("");
  const submission = createMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetchEntries"] });
    },
    mutationFn: () =>
      fetch("http://0.0.0.0:3030/api/post", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        mode: "cors",
        method: "POST",
        body: JSON.stringify({ name: name() }),
      }),
  });

  const handleSubmit = (evt: Event) => {
    evt.preventDefault();
    submission.mutate();
  };

  return (
    <form class="w-64 mx-auto my-4 flex flex-col" onsubmit={handleSubmit}>
      <Input name="name" label="User" value={name()} setValue={setName} />
      <Button onClick={() => undefined}>Submit</Button>
      <Switch>
        <Match when={submission.isLoading}>Submitting…</Match>
        <Match when={submission.isSuccess}>Submitted</Match>
      </Switch>
    </form>
  );
};

export default function Home() {
  const query = createQuery(() => ["fetchEntries"], fetchEntries);

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <NewEntryForm />
      <Switch>
        <Match when={query.isSuccess}>{JSON.stringify(query.data)}</Match>
        <Match when={query.isError}>Error</Match>
        <Match when={query.isLoading}>Loading…</Match>
      </Switch>
    </main>
  );
}
