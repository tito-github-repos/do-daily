"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerOutlinedIcon from "@mui/icons-material/TimerOutlined";
import SpeedIcon from "@mui/icons-material/Speed";

const DIVIDER = "1px solid #16a34a33";

function MaskIcon({ src }: { src: string }) {
  return (
    <Box
      sx={{
        width: { xs: 22, md: 28 },
        height: { xs: 22, md: 28 },
        bgcolor: "currentColor",
        WebkitMask: `url(${src}) center / contain no-repeat`,
        mask: `url(${src}) center / contain no-repeat`,
      }}
    />
  );
}

const benefits = [
  { label: "Better Focus", icon: <MaskIcon src="/target-icon.svg" /> },
  { label: "Sharper Memory", icon: <MaskIcon src="/innovative-brain-icon.svg" /> },
  { label: "Improved Speed", icon: <SpeedIcon /> },
  { label: "Greater Confidence", icon: <SentimentSatisfiedAltIcon /> },
];

const highlights = [
  { label: "10 Minutes", icon: <TimerOutlinedIcon /> },
  { label: "Every Day", icon: <CalendarMonthIcon /> },
  { label: "For Everyone", icon: <GroupsIcon /> },
];

export default function WhatIsDoDaily() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{ alignItems: "center" }}>
          {/* Left */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 800,
                color: "#0f3d24",
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                mb: 1.5,
              }}
            >
              What is{" "}
              <Box component="span" sx={{ color: "var(--primary)" }}>
                Do Daily?
              </Box>
            </Typography>

            <Typography
              sx={{
                color: "#3f5a4a",
                lineHeight: 1.7,
                fontSize: { xs: "1rem", md: "1.1rem" },
                mb: 3,
              }}
            >
              Do Daily is a daily mental fitness initiative designed to stimulate the brain
              through simple, focused exercises that take just 10 minutes a day.
            </Typography>

            <Stack
              direction="row"
              sx={{
                flexWrap: "wrap",
                gap: { xs: 1.5, sm: 4 },
                bgcolor: "var(--primary-light)",
                borderRadius: 4,
                px: { xs: 2, sm: 3 },
                py: 1.5,
                width: "fit-content",
                maxWidth: "100%",
              }}
            >
              {highlights.map(({ label, icon }) => (
                <Stack
                  key={label}
                  direction="row"
                  spacing={1}
                  sx={{ color: "var(--primary)", alignItems: "center" }}
                >
                  {icon}
                  <Typography sx={{ fontWeight: 700, color: "#0f3d24", fontSize: "0.95rem" }}>
                    {label}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Right: 2 x 2, icon next to text, with divider */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              borderTop: { xs: DIVIDER, md: "none" },
              borderLeft: { xs: "none", md: DIVIDER },
              pt: { xs: 4, md: 0 },
              pl: { md: 4, lg: 6 },
            }}
          >
            <Grid container spacing={{ xs: 2, md: 3 }}>
              {benefits.map(({ label, icon }) => (
                <Grid key={label} size={{ xs: 6 }} sx={{ minWidth: 0 }}>
                  <Stack direction="row" spacing={{ xs: 1, md: 1.5 }} sx={{ alignItems: "center" }}>
                    <Box
                      sx={{
                        width: { xs: 40, md: 52 },
                        height: { xs: 40, md: 52 },
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "var(--primary-light)",
                        color: "var(--primary)",
                        "& svg": { fontSize: { xs: 22, md: 28 } },
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#0f3d24",
                        fontSize: { xs: "0.85rem", md: "1rem" },
                        lineHeight: 1.3,
                        minWidth: 0,
                      }}
                    >
                      {label}
                    </Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}