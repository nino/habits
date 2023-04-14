import { createSignal, JSX } from "solid-js";

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
      onkeyup={(evt) => props.setValue(evt.currentTarget.value)}
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
    onclick={props.onClick}
  >
    {props.children}
  </button>
);

export const LoginForm = (props: { onLogin: (user: string) => void }) => {
  const [user, setUser] = createSignal<string>("");

  return (
    <form
      class="w-64 mx-auto my-4 flex flex-col"
      onsubmit={() => props.onLogin(user())}
    >
      <Input value={user()} setValue={setUser} name="user" label="Username" />
      <Button>Log in</Button>
    </form>
  );
};
