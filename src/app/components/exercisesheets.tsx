"use client";
import { useEffect, useState } from "react";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GroupsIcon from "@mui/icons-material/Groups";
import { PREFILL_EVENT, REGISTERED_EVENT } from "@/lib/events";
import DownloadDialog from "./downloadDialog";

const DIVIDER = "1px solid #16a34a33";

// Put this in /public/images: the meditating-girl illustration
const ILLUSTRATION = "/images/do-daily-illustration.png";

const buttonSx = {
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
} as const;

export default function ExerciseSheets() {
  const [registered, setRegistered] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // On load: ask the server whether this visitor already has access
  useEffect(() => {
    let active = true;

    fetch("/api/access", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.registered) setRegistered(true);
      })
      .catch(() => {});

    // The registration form fires this when it succeeds
    const onRegistered = () => setRegistered(true);
    window.addEventListener(REGISTERED_EVENT, onRegistered);

    return () => {
      active = false;
      window.removeEventListener(REGISTERED_EVENT, onRegistered);
    };
  }, []);

  // "Register now" inside the popup: close it, scroll to the form, pre-fill the email
  const handleRegisterFromDialog = (email: string) => {
    setDialogOpen(false);
    // wait for the dialog's scroll lock to release before scrolling
    window.setTimeout(() => {
      document
        .getElementById("register")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (email) {
        window.dispatchEvent(
          new CustomEvent(PREFILL_EVENT, { detail: { email } }),
        );
      }
    }, 300);
  };

  return (
    <Box
      component="section"
      id="exercises"
      sx={{
        bgcolor: "var(--primary-light)",
        py: { xs: 5, md: 8 },
        scrollMarginTop: { xs: 64, md: 80 },
      }}
    >
      <Container maxWidth="lg">
        <Grid
          container
          spacing={{ xs: 4, lg: 0 }}
          sx={{ alignItems: "center" }}
        >
          {/* Left: text (full width until lg) */}
          <Grid size={{ xs: 12, lg: 5 }} sx={{ pr: { lg: 4 } }}>
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
                color: "var(--primary)",
                fontSize: { xs: "1.9rem", md: "2.5rem" },
                mb: 2,
              }}
            >
              Warm up your brain
            </Typography>
            <Typography
              sx={{
                color: "#3f5a4a",
                lineHeight: 1.7,
                fontSize: { xs: "1rem", md: "1.1rem" },
                mb: 1.5,
              }}
            >
              We do warming up exercises before any game we play. The same goes
              for any mental work, say before a 2 or 3 hour exam.
            </Typography>
            <Typography
              sx={{
                color: "#3f5a4a",
                lineHeight: 1.7,
                fontSize: { xs: "1rem", md: "1.1rem" },
              }}
            >
              Practise these 2 exercises daily, anytime, anywhere, when you want
              to focus.
            </Typography>
          </Grid>

          {/* Middle: illustration */}
          <Grid
            size={{ xs: 12, sm: 6, lg: 3.5 }}
            sx={{
              textAlign: "center",
              px: { sm: 2 },
              borderRight: { xs: "none", sm: DIVIDER },
            }}
          >
            <Box
              component="img"
              src={ILLUSTRATION}
              alt="Person meditating with a glowing brain"
              sx={{
                width: "100%",
                maxWidth: { xs: 240, sm: 280, lg: 300 },
                height: "auto",
                display: "block",
                mx: "auto",
              }}
            />
          </Grid>

          {/* Right: download card */}
          <Grid size={{ xs: 12, sm: 6, lg: 3.5 }} sx={{ pl: { sm: 2, lg: 3 } }}>
            <Box
              sx={{
                borderRadius: 4,
                p: { xs: 1, sm: 2, md: 4 },
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: { xs: 56, md: 64 },
                  height: { xs: 56, md: 64 },
                  mx: "auto",
                  mb: 1.5,
                  borderRadius: "50%",
                  display: "grid",
                  placeItems: "center",
                  bgcolor: "#16a34a26",
                  color: "#0f6b3a",
                  "& svg": { fontSize: { xs: 30, md: 34 } },
                }}
              >
                <DescriptionOutlinedIcon />
              </Box>
              <Typography
                sx={{
                  fontWeight: 800,
                  color: "#0f3d24",
                  fontSize: { xs: "1.05rem", md: "1.15rem" },
                  mb: 0.5,
                }}
              >
                Exercise 1 &amp; Exercise 2
              </Typography>
              <Typography sx={{ color: "#3f5a4a", mb: 2.5 }}>
                Simple. Focused. Effective.
              </Typography>

              {registered ? (
                <Button
                  component="a"
                  href="/api/download"
                  download
                  variant="contained"
                  fullWidth
                  startIcon={<DownloadIcon />}
                  sx={buttonSx}
                >
                  Download Exercise Sheet
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  variant="contained"
                  fullWidth
                  startIcon={<DownloadIcon />}
                  sx={buttonSx}
                >
                  Download Exercise Sheet
                </Button>
              )}

              {/* Share line, right under the download button */}
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <GroupsIcon
                  sx={{ fontSize: 20, color: "var(--primary)", flexShrink: 0 }}
                />
                <Typography
                  sx={{
                    color: "#0f3d24",
                    fontWeight: 600,
                    lineHeight: 1.4,
                    fontSize: { xs: "0.85rem", md: "0.9rem" },
                    textAlign: "left",
                  }}
                >
                  Feeling sharper? Let your friends and family try it too.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <DownloadDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onVerified={() => setRegistered(true)}
        onRegister={handleRegisterFromDialog}
      />
    </Box>
  );
}