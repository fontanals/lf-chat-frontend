import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { SignupRequest } from "../models/requests/auth";
import { services } from "../services/provider";
import { useAuthStore } from "../state/auth";

const signupFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormSchema = z.infer<typeof signupFormSchema>;

export function SignupPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormSchema>({
    resolver: zodResolver(signupFormSchema),
  });

  const { mutate: signup, isPending } = useMutation({
    mutationFn: (request: SignupRequest) => services.auth.signup(request),
    onSuccess: (response) => {
      setUser(response.user);
      navigate("/chat");
    },
  });

  function onSubmit(formValues: SignupFormSchema) {
    signup(formValues);
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
          gap: 2,
          width: { xs: "80vw", sm: "40vw", lg: "30vw" },
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{ fontWeight: "bold" }}
            variant="h4"
            color="secondary"
          >
            AI-CHAT
          </Typography>
          <Typography sx={{ marginTop: 1 }} variant="body2">
            Already have an account?{" "}
            <Link style={{ color: theme.palette.secondary.main }} to="/signin">
              Signin
            </Link>
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: { xs: "80vw", sm: "40vw", lg: "30vw" },
            }}
          >
            <FormControl>
              <label htmlFor="name">Name</label>
              <Input placeholder="Name" {...register("name")} />
              {errors.name != null && (
                <Typography variant="caption" color="error">
                  {errors.name.message}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <label htmlFor="email">Email</label>
              <Input placeholder="Email" {...register("email")} />
              {errors.email != null && (
                <Typography variant="caption" color="error">
                  {errors.email.message}
                </Typography>
              )}
            </FormControl>
            <FormControl>
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password != null && (
                <Typography variant="caption" color="error">
                  {errors.password.message}
                </Typography>
              )}
            </FormControl>
            <Button sx={{ marginTop: 2 }} type="submit" variant="contained">
              Signup
            </Button>
          </Box>
        </form>
        <Typography sx={{ textAlign: "center" }} variant="body2">
          By signing up, you agree to our <br />{" "}
          <Link style={{ color: theme.palette.secondary.main }} to="#">
            Terms of Service
          </Link>
          {" and "}
          <Link
            style={{ fontWeight: "bold", color: theme.palette.secondary.main }}
            to="#"
          >
            Privacy Policy
          </Link>
          .
        </Typography>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
