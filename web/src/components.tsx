import { createMemo, createSignal, For, JSX } from "solid-js";
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
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

export const LoginForm = (props: { onLogin: (user: string) => void }) => {
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
                setValue={setUser}
                name="user"
                label="Username"
            />
            <Button>Log in</Button>
        </form>
    );
};

export const EntryList = (props: { entries: Entry[]; user: string }) => {
    const myEntries = createMemo(() =>
        props.entries.filter((entry) => entry.name === props.user)
    );
    return (
        <ul>
            <For each={myEntries()} fallback={<div>No entries yet.</div>}>
                {(entry: Entry) => <li>{entry.created_at.format()}</li>}
            </For>
        </ul>
    );
};
