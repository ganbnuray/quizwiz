"use client";
import { useUser } from "@clerk/nextjs";
import {
  doc,
  getDoc,
  collection,
  setDoc,
  onSnapshot,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CardContent,
  Card,
  CardActionArea,
  ThemeProvider,
  createTheme,
  TextField,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
export default function Generate() {
  const router = useRouter();
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSets, setFilteredSets] = useState([]);

  useEffect(() => {
    if (!user) return;

    const flashcardSetsColRef = collection(
      db,
      "users",
      user.id,
      "flashcardSets"
    );
    const unsubscribe = onSnapshot(flashcardSetsColRef, (snapshot) => {
      const sets = snapshot.docs.map((doc) => doc.id);
      setFlashcardSets(sets);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredSets(flashcardSets);
    } else {
      setFilteredSets(
        flashcardSets.filter((set) =>
          set.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, flashcardSets]);

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    handleClose();
    if (!name) {
      alert("Please enter a name");
      return;
    } else if (!text.trim()) {
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
      const userDocRef = doc(db, "users", user.id);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const updatedSets = [...(userData.flashcardSets || []), { name: name }];
        await setDoc(
          userDocRef,
          { flashcardSets: updatedSets },
          { merge: true }
        );
      } else {
        await setDoc(userDocRef, { flashcardSets: [{ name }] });
      }

      const setDocRef = doc(userDocRef, "flashcardSets", name);
      await setDoc(setDocRef, { flashcards: data });
      setName("");
      setText("");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert("An error occurred while generating flashcards. Please try again.");
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setText("");
  };

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
              //backgroundColor: "red",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#fff", marginBottom: 4, fontWeight: "bold" }}
            >
              Select a set to study
            </Typography>

            <Box sx={{ width: "100%" }}>
              <Box
                id="searchcreate"
                sx={{
                  marginBottom: 2,
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  gap: 2,
                  justifyContent: "center",
                  alignItems: "center", // Align items to the center for equal height
                }}
              >
                <TextField
                  variant="outlined"
                  sx={{
                    flexGrow: 1, // Allow the TextField to take up the remaining space
                    borderRadius: "5px",
                    backgroundColor: "#303030",
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "5px", // Add border radius to the root element
                      "& fieldset": {
                        border: "none", // Remove the border
                        borderRadius: "5px", // Ensure the border radius is applied to the fieldset
                      },
                      "&:hover fieldset": {
                        border: "none", // Remove the border on hover
                      },
                      "&.Mui-focused fieldset": {
                        border: "3px solid #421C9B", // Change outline color when focused
                      },
                      "& input": {
                        color: "#fff", // Change text color to white for better contrast
                      },
                    },
                  }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search a flashcard set"
                />
                <Button
                  variant="contained"
                  sx={{
                    height: "56px",
                    borderRadius: "5px",
                    backgroundColor: "#421C9B",
                    ":hover": {
                      backgroundColor: "#350E8F",
                    },
                  }}
                  onClick={handleOpen}
                >
                  <Typography
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    Create
                  </Typography>
                </Button>
              </Box>

              <Box id="displaysets" sx={{ width: "100%", minHeight: "100px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 3, // Adjust the gap between items
                    mt: 4,
                  }}
                >
                  {filteredSets.map((flashcard, index) => (
                    <Box
                      key={index}
                      sx={{
                        flexBasis: "calc(33.333% - 16px)", // 3 items per row
                        "@media (max-width: 960px)": {
                          flexBasis: "calc(50% - 16px)", // 2 items per row for medium screens
                        },
                        "@media (max-width: 600px)": {
                          flexBasis: "100%", // 1 item per row for small screens
                        },
                      }}
                    >
                      <Card sx={{ backgroundColor: "#303030" }}>
                        <CardActionArea
                          onClick={() => handleCardClick(flashcard)}
                          disableTouchRipple
                        >
                          <CardContent>
                            <Typography
                              variant="h6"
                              component="div"
                              color="#fff"
                              sx={{
                                overflow: "hidden",
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {flashcard}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>

            <Dialog
              open={open}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  backgroundColor: "#303030",
                  minWidth: { xs: "95%", md: "500px" },
                  color: "#fff",
                  paddingY: 3,
                  borderRadius: "10px", // Set your desired background color here
                },
              }}
            >
              <IconButton
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>

              <DialogTitle
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontWeight: "bold",
                  fontSize: "1.5rem",
                }}
              >
                Create flashcards
              </DialogTitle>

              <DialogContent>
                <DialogContentText sx={{ color: "#fff" }}>
                  Flashcard name
                </DialogContentText>
                <TextField
                  variant="outlined"
                  margin="dense"
                  type="text"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#28292a",
                      borderRadius: "5px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#404040", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#404040", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Border color when focused
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff", // Ensure content is scrollable
                    },
                  }}
                />
                <DialogContentText sx={{ color: "#fff", mt: 2 }}>
                  Description
                </DialogContentText>
                <TextField
                  variant="outlined"
                  margin="dense"
                  type="text"
                  fullWidth
                  multiline
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  sx={{
                    "& .MuiInputBase-root": {
                      backgroundColor: "#28292a",
                      borderRadius: "5px",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#404040", // Default border color
                      },
                      "&:hover fieldset": {
                        borderColor: "#404040", // Border color on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Border color when focused
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "#fff",
                      resize: "vertical", // Allow resizing in both directions
                      overflow: "auto", // Ensure content is scrollable
                    },
                  }}
                />
              </DialogContent>
              <DialogActions
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{
                    backgroundColor: "red",
                    textTransform: "none",
                    "&:hover": {
                      backgroundColor: "darkred",
                    },
                    width: "40%",
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    textTransform: "none",
                    backgroundColor: "#421C9B",
                    ":hover": {
                      backgroundColor: "#350E8F",
                    },
                    width: "40%",
                  }}
                >
                  Create
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>

        <SignedOut>
          <RedirectToSignIn redirectUrl="/sign-in" />
        </SignedOut>
      </Container>
    </ThemeProvider>
  );
}
