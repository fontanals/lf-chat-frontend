import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import z from "zod";
import { ContainedButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
import { useSignin } from "../hooks/auth";

const signinFormSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormSchema = z.infer<typeof signinFormSchema>;

export function SigninPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormSchema>({
    resolver: zodResolver(signinFormSchema),
  });

  const { mutate: signin, isPending } = useSignin();

  function onSubmit(formValues: SigninFormSchema) {
    signin({ request: formValues });
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          width: { xs: "80vw", sm: "40vw", lg: "30vw" },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Text
            sx={{ fontWeight: "bold", color: "secondary.main" }}
            variant="h4"
          >
            AI CHAT
          </Text>
          <Text sx={{ marginTop: "8px" }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Text>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              width: { xs: "80vw", sm: "40vw", lg: "30vw" },
            }}
          >
            <FormControl>
              <Label htmlFor="email">Email</Label>
              <Input placeholder="Email" {...register("email")} />
              {errors.email != null && (
                <Typography variant="caption" color="error">
                  {errors.email.message}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password != null && (
                <Text variant="caption" color="error">
                  {errors.password.message}
                </Text>
              )}
            </FormControl>
            <ContainedButton sx={{ marginTop: "16px" }} type="submit">
              Sign In
            </ContainedButton>
          </Box>
        </form>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
