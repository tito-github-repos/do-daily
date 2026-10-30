"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import DownloadIcon from "@mui/icons-material/Download";
import { Turnstile } from "@marsidev/react-turnstile";
import type { TurnstileInstance } from "@marsidev/react-turnstile";
import { ValidationError } from "yup";
import { registrationSchema } from "@/lib/validation";
import { PREFILL_EVENT, REGISTERED_EVENT } from "@/lib/events";
import { SuccessDialog, AlreadyRegisteredDialog } from "./downloadDialog";

type FieldName = "name" | "email" | "phone";
type Values = Record<FieldName, string> & { website: string };
type Errors = Partial<Record<FieldName, string>>;

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const PHONE_MAX = 10;

const EMPTY_VALUES: Values = { name: "", email: "", phone: "", website: "" };

const FEATURES = [
  { icon: BoltIcon, title: "Fast", text: "Ready in a minute." },
  { icon: FavoriteBorderIcon, title: "Healthy Habits", text: "Small steps, daily." },
  { icon: DownloadIcon, title: "Free Sheet", text: "Yours instantly." },
];

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "var(--white)",
    "&.Mui-focused fieldset": { borderColor: "var(--primary)" },
  },
  "& label.Mui-focused": { color: "var(--primary)" },
} as const;

// Digits only, max 10. For pasted text, also drop a +91 / 0 prefix.
function cleanPhone(raw: string, fromPaste = false): string {
  let digits = raw.replace(/\D/g, "");
  if (fromPaste) {
    if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
    else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  }
  return digits.slice(0, PHONE_MAX);
}

// Runs the shared Yup schema (synchronously) and returns a field -> message map
function getErrors(values: Values): Errors {
  try {
    registrationSchema.validateSync(values, {
      abortEarly: false,
      stripUnknown: true,
    });
    return {};
  } catch (err) {
    const errors: Errors = {};
    if (err instanceof ValidationError) {
      for (const inner of err.inner) {
        const key = inner.path as FieldName | undefined;
        if (key && !errors[key]) errors[key] = inner.message;
      }
    }
    return errors;
  }
}

export default function Register() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [alreadyOpen, setAlreadyOpen] = useState(false);
  const [registeredName, setRegisteredName] = useState("");
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Turnstile needs about 300px, so use the compact widget on very small phones
  const tinyScreen = useMediaQuery("(max-width:359px)");

  // Validation runs on every change because it is derived from the current values
  const errors = useMemo(() => getErrors(values), [values]);

  const showError = (field: FieldName) =>
    touched[field] || submitted ? errors[field] : undefined;

  // The download popup can send the email the visitor already typed
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const email = (e as CustomEvent<{ email?: string }>).detail?.email;
      if (!email) return;
      setValues((prev) => ({ ...prev, email }));
      setTouched((prev) => ({ ...prev, email: true }));
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const setField = (field: keyof Values, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field !== "website") setTouched((prev) => ({ ...prev, [field]: true }));
    setServerError("");
  };

  const handleChange =
    (field: keyof Values) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setField(field, e.target.value);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setField("phone", cleanPhone(e.target.value));

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    setField("phone", cleanPhone(e.clipboardData.getData("text"), true));
  };

  const resetTurnstile = () => {
    setToken("");
    turnstileRef.current?.reset();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;

    setServerError("");
    setSubmitted(true);

    if (Object.keys(errors).length > 0) return;

    if (!token) {
      setServerError("Please complete the security check.");
      return;
    }

    setSubmitting(true);
    let ok = false;
    let already = false;

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          website: values.website, // honeypot, should always be empty
          turnstileToken: token,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        ok = true;
      } else if (res.status === 409 && data?.alreadyRegistered) {
        already = true;
      } else {
        setServerError(data?.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    }

    if (ok || already) {
      if (ok) {
        setRegisteredName(values.name.trim().split(" ")[0] ?? "");
        setSuccessOpen(true);
      } else {
        setAlreadyOpen(true);
      }
      // clear the form for the next visitor
      setValues(EMPTY_VALUES);
      setTouched({});
      setSubmitted(false);
      // unlock the download card on the page (the API already set the cookie)
      window.dispatchEvent(new Event(REGISTERED_EVENT));
    }

    resetTurnstile(); // tokens are single-use
    setSubmitting(false);
  };

  return (
    <Box
      component="section"
      id="register"
      sx={{
        py: { xs: 5, md: 0 },
        scrollMarginTop: { xs: 64, md: 80 },
        overflowX: "hidden",
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, md: 6 }}
          sx={{
            // alignItems: "center",
            py: { xs: 2.5, sm: 4, md: 6 },
          }}
        >
          {/* Left: copy + features */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                width: 56,
                height: 3,
                bgcolor: "var(--primary)",
                borderRadius: 2,
                mb: 1.5,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#0f3d24",
                fontSize: { xs: "1.8rem", md: "2.29rem" },
                mb: 1.5,
              }}
            >
              Register to{" "}
              <Box component="span" sx={{ color: "var(--primary)" }}>
                get started
              </Box>
            </Typography>
            <Typography
              sx={{
                color: "#3f5a4a",
                lineHeight: 1.7,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Your free Do Daily exercise sheet is one step away.
            </Typography>

            {/* Feature list */}
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                m: 0,
                mt: { xs: 2.5, md: 3.5 },
                p: 0,
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, 1fr)",
                  md: "1fr",
                },
                gap: { xs: 1.5, sm: 2, md: 2.5 },
              }}
            >
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <Box
                  component="li"
                  key={title}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: { xs: 1.5, md: 2 },
                  }}
                >
                  <Box
                    sx={{
                      flexShrink: 0,
                      width: { xs: 40, md: 48 },
                      height: { xs: 40, md: 48 },
                      borderRadius: "50%",
                      bgcolor: "rgba(22, 163, 74, 0.14)",
                      color: "var(--primary)",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 20, md: 24 } }} />
                  </Box>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: "var(--primary)",
                        fontSize: { xs: "0.95rem", md: "1.05rem" },
                        lineHeight: 1.3,
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      sx={{
                        color: "#3f5a4a",
                        fontSize: { xs: "0.85rem", md: "0.9rem" },
                        lineHeight: 1.4,
                      }}
                    >
                      {text}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Right: form */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ minWidth: 0 }}>
            <Box
              sx={{
                bgcolor: "var(--white)",
                borderRadius: 3,
                p: { xs: 2, sm: 4 },
                boxShadow: "0 6px 24px rgba(15, 61, 36, 0.08)",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                sx={{ position: "relative", display: "grid", gap: 2.5 }}
              >
                {/* Honeypot: off-screen, not display:none, hidden from users and screen readers */}
                <Box
                  aria-hidden="true"
                  sx={{
                    position: "absolute",
                    left: "-9999px",
                    width: 1,
                    height: 1,
                    overflow: "hidden",
                  }}
                >
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.website}
                    onChange={handleChange("website")}
                  />
                </Box>

                <TextField
                  label="Full name"
                  name="name"
                  autoComplete="name"
                  value={values.name}
                  onChange={handleChange("name")}
                  error={Boolean(showError("name"))}
                  helperText={showError("name")}
                  fullWidth
                  required
                  sx={fieldSx}
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={handleChange("email")}
                  error={Boolean(showError("email"))}
                  helperText={showError("email")}
                  fullWidth
                  required
                  sx={fieldSx}
                />

                <TextField
                  label="Phone number"
                  name="phone"
                  type="tel"
                  autoComplete="tel-national"
                  placeholder="10-digit mobile number"
                  value={values.phone}
                  onChange={handlePhoneChange}
                  error={Boolean(showError("phone"))}
                  helperText={showError("phone")}
                  slotProps={{
                    htmlInput: {
                      inputMode: "numeric",
                      pattern: "[0-9]*",
                      maxLength: PHONE_MAX,
                      onPaste: handlePhonePaste,
                    },
                  }}
                  fullWidth
                  required
                  sx={fieldSx}
                />

                {/* Cloudflare Turnstile */}
                <Box sx={{ minHeight: 65, width: "100%", overflow: "hidden" }}>
                  {SITE_KEY ? (
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={SITE_KEY}
                      options={{
                        theme: "light",
                        size: tinyScreen ? "compact" : "flexible",
                      }}
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

                {serverError && <Alert severity="error">{serverError}</Alert>}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={submitting}
                  sx={{
                    bgcolor: "var(--primary)",
                    color: "var(--white)",
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1.05rem",
                    borderRadius: 999,
                    py: 1.4,
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
                  }}
                >
                  {submitting ? (
                    <CircularProgress size={24} sx={{ color: "var(--white)" }} />
                  ) : (
                    "Register"
                  )}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <SuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        name={registeredName}
      />

      <AlreadyRegisteredDialog
        open={alreadyOpen}
        onClose={() => setAlreadyOpen(false)}
      />
    </Box>
  );
}