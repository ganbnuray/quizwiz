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
import { styled } from "@mui/system";
const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const medievalSharp = MedievalSharp({ subsets: ["latin"], weight: ["400"] });
export default function Home() {
  const RotatingGradientBox = styled(Box)`
    @keyframes rotate-background {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    background: linear-gradient(
      270deg,
      #ff9a9e,
      #fad0c4,
      #fbc2eb,
      #a18cd1,
      #a8edea,
      #fed6e3
    );
    background-size: 400% 400%;
    color: transparent;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: rotate-background 10s linear infinite;
    display: inline-block;
  `;
  //const theme = useTheme();

  const theme = createTheme({
    typography: {
      fontFamily: `${roboto.style.fontFamily}, sans-serif`,
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={"false"} disableGutters width="100vw" margin="auto">
        <Box
          sx={{
            width: "95%",
            margin: "auto",
            height: "calc(100vh - 40px)",
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
            id="hero"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "#fff",
              flex: "1 1 auto",
            }}
          >
            <RotatingGradientBox>
              <Typography
                variant="h3"
                textAlign="center"
                sx={{
                  fontWeight: "bold",
                  paddingBottom: 2,
                  [theme.breakpoints.up("xs")]: {
                    fontSize: "1.6rem", // Use fontSize instead of variant for responsiveness
                  },
                  [theme.breakpoints.up("sm")]: {
                    fontSize: "3.5rem",
                  },
                }}
              >
                Learn Smarter, Not Harder
              </Typography>
            </RotatingGradientBox>

            <Typography
              variant="h6"
              textAlign={"center"}
              sx={{ width: { xs: "100%", lg: "60%" } }}
            >
              Boost your knowledge with custom flashcards generated from your
              prompts. Perfect for students, professionals, and lifelong
              learners.
            </Typography>
            <Button
              href="/sign-up"
              variant="contained"
              sx={{
                marginTop: 3,
                backgroundColor: "#421C9B",
                borderRadius: "15px",
                ":hover": {
                  backgroundColor: "#350E8F",
                },
              }}
            >
              <Typography
                sx={{
                  textTransform: "none",
                  paddingX: 2,
                  paddingY: 0.5,
                  fontWeight: "bold",
                }}
              >
                Get started
              </Typography>
            </Button>
          </Box>
        </Box>

        <Box
          id="footer"
          width="100vw"
          sx={{ height: "40px", backgroundColor: "#421C9B" }}
        >
          <Box
            sx={{
              height: "100%",
              width: "95%",
              margin: "auto",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color="#fff">
              Made with ❤️ by Nuray Ganbarova
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
