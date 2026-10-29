"use client";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const DIVIDER = "1px solid #16a34a33";

// Put these in /public: the sheet PDF and the meditating-girl illustration
const SHEET_URL = "/downloads/DoDaily-Exercise-Sheet.pdf";
const ILLUSTRATION = "/images/do-daily-illustration.png";

export default function ExerciseSheets() {
  return (
    <Box
      component="section"
      id="exercises"
      sx={{ bgcolor: "var(--primary-light)", py: { xs: 5, md: 8 }, scrollMarginTop: { xs: 64, md: 80 } }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, lg: 0 }} sx={{ alignItems: "center" }}>
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
              <Button
                component="a"
                href={SHEET_URL}
                download
                variant="contained"
                fullWidth
                startIcon={<DownloadIcon />}
                sx={{
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
                }}
              >
                Download Exercise Sheet
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}