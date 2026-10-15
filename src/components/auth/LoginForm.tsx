import { useState, type ChangeEvent, type FormEvent } from "react";
import type { LoginCredentials } from "../../types/types";

interface LoginFormProps {
  /** Should reject with an Error (ideally with a user-friendly message) when sign-in fails. */
  onSubmit: (credentials: LoginCredentials) => Promise<void>;
}

type Submission =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "error"; message: string };

const INPUT_CLASS =
  "h-10 w-full rounded-lg bg-surface-container-lowest pl-9 font-body-md text-body-md text-on-surface shadow-xs transition-all placeholder:text-outline focus:ring-2 focus:ring-primary focus:outline-hidden";

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);
  const [submission, setSubmission] = useState<Submission>({ status: "idle" });

  const isSubmitting = submission.status === "submitting";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    setShowRecoveryNotice(false);
    setSubmission({ status: "submitting" });

    try {
      await onSubmit({ username: username.trim(), password });
      // On success the page redirects, so this component unmounts.
      setSubmission({ status: "idle" });
    } catch (error) {
      setSubmission({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to sign in. Please try again.",
      });
    }
  }

  return (
    <div className="flex flex-col justify-center bg-surface-container-low p-space-lg md:col-span-7 md:p-space-xl">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-space-lg">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
            Sign In to Portal
          </h2>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            Enter your administrative credentials to continue.
          </p>
        </div>

        <form className="space-y-space-md" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="login-username"
              className="mb-1.5 block font-label-md text-label-md font-medium text-on-surface"
            >
              Username or Institutional Email
            </label>
            <div className="relative flex items-center">
              <span
                aria-hidden="true"
                className="material-symbols-outlined pointer-events-none absolute left-3 text-lg text-outline"
              >
                person
              </span>
              <input
                id="login-username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder="officer.id@ndtc.edu.ph"
                className={`${INPUT_CLASS} pr-3`}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1.5 block font-label-md text-label-md font-medium text-on-surface"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <span
                aria-hidden="true"
                className="material-symbols-outlined pointer-events-none absolute left-3 text-lg text-outline"
              >
                lock
              </span>
              <input
                id="login-password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Enter your security passkey"
                className={`${INPUT_CLASS} pr-10`}
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((visible) => !visible)}
                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                aria-pressed={isPasswordVisible}
                className="absolute right-2 rounded-xs p-1 text-outline transition-colors hover:text-on-surface focus-visible:ring-2 focus-visible:ring-primary focus:outline-hidden"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-lg leading-none">
                  {isPasswordVisible ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {submission.status === "error" ? (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg bg-error-container p-space-sm font-body-sm text-body-sm text-on-error-container"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm">
                error
              </span>
              {submission.message}
            </div>
          ) : showRecoveryNotice ? (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg bg-surface-container p-space-sm font-body-sm text-body-sm text-on-surface"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-sm text-primary">
                info
              </span>
              Please request administrative password reset through IT Services (ext. 104).
            </div>
          ) : null}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary-container font-label-md text-label-md font-semibold text-on-primary shadow-xs transition-all hover:opacity-90 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus:outline-hidden active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75"
            >
              <span
                aria-hidden="true"
                className={`material-symbols-outlined text-base ${isSubmitting ? "animate-spin" : ""}`}
              >
                {isSubmitting ? "progress_activity" : "login"}
              </span>
              <span>{isSubmitting ? "Authenticating..." : "Sign In"}</span>
            </button>
          </div>
        </form>

        <aside className="mt-space-lg rounded-lg bg-surface-container-lowest p-space-md shadow-xs">
          <div className="flex items-start gap-space-xs">
            <span aria-hidden="true" className="material-symbols-outlined mt-0.5 text-base text-primary">
              help_outline
            </span>
            <div>
              <p className="font-label-sm text-label-sm font-semibold text-on-surface-variant uppercase">
                Administrative Support
              </p>
              <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                Need technical assistance? Contact School IT Office ext. 104
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}