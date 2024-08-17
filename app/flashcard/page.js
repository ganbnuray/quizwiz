"use client";
import { useState, useEffect } from "react";
import React from "react";
import { doc, getDoc, collection } from "firebase/firestore";
import {
  Container,
  Box,
  Typography,
  ThemeProvider,
  createTheme,
  Button,
  keyframes,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { db } from "../../firebase";
import { RedirectToSignIn } from "@clerk/nextjs";
import { Roboto } from "next/font/google";
import { MedievalSharp } from "next/font/google";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "700"] });
const medievalSharp = MedievalSharp({ subsets: ["latin"], weight: ["400"] });
const theme = createTheme({
  typography: {
    fontFamily: `${roboto.style.fontFamily}, sans-serif`,
  },
});

const flipAnimation = keyframes`
  0% { transform: rotateY(0); }
  100% { transform: rotateY(180deg); }
`;
export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length
    );
  };

  const handleFlip = () => {
    setIsFlipped((prevFlipped) => !prevFlipped);
  };

  const searchParams = useSearchParams();
  const search = searchParams.get("id");

  useEffect(() => {
    async function getFlashcards() {
      if (!search || !user) return;

      try {
        // Reference to the user's document
        const userDocRef = doc(db, "users", user.id);
        // Reference to the specific flashcard set document
        const flashcardSetDocRef = doc(
          collection(userDocRef, "flashcardSets"),
          search
        );

        // Get the flashcards document
        const flashcardsDoc = await getDoc(flashcardSetDocRef);

        // Access the flashcards array from the document
        const flashcards = flashcardsDoc.data()?.flashcards || [];

        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    }

    // Call the async function
    getFlashcards();
  }, [search, user]);

  //console.log(flashcards);
  return (
    <ThemeProvider theme={theme}>
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
            id="main"
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flex: "1 1 auto",
              minWidth: { xs: "100%", md: "60%" },
              margin: "auto",
            }}
          >
            <Typography
              sx={{
                marginBottom: 2,
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.5rem",
              }}
            >
              {search}
            </Typography>
            {flashcards.length > 0 ? (
              <Box
                id="card"
                sx={{
                  minWidth: { xs: "100%", md: "70%" },
                  minHeight: "fit-content",
                  height: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  perspective: "1000px",
                }}
                onClick={handleFlip}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)",
                    animation: `${flipAnimation} 0.6s`,
                  }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      backgroundColor: "#404040",
                      borderRadius: "10px",
                      color: "#fff",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      paddingX: "5%",
                    }}
                  >
                    <Typography>{flashcards[currentIndex].front}</Typography>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      backfaceVisibility: "hidden",
                      backgroundColor: "#303030",
                      borderRadius: "10px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      transform: "rotateY(180deg)",
                      color: "#fff",
                      paddingX: "5%",
                    }}
                  >
                    <Typography>{flashcards[currentIndex].back}</Typography>
                  </Box>
                </Box>
              </Box>
            ) : (
              <Typography sx={{ color: "#fff" }}>
                No flashcards available
              </Typography>
            )}
            <Box
              id="buttons"
              sx={{
                marginTop: 4,
                minWidth: { xs: "100%", md: "70%" },
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                variant="contained"
                onClick={handlePrevious}
                disabled={flashcards.length === 0}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#421C9B",
                  ":hover": {
                    backgroundColor: "#350E8F",
                  },
                  width: "20%",
                  borderRadius: "10px",
                }}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={flashcards.length === 0}
                sx={{
                  textTransform: "none",
                  backgroundColor: "#421C9B",
                  ":hover": {
                    backgroundColor: "#350E8F",
                  },
                  width: "20%",
                  borderRadius: "10px",
                }}
              >
                Next
              </Button>
            </Box>
            <Box
              sx={{
                marginTop: 6,
                minWidth: { xs: "100%", md: "70%" },
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                href="/generate"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#421C9B",
                  ":hover": {
                    backgroundColor: "#350E8F",
                  },
                  borderRadius: "10px",
                  width: "30%",
                  color: "#fff",
                }}
              >
                Back to sets
              </Button>
            </Box>
          </Box>
        </Box>

        <SignedOut>
          <RedirectToSignIn redirectUrl="/sign-in" />
        </SignedOut>
      </Container>
    </ThemeProvider>
  );
}
