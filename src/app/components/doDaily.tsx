"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import PsychologyIcon from "@mui/icons-material/Psychology";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import BoltIcon from "@mui/icons-material/Bolt";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FaceIcon from "@mui/icons-material/Face";

const benefits = [
  { label: "Better Focus", icon: <PsychologyIcon /> },
  { label: "Sharper Memory", icon: <GpsFixedIcon /> },
  { label: "Improved Speed", icon: <BoltIcon /> },
  { label: "Greater Confidence", icon: <SentimentSatisfiedAltIcon /> },
];

const highlights = [
  { label: "10 Minutes", icon: <GroupsIcon /> },
  { label: "Every Day", icon: <CalendarMonthIcon /> },
  { label: "For Everyone", icon: <FaceIcon /> },
];

export default function WhatIsDoDaily() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }} sx={{alignItems:"center"}}>
          {/* Left */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: "#0f3d24", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 1.5 }}
            >
              What is <Box component="span" sx={{ color: "var(--primary)" }}>Do Daily?</Box>
            </Typography>

            <Typography sx={{ color: "#3f5a4a", lineHeight: 1.7, fontSize: { xs: "1rem", md: "1.1rem" }, mb: 3 }}>
              Do Daily is a daily mental fitness initiative designed to stimulate the brain through
              simple, focused exercises that take just 10 minutes a day.
            </Typography>

           <Stack
  direction="row"
  sx={{
    flexWrap: "wrap",
    gap: { xs: 2, sm: 4 },
    bgcolor: "var(--primary-light)",
    borderRadius: 4,
    px: 3,
    py: 1.5,
    width: "fit-content",
    maxWidth: "100%",
  }}
>
              {highlights.map(({ label, icon }) => (
                <Stack key={label} direction="row"  spacing={1} sx={{ color: "var(--primary)",alignItems:"center" }}>
                  {icon}
                  <Typography sx={{ fontWeight: 700, color: "#0f3d24", fontSize: "0.95rem" }}>{label}</Typography>
                </Stack>
              ))}
            </Stack>
          </Grid>

          {/* Right */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Grid container rowSpacing={3}>
              {benefits.map(({ label, icon }, i) => (
                <Grid
                  key={label}
                  size={{ xs: 6, sm: 3 }}
                  sx={{
                    textAlign: "center",
                    borderLeft: { xs: "none", sm: i === 0 ? "none" : "1px solid #16a34a33" },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 64, md: 76 },
                      height: { xs: 64, md: 76 },
                      mx: "auto",
                      mb: 1,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      bgcolor: "var(--primary-light)",
                      color: "var(--primary)",
                      "& svg": { fontSize: { xs: 34, md: 42 } },
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography sx={{ fontWeight: 600, color: "#0f3d24", fontSize: { xs: "0.9rem", md: "1rem" } }}>
                    {label}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}