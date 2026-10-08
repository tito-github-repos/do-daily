"use client";
import Image from "next/image";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// Replace with your real PDF later, e.g. "/files/exercise-1.pdf"
const SHEET_FILE = "/images/sheet.png";

export default function StartExercise() {
  return (
    <Box component="section" sx={{ py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 3, md: 6 }} sx={{alignItems:"center"}}>
          {/* Left: sheet image */}
          <Grid size={{ xs: 12, md: 5 }} sx={{ display: "flex", justifyContent: "center" }}>
            <Image
              src="/images/sheet1.png"
              alt="Mental Calisthenics Exercise 1 sheet"
              width={500}
              height={560}
              style={{ width: "100%", maxWidth: 440, height: "auto" }}
            />
          </Grid>

          {/* Right: content */}
          <Grid size={{ xs: 12, md: 7 }} sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography
              variant="h2"
              sx={{ fontWeight: 800, color: "#0f3d24", fontSize: { xs: "1.6rem", md: "2.2rem" }, mb: 1.5 }}
            >
              Start with Mental Calisthenics –{" "}
              <Box component="span" sx={{ color: "var(--primary)" }}>Exercise 1</Box>
            </Typography>

            <Typography sx={{ color: "#3f5a4a", lineHeight: 1.7, fontSize: { xs: "1rem", md: "1.1rem" }, mb: 3 }}>
              Practice this exercise every day and challenge yourself to complete the page in less than
              one minute.
            </Typography>

            <Button
              component="a"
              href={SHEET_FILE}
              download
              variant="contained"
              startIcon={<FileDownloadIcon />}
              sx={{
                bgcolor: "var(--primary)",
                color: "var(--white)",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 999,
                px: 4,
                py: 1.25,
                fontSize: "1.05rem",
                boxShadow: "0 6px 16px #16a34a59",
                "&:hover": { bgcolor: "var(--primary)", filter: "brightness(0.92)" },
              }}
            >
              Download Exercise Sheet
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}