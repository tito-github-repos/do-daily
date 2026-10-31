"use client";
import { useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import DownloadIcon from "@mui/icons-material/Download";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ValidationError } from "yup";
import { emailSchema } from "@/lib/validation";
import { downloadSheet } from "@/lib/downloadSheet";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const LABEL_ID = "dd-dialog-title";

const primaryButtonSx = {
  bgcolor: "var(--primary)",
  color: "var(--white)",
  textTransform: "none",
  fontWeight: 600,
  borderRadius: 999,
  py: 1.25,
  boxShadow: "0 6px 16px #16a34a59",
  "&:hover": {
    bgcolor: "var(--primary)",
    filter: "brightness(0.92)",
  },
  "&.Mui-disabled": {
    bgcolor: "var(--primary)",
    color: "var(--white)",
    opacity: 0.7,
  },
} as const;

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    "&.Mui-focused fieldset": { borderColor: "var(--primary)" },
  },
  "& label.Mui-focused": { color: "var(--primary)" },
} as const;

const titleSx = {
  fontWeight: 800,
  color: "#0f3d24",
  fontSize: "1.4rem",
  mb: 1,
} as const;

function getEmailError(value: string): string {
  try {
    emailSchema.validateSync(value);
    return "";
  } catch (err) {
    return err instanceof ValidationError ? err.message : "Enter a valid email address";
  }
}

/* ---------- shared pieces ---------- */

type ShellProps = {
  open: boolean;
  onClose: () => void;
  onExited?: () => void;
  children: React.ReactNode;
};

function DialogShell({ open, onClose, onExited, children }: ShellProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby={LABEL_ID}
      maxWidth={false}
      slotProps={{
        paper: {
          sx: { borderRadius: 3, m: 2, width: "calc(100% - 32px)", maxWidth: 440 },
        },
        transition: { onExited },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={onClose}
        sx={{ position: "absolute", top: 8, right: 8, color: "#3f5a4a" }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ p: { xs: 3, sm: 4 }, pt: { xs: 5, sm: 5 } }}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

function SuccessBody({ title, message }: { title: string; message: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (busy) return;

    setBusy(true);
    setError("");
    const result = await downloadSheet();
    setBusy(false);

    if (result === "unauthorized") {
      setError("Your access has expired. Please close this and verify your email again.");
    } else if (result === "error") {
      setError("The file couldn't be downloaded right now. Please try again.");
    }
  };

  return (
    <Box sx={{ textAlign: "center" }}>
      <CheckCircleIcon sx={{ fontSize: 56, color: "var(--primary)", mb: 1 }} />
      <Typography id={LABEL_ID} component="h2" sx={titleSx}>
        {title}
      </Typography>
      <Typography sx={{ color: "#3f5a4a", mb: 3 }}>{message}</Typography>
      <Button
        type="button"
        onClick={handleDownload}
        disabled={busy}
        variant="contained"
        fullWidth
        startIcon={
          busy ? (
            <CircularProgress size={18} sx={{ color: "var(--white)" }} />
          ) : (
            <DownloadIcon />
          )
        }
        sx={primaryButtonSx}
      >
        Download Exercise Sheet
      </Button>
      {error && (
        <Alert severity="error" sx={{ mt: 2, textAlign: "left" }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

/* ---------- popup shown right after registration ---------- */

type SuccessDialogProps = {
  open: boolean;
  onClose: () => void;
  name?: string;
  alreadyRegistered?: boolean;
};

export function SuccessDialog({
  open,
  onClose,
  name,
  alreadyRegistered = false,
}: SuccessDialogProps) {
  const greeting = name ? `, ${name}` : "";

  return (
    <DialogShell open={open} onClose={onClose}>
      <SuccessBody
        title={
          alreadyRegistered
            ? `You're already registered${greeting}!`
            : `You're registered${greeting}!`
        }
        message={
          alreadyRegistered
            ? "This email is already registered with Do Daily. Your exercise sheet is ready."
            : "Thank you for joining Do Daily. Your exercise sheet is ready."
        }
      />
    </DialogShell>
  );
}

/* ---------- popup shown when someone clicks Download ---------- */

type Step = "email" | "notfound" | "verified";

type DownloadDialogProps = {
  open: boolean;
  onClose: () => void;
  onVerified: () => void;
  onRegister: (email: string) => void;
};

export default function DownloadDialog({
  open,
  onClose,
  onVerified,
  onRegister,
}: DownloadDialogProps) {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const emailError = getEmailError(email);
  const shownError = touched ? emailError : "";

  // runs after the close animation finishes, so the content doesn't flash
  const reset = () => {
    setStep("email");
    setEmail("");
    setTouched(false);
    setChecking(false);
    setError("");
    setToken("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (checking) return;

    setTouched(true);
    setError("");

    if (emailError) return;
    if (!token) {
      setError("Please complete the security check.");
      return;
    }

    setChecking(true);
    try {
      const res = await fetch("/api/access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken: token }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        if (data.registered) {
          setStep("verified");
          onVerified();
        } else {
          setStep("notfound");
        }
        setChecking(false);
        return;
      }

      setError(data?.message ?? "Something went wrong. Please try again.");
    } catch {
      setError("Network error. Please check your connection and try again.");
    }

    setChecking(false);
    setToken("");
    turnstileRef.current?.reset(); // tokens are single-use
  };

  const backToEmail = () => {
    setStep("email");
    setToken("");
    setError("");
  };

  return (
    <DialogShell open={open} onClose={onClose} onExited={reset}>
      {step === "verified" && (
        <SuccessBody
          title="Email verified"
          message="Welcome back! Your exercise sheet is ready."
        />
      )}

      {step === "notfound" && (
        <Box sx={{ textAlign: "center" }}>
          <PersonAddAltIcon sx={{ fontSize: 56, color: "var(--primary)", mb: 1 }} />
          <Typography id={LABEL_ID} component="h2" sx={titleSx}>
            You&apos;re not registered yet
          </Typography>
          <Typography sx={{ color: "#3f5a4a", mb: 3, wordBreak: "break-word" }}>
            We couldn&apos;t find {email.trim()} in our registrations. Please
            register to download the exercise sheet.
          </Typography>
          <Button
            type="button"
            variant="contained"
            fullWidth
            onClick={() => onRegister(email.trim())}
            sx={{ ...primaryButtonSx, mb: 1 }}
          >
            Register now
          </Button>
          <Button
            type="button"
            fullWidth
            onClick={backToEmail}
            sx={{ textTransform: "none", color: "#3f5a4a" }}
          >
            Try another email
          </Button>
        </Box>
      )}

      {step === "email" && (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "grid", gap: 2.5 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography id={LABEL_ID} component="h2" sx={titleSx}>
              Download exercise sheet
            </Typography>
            <Typography sx={{ color: "#3f5a4a" }}>
              Enter the email you registered with to get your download.
            </Typography>
          </Box>

          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setTouched(true); // validate on every change
              setError("");
            }}
            error={Boolean(shownError)}
            helperText={shownError}
            fullWidth
            required
            sx={fieldSx}
          />

          <Box sx={{ minHeight: 65 }}>
            {SITE_KEY ? (
              <Turnstile
                ref={turnstileRef}
                siteKey={SITE_KEY}
                options={{ theme: "light", size: "flexible" }}
                onSuccess={setToken}
                onExpire={() => setToken("")}
                onError={() => setToken("")}
              />
            ) : (
              <Alert severity="warning">
                Turnstile site key is missing (NEXT_PUBLIC_TURNSTILE_SITE_KEY).
              </Alert>
            )}
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={checking}
            sx={primaryButtonSx}
          >
            {checking ? (
              <CircularProgress size={24} sx={{ color: "var(--white)" }} />
            ) : (
              "Continue"
            )}
          </Button>

          <Typography sx={{ textAlign: "center", color: "#3f5a4a", fontSize: "0.9rem" }}>
            Not registered yet?{" "}
            <Box
              component="button"
              type="button"
              onClick={() => onRegister(emailError ? "" : email.trim())}
              sx={{
                border: 0,
                bgcolor: "transparent",
                p: 0,
                font: "inherit",
                fontWeight: 700,
                color: "var(--primary)",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Register
            </Box>
          </Typography>
        </Box>
      )}
    </DialogShell>
  );
}

export function AlreadyRegisteredDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <DialogShell open={open} onClose={onClose}>
      <SuccessBody
        title="You're already registered"
        message="This email is already registered with us. You can download your exercise sheet below."
      />
    </DialogShell>
  );
}