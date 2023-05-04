import { createMemo, createSignal, For, JSX, Switch, Match } from "solid-js";
import { Entry } from "./Entry";

type InputProps = {
    name: string;
    value: string;
    setValue: (newValue: string) => void;
    label: string;
};
export const Input = (props: InputProps) => (
    <label class="flex flex-col items-start w-full grow m-1">
        <span>{props.label}</span>
        <input
            type="text"
            name={props.name}
            value={props.value}
            onKeyUp={(evt) => props.setValue(evt.currentTarget.value)}
            class="border rounded px-1 grow w-full"
        />
    </label>
);

export const Button = (props: {
    children: JSX.Element;
    onClick?: () => void;
}) => (
    <button
        class="bg-teal-200 m-1 rounded py-0.5 px-3 active:translate-y-1 w-full"
        onClick={() => props.onClick?.()}
    >
        {props.children}
    </button>
);

type LoginFormProps = {
    onLogin: (user: string) => void;
};

export const LoginForm = (props: LoginFormProps) => {
    const [user, setUser] = createSignal<string>("");

    return (
        <form
            class="w-64 mx-auto my-4 flex flex-col"
            onSubmit={(event) => {
                event.preventDefault();
                props.onLogin(user());
            }}
        >
            <Input
                value={user()}
                setValue={(user) => setUser(user)}
                name="user"
                label="Username"
            />
            <Button>Log in</Button>
        </form>
    );
};

function DeleteButton(props: { onDelete: () => void }): JSX.Element {
    const [isConfirming, setIsConfirming] = createSignal(false);
    return (
        <>
            <Switch>
                <Match when={!isConfirming()}>
                    <Button onClick={() => setIsConfirming(true)}>
                        Delete
                    </Button>
                </Match>
                <Match when={isConfirming()}>
                    <Button>Really?</Button>
                    <Button onClick={() => setIsConfirming(false)}>
                        Cancel
                    </Button>
                </Match>
            </Switch>
        </>
    );
}

export const EntryList = (props: { entries: Entry[]; user: string }) => {
    const myEntries = createMemo(() =>
        props.entries.filter((entry) => entry.name === props.user)
    );
    return (
        <ul class="list-disc list-inside">
            <For each={myEntries()} fallback={<div>No entries yet.</div>}>
                {(entry: Entry) => (
                    <li>
                        <div class="inline-flex">
                            <div class="flex">{entry.created_at.format()}</div>
                            <div>
                                <DeleteButton onDelete={() => undefined} />
                            </div>
                        </div>
                    </li>
                )}
            </For>
        </ul>
    );
};
