"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

import { useUser } from "@clerk/nextjs";
import { db } from "../../firebase";
import { getDocs, collection } from "firebase/firestore";

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcards] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcardSets() {
      if (!user) return;

      try {
        // Reference to the user's flashcardSets collection
        const flashcardSetsColRef = collection(
          db,
          "users",
          user.id,
          "flashcardSets"
        );
        const querySnapshot = await getDocs(flashcardSetsColRef);
        const sets = querySnapshot.docs.map((doc) => doc.id); // Get the names of the flashcard sets
        setFlashcards(sets);
      } catch (error) {
        console.error("Error fetching flashcard sets: ", error);
      }
    }

    getFlashcardSets();
  }, [user]);

  //console.log(flashcardSets);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  return (
    <Container maxWidth="md">
      <Grid container spacing={3} sx={{ mt: 4 }}>
        {flashcardSets.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: "red" }}>
              <CardActionArea
                onClick={() => handleCardClick(flashcard)}
                disableTouchRipple
              >
                <CardContent>
                  <Typography variant="h5" component="div" color="000">
                    {flashcard}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
