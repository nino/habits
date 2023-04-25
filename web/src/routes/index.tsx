import {
    createMutation,
    createQuery,
    useQueryClient,
} from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";
import { useSearchParams } from "solid-start";
import { Button, EntryList, LoginForm } from "~/components";
import { Entry, EntrySchema } from "~/Entry";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchEntries = async (): Promise<Entry[]> => {
    const response = await fetch(`${API_BASE_URL}/list/`, {
        mode: "cors",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }).then((r) => r.json());
    const parsed = response.map(EntrySchema.parse);
    return parsed;
};

const NewEntryForm = (props: { user: string }) => {
    const queryClient = useQueryClient();
    const submission = createMutation({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["fetchEntries"] });
        },
        mutationFn: async () =>
            await fetch(`${API_BASE_URL}/post`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                mode: "cors",
                method: "POST",
                body: JSON.stringify({ name: props.user }),
            }),
    });

    const handleSubmit = (evt: Event) => {
        evt.preventDefault();
        submission.mutate();
    };

    return (
        <form class="w-64 mx-auto my-4 flex flex-col" onSubmit={handleSubmit}>
            <Button>I did it!</Button>
            <Switch>
                <Match when={submission.isLoading}>Submitting…</Match>
                <Match when={submission.isSuccess}>Submitted</Match>
            </Switch>
        </form>
    );
};

export default function Home() {
    const query = createQuery(() => ["fetchEntries"], fetchEntries);
    const [params, setParams] = useSearchParams<{ user: string }>();

    return (
        <main class="container mx-auto text-gray-700 my-4">
            <Switch>
                <Match when={params.user}>
                    <h1 class="text-xl text-center">Hello {params.user}!</h1>
                    <NewEntryForm user={params.user ?? ""} />
                    <Switch>
                        <Match when={query.isSuccess}>
                            <EntryList
                                entries={query.data ?? []}
                                user={params.user ?? ""}
                            />
                        </Match>
                        <Match when={query.isError}>Error</Match>
                        <Match when={query.isLoading}>Loading…</Match>
                    </Switch>
                    <footer class="w-64 mx-auto my-4 flex">
                        <Button onClick={() => setParams({ user: undefined })}>
                            Log out
                        </Button>
                    </footer>
                </Match>
                <Match when={!params.user}>
                    <LoginForm onLogin={(user) => setParams({ user })} />
                </Match>
            </Switch>
        </main>
    );
}
