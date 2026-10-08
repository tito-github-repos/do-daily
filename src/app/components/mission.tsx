"use client";
import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import FaceIcon from "@mui/icons-material/Face";
import PsychologyIcon from "@mui/icons-material/Psychology";
import Face3Icon from "@mui/icons-material/Face3";

const groups = [
  { label: "All Age Groups", icon: <FaceIcon /> },
  { label: "All Minds", icon: <PsychologyIcon /> },
  { label: "One Goal", icon: <Face3Icon /> },
];

export default function Mission() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Grid
          container
          
          sx={{
            bgcolor: "var(--primary-light)",
            borderRadius: 6,
            p: { xs: 3, md: 5 },
            rowGap: { xs: 3, md: 0 },
            alignItems:"center"
          }}
        >
          {/* Left: mission text */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 3 }}
              sx={{ textAlign: { xs: "center", sm: "left" }, alignItems:"center" }}
            >
              <TrackChangesIcon sx={{ fontSize: { xs: 64, md: 90 }, color: "var(--primary)" }} />
              <Box>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 700, color: "var(--primary)", fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 1 }}
                >
                  Our Mission
                </Typography>
                <Typography sx={{ color: "#3f5a4a", lineHeight: 1.6, fontSize: { xs: "1rem", md: "1.15rem" } }}>
                  Do Daily addresses mental fitness for all age groups through simple, brain-stimulating
                  activities.
                </Typography>
              </Box>
            </Stack>
          </Grid>

          {/* Right: tagline + groups */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              textAlign: "center",
              pt: { xs: 3, md: 0 },
              borderTop: { xs: "2px solid var(--primary)", md: "none" },
              borderLeft: { xs: "none", md: "2px solid var(--primary)" },
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "var(--primary)", mb: 2, fontSize: { xs: "1rem", md: "1.2rem" } }}>
              For a sharper mind. For a brighter future.
            </Typography>

            <Grid container spacing={2} 
            sx={{justifyContent:"center"}}>
              {groups.map(({ label, icon }) => (
                <Grid key={label} size={{ xs: 4 }}>
                  <Stack spacing={1} sx={{alignItems:"center" }}>
                    <Box
                      sx={{
                        width: { xs: 56, md: 72 },
                        height: { xs: 56, md: 72 },
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: "#16a34a26",
                        color: "var(--primary)",
                        "& svg": { fontSize: { xs: 30, md: 40 } },
                      }}
                    >
                      {icon}
                    </Box>
                    <Typography sx={{ fontWeight: 600, color: "var(--primary)", fontSize: { xs: "0.8rem", md: "1rem" } }}>
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