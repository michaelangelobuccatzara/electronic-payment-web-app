import { useId, useRef, useState, type FormEvent } from "react";
import {
  STUDENT_TYPES,
  STUDENT_TYPE_LABELS,
  isStudentType,
  type StudentType,
} from "../../data/studentOptions";
import { useAsyncAction } from "../../hooks/useAsyncAction";
import type { AddStudent } from "../../types/types";
import { AnimatedModal } from "../ui/AnimatedModal";
import { ErrorAlert } from "../ui/ErrorAlert";
import { Icon } from "../ui/Icon";
import { CONTROL_CLASS, Field, SECONDARY_BUTTON_CLASS } from "./StudentFormControls";
import { RfidScanInput } from "./RfidScanInput";

interface FormState {
  firstName: string;
  middleName: string;
  lastName: string;
  password: string;
  studentType: StudentType;
}

function createInitialForm(): FormState {
  return {
    firstName: "",
    middleName: "",
    lastName: "",
    password: "",
    studentType: STUDENT_TYPES[0],
  };
}

const NOT_A_SCAN_MESSAGE =
  "That didn't look like a card scan. Tap the card on the reader; typing the code isn't accepted.";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (student: AddStudent) => Promise<void>;
}

export function AddStudentModal({ isOpen, onClose, onAdd }: AddStudentModalProps) {
  const baseId = useId();
  const ids = {
    title: `${baseId}-title`,
    firstName: `${baseId}-first-name`,
    middleName: `${baseId}-middle-name`,
    lastName: `${baseId}-last-name`,
    password: `${baseId}-password`,
    studentType: `${baseId}-student-type`,
    rfid: `${baseId}-rfid`,
    rfidHint: `${baseId}-rfid-hint`,
  };

  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<FormState>(createInitialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [scannedCode, setScannedCode] = useState("");
  const [wasScanRejected, setWasScanRejected] = useState(false);
  const { run: enroll, isPending, error, reset: resetError } = useAsyncAction(onAdd);

  // Derived during render: the API error wins over the "not a scan" hint.
  const alertMessage = error ?? (wasScanRejected ? NOT_A_SCAN_MESSAGE : null);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const resetAll = () => {
    setForm(createInitialForm());
    setShowPassword(false);
    setScannedCode("");
    setWasScanRejected(false);
    resetError();
  };

  const handleClose = () => {
    resetAll();
    onClose();
  };

  // The API call starts here: only a card scan can trigger it.
  const handleScan = async (code: string) => {
    if (isPending) return; // ignore a second scan while the first request is running
    setWasScanRejected(false);
    resetError();

    // Shows the browser's own message on the first empty required field.
    // The scan is not kept: fill the field in, then scan again.
    if (formRef.current === null || !formRef.current.reportValidity()) return;

    setScannedCode(code);
    const enrolled = await enroll({
      firstName: form.firstName.trim(),
      middleName: form.middleName.trim(),
      lastName: form.lastName.trim(),
      password: form.password,
      studentType: form.studentType,
      rfid: code,
    });

    // On success the page closes the modal; on failure keep the form and ask for a new scan.
    if (enrolled) resetAll();
    else setScannedCode("");
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onEscape={handleClose}
      labelledBy={ids.title}
      maxWidthClassName="max-w-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h3 id={ids.title} className="font-headline-md text-headline-md font-bold text-on-surface">
            Enroll New Student
          </h3>
          <p className="font-body-sm text-body-sm text-outline">
            Fill in the details, then scan the student's RFID card to enroll.
          </p>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="p-1 rounded-md text-outline hover:text-on-surface"
        >
          <Icon name="close" className="text-body-lg" />
        </button>
      </div>

      {/* No submit button: enrolling is triggered by the scan. This only stops stray submits. */}
      <form
        ref={formRef}
        onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}
        className="flex flex-col gap-space-md mt-space-xs"
      >
        {/* Locks the ordinary fields during the request. The RFID field stays outside, so it keeps focus. */}
        <fieldset disabled={isPending} className="flex min-w-0 flex-col gap-space-md">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <Field htmlFor={ids.firstName} label="First Name">
              <input
                id={ids.firstName}
                type="text"
                required
                autoComplete="given-name"
                value={form.firstName}
                onChange={(event) => update("firstName", event.target.value)}
                placeholder="Juan"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field htmlFor={ids.middleName} label="Middle Name">
              <input
                id={ids.middleName}
                type="text"
                autoComplete="additional-name"
                value={form.middleName}
                onChange={(event) => update("middleName", event.target.value)}
                placeholder="Santos"
                className={CONTROL_CLASS}
              />
            </Field>
            <Field htmlFor={ids.lastName} label="Last Name">
              <input
                id={ids.lastName}
                type="text"
                required
                autoComplete="family-name"
                value={form.lastName}
                onChange={(event) => update("lastName", event.target.value)}
                placeholder="Dela Cruz"
                className={CONTROL_CLASS}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
            <Field htmlFor={ids.studentType} label="Student Type">
              <select
                id={ids.studentType}
                value={form.studentType}
                onChange={(event) => {
                  const next = event.target.value;
                  if (isStudentType(next)) update("studentType", next);
                }}
                className={CONTROL_CLASS}
              >
                {STUDENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {STUDENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </Field>

            <Field htmlFor={ids.password} label="Password">
              <div className="relative flex items-center">
                <input
                  id={ids.password}
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(event) => update("password", event.target.value)}
                  className={`${CONTROL_CLASS} w-full pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 text-outline hover:text-on-surface"
                >
                  <Icon name={showPassword ? "visibility_off" : "visibility"} className="text-body-md" />
                </button>
              </div>
            </Field>
          </div>
        </fieldset>

        <Field htmlFor={ids.rfid} label="RFID Card">
          <div className="relative flex items-center">
            <Icon
              name="contactless"
              className="pointer-events-none absolute left-3 text-body-lg text-outline"
            />
            <RfidScanInput
              id={ids.rfid}
              value={scannedCode}
              describedBy={ids.rfidHint}
              onScan={handleScan}
              onReject={() => setWasScanRejected(true)}
            />
          </div>
          <span id={ids.rfidHint} role="status" className="font-body-sm text-body-sm text-outline">
            {isPending
              ? "Enrolling student…"
              : "Click the field, then tap the card on the reader. The student is enrolled as soon as the card is read."}
          </span>
        </Field>

        {alertMessage !== null && <ErrorAlert message={alertMessage} />}

        <div className="flex items-center justify-end gap-space-sm pt-space-sm">
          <button type="button" onClick={handleClose} className={SECONDARY_BUTTON_CLASS}>
            Cancel
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}