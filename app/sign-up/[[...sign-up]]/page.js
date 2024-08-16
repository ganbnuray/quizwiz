import { Container, Box, Typography, Button } from "@mui/material";
import { SignUp } from "@clerk/nextjs";
export default function SignUpPage() {
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
            <Button href="/sign-in" passhref="true">
              <Typography>Log in</Typography>
            </Button>
            <Button href="/sign-up" passhref="true">
              <Typography>Sign up</Typography>
            </Button>
          </Box>
        </Box>

        <Box
          id="signin"
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "650px",
          }}
        >
          <SignUp />
        </Box>
      </Box>
    </Container>
  );
}
