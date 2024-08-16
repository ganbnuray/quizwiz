"use client";
import { useState, useEffect } from "react";
import { doc, getDoc, collection } from "firebase/firestore";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Box,
  Typography,
} from "@mui/material";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { db } from "../../firebase";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState({});

  const searchParams = useSearchParams();
  const search = searchParams.get("id");
  //console.log(search);
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

        // Get the planets document
        const planetsDoc = await getDoc(flashcardSetDocRef);

        // Access the flashcards array from the planets document
        const flashcards = planetsDoc.data()?.flashcards || [];

        setFlashcards(flashcards);
      } catch (error) {
        console.error("Error fetching flashcards: ", error);
      }
    }

    getFlashcards();
  }, [search, user]);

  //console.log(flashcards);

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={2}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardActionArea
                onClick={() => handleCardClick(index)}
                disableTouchRipple
              >
                <CardContent>
                  <Box
                    sx={{
                      perspective: "1000px",
                      "& > div": {
                        transition: "transform 0.6s ease-in-out",
                        transformStyle: "preserve-3d",
                        position: "relative",
                        width: "100%",
                        height: "200px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        transform: flipped[index]
                          ? "rotateY(180deg)"
                          : "rotateY(0deg)",
                      },
                      "& > div > div": {
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                        boxSizing: "border-box",
                      },
                      "& > div > div:nth-of-type(2)": {
                        transform: "rotateY(180deg)",
                      },
                    }}
                  >
                    <div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.front}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="h5" component="div">
                          {flashcard.back}
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
