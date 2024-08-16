"use client";
import { useUser } from "@clerk/nextjs";
import { writeBatch, doc, getDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Container,
  Typography,
  Button,
  TextField,
  Box,
  CardContent,
  Grid,
  Card,
  CardActionArea,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
  DialogActions,
} from "@mui/material";
import { db } from "../../firebase";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Please enter some text to generate flashcards.");
      return;
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: text,
      });

      if (!response.ok) {
        throw new Error("Failed to generate flashcards");
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const saveFlashcards = async () => {
    if (!name) {
      alert("Please enter a name");
      return;
    }

    const userDocRef = doc(collection(db, "users"), user.id);
    const docSnap = await getDoc(userDocRef);
    const batch = writeBatch(db);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      const updatedSets = [...(userData.flashcardSets || []), { name: name }];
      batch.update(userDocRef, { flashcardSets: updatedSets });
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const setDocRef = doc(collection(userDocRef, "flashcardSets"), name);
    batch.set(setDocRef, { flashcards });

    await batch.commit();
    handleClose();
    setName("");
    router.push("/flashcards");
  };

  return (
    <Container maxWidth={"false"} disableGutters width="100vw" margin="auto">
      <Box sx={{ width: "90%", margin: "auto", mt: 3 }}>
        <SignedIn>
          <Typography variant="h4" component="h1" gutterBottom>
            Generate Flashcards
          </Typography>
          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Generate Flashcards
          </Button>

          {flashcards.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Generated Flashcards
              </Typography>

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
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleOpen}
                >
                  Save
                </Button>
              </Box>
            </Box>
          )}

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter a name for your flashcards collection.
              </DialogContentText>
              <TextField
                variant="outlined"
                autoFocus
                label="Collection Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                sx={{ margin: "dense" }}
              ></TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={saveFlashcards}>Save</Button>
            </DialogActions>
          </Dialog>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn redirectUrl="/sign-in" />
        </SignedOut>
      </Box>
    </Container>
  );
}
