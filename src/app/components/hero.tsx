"use client";
import Link from "next/link";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function Hero() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        minHeight: { xs: 460, sm: 440, md: 440, lg: 500 },
        bgcolor: "var(--primary-light)",
        backgroundImage: "url('/images/heo-back.png')",
        backgroundSize: "cover",
        // keeps the girl (right side of the image) in view on small screens
        backgroundPosition: { xs: "75% center", md: "center" },
        backgroundRepeat: "no-repeat",
        // soft white fade on the left so the text stays readable
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: {
            xs: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 55%, rgba(255,255,255,0) 100%)",
            md: "linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.45) 40%, rgba(255,255,255,0) 60%)",
          },
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid container sx={{ py: { xs: 4, md: 5 }, alignItems: "center" }}>
          {/* Left: content only */}
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              textAlign: { xs: "center", md: "left" },
              alignSelf: { xs: "flex-start", md: "center" },
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#0f3d24",
                fontSize: { xs: "1.9rem", sm: "2.3rem", lg: "2.8rem" },
              }}
            >
              Where Focus Goes,
              <Box
                component="span"
                sx={{
                  display: "block",
                  fontSize: { xs: "2.8rem", sm: "3.4rem", lg: "4.2rem" },
                  background: "linear-gradient(90deg, #15803d 0%, #22c55e 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Energy Flows.
              </Box>
            </Typography>

            <Typography
              sx={{
                mt: 1.5,
                mb: 3,
                fontWeight: 600,
                color: "#1f3d2b",
                fontSize: { xs: "1rem", md: "1.2rem" },
              }}
            >
              Train your brain.{" "}
              <Box component="span" sx={{ color: "var(--primary)", fontWeight: 700 }}>
                10 minutes a day.
              </Box>
            </Typography>

            <Button
              component={Link}
              href="/exercise"
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: "var(--primary)",
                color: "var(--white)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 999,
                px: { xs: 3, md: 4 },
                py: 1.25,
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                boxShadow: "0 6px 16px #16a34a59",
                "&:hover": {
                  bgcolor: "var(--primary)",
                  filter: "brightness(0.92)",
                  boxShadow: "0 10px 24px #16a34a73",
                },
              }}
            >
              Start Your Daily Practice
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}