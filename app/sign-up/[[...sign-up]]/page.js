"use client";
import {
  Container,
  Typography,
  Box,
  Button,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Roboto } from "next/font/google";
import { MedievalSharp } from "next/font/google";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const medievalSharp = MedievalSharp({ subsets: ["latin"], weight: ["400"] });
import { SignUp } from "@clerk/nextjs";
import { useEffect } from "react";
const theme = createTheme({
  typography: {
    fontFamily: `${roboto.style.fontFamily}, sans-serif`,
  },
});
export default function SignUpPage() {
  useEffect(() => {
    document.title = "QuizWiz | Sign up"; // Change this to the title you want for this page
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <>
        <link rel="icon" href="wizard.svg" />
      </>
      <Container maxWidth={"false"} disableGutters width="100vw" margin="auto">
        <Box
          sx={{
            width: "95%",
            margin: "auto",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            id="navbar"
            height="40px"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingY: 1,
              height: "fit-content",
              flex: "0 1 auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  fontFamily: `${medievalSharp.style.fontFamily}, sans-serif`,
                }}
              >
                QuizWiz
              </Typography>
              <Button
                href="/"
                sx={{
                  textTransform: "capitalize",
                }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    ":hover": {
                      color: "#EBE9ED",
                    },
                  }}
                >
                  Home
                </Typography>
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <SignedOut>
                <Button
                  sx={{
                    textTransform: "none",
                    backgroundColor: "transparent",
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  variant="contained"
                  href="/sign-in"
                >
                  <Typography
                    sx={{
                      ":hover": {
                        color: "#EBE9ED",
                      },
                    }}
                  >
                    Log in
                  </Typography>
                </Button>
                <Button
                  sx={{
                    textTransform: "none",
                    backgroundColor: "transparent",
                    ":hover": {
                      backgroundColor: "transparent",
                    },
                  }}
                  variant="contained"
                  href="/sign-up"
                >
                  <Typography
                    sx={{
                      ":hover": {
                        color: "#EBE9ED",
                      },
                    }}
                  >
                    Sign up
                  </Typography>
                </Button>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: "1 1 auto",
            }}
          >
            <SignUp />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
