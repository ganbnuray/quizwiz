import { Container, Typography, Box, Button } from "@mui/material";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <Container maxWidth={"false"} disableGutters width="100vw" margin="auto">
      <Box sx={{ width: "90%", margin: "auto" }}>
        <Box
          id="navbar"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingY: 1,
            backgroundColor: "red",
          }}
        >
          <Typography>FLASHCARDS</Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <SignedOut>
              <Button variant="contained" href="/sign-in">
                Log in
              </Button>
              <Button variant="contained" href="/sign-up">
                Sign up
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
            minHeight: "640px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Typography variant="h3">
            Unlock the Power of AI-Generated Flashcards
          </Typography>
          <Typography variant="h6">
            Just provide a text prompt, and our app creates personalized
            flashcards to help you learn more effectively.
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "red",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            Ready to revolutionize your study sessions? Try our AI-generated
            flashcards today and learn more effectively!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
