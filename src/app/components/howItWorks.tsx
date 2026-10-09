"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TimerIcon from "@mui/icons-material/Timer";
import EditIcon from "@mui/icons-material/Edit";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EditNoteIcon from "@mui/icons-material/EditNote";

const steps = [
  {
    no: "01",
    icon: <CalendarMonthIcon />,
    title: "Practice Daily",
    text: "Spend just 10 minutes each day on the exercise.",
  },
  {
    no: "02",
    icon: <TimerIcon />,
    title: "Improve Your Speed",
    text: "Practice until you can complete every page in less than one minute.",
  },
  {
    no: "03",
    icon: <EditNoteIcon />,
    title: "Use It Repeatedly",
    text: "Practice with a pencil so the sheets can be reused. Erase it after every iteration.",
  },
  {
    no: "04",
    icon: <TrendingUpIcon />,
    title: "Track Your Progress",
    text: "Record the date, time taken to complete 60 problems and your score after every attempt.",
  },
];

export default function HowItWorks() {
  return (
    <Box component="section" sx={{ bgcolor: "var(--primary-light)", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Typography
          variant="h2"
          sx={{ textAlign: "center", fontWeight: 800, color: "#0f3d24", fontSize: { xs: "1.8rem", md: "2.2rem" }, mb: { xs: 3, md: 5 } }}
        >
          How It Works
        </Typography>

        <Grid container rowSpacing={4}>
          {steps.map(({ no, icon, title, text }, i) => (
            <Grid
              key={no}
              size={{ xs: 12, sm: 6, md: 3 }}
              sx={{
                px: { md: 3 },
                borderLeft: { xs: "none", md: i === 0 ? "none" : "1px solid #16a34a33" },
              }}
            >
              <Stack direction="row"  spacing={1.5} sx={{ mb: 2,alignItems:"center" }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: "var(--primary)",
                    color: "var(--white)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  {no}
                </Box>
                <Box sx={{ color: "var(--primary)", display: "flex", "& svg": { fontSize: 42 } }}>{icon}</Box>
              </Stack>

              <Typography sx={{ fontWeight: 700, color: "#0f3d24", fontSize: { xs: "1.1rem", md: "1.25rem" }, mb: 1 }}>
                {title}
              </Typography>
              <Typography sx={{ color: "#3f5a4a", lineHeight: 1.6 }}>{text}</Typography>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}