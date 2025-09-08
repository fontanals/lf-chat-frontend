import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl, Typography, useTheme } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import z from "zod";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { SigninRequest } from "../models/requests/auth";
import { services } from "../services/provider";
import { useAuthStore } from "../state/auth";

const signinFormSchema = z.object({
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

type SigninFormSchema = z.infer<typeof signinFormSchema>;

export function SigninPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormSchema>({
    resolver: zodResolver(signinFormSchema),
  });

  const { mutate: signin, isPending } = useMutation({
    mutationFn: (request: SigninRequest) => services.auth.signin(request),
    onSuccess: (response) => {
      setUser(response.user);
      navigate("/chat");
    },
  });

  function onSubmit(formValues: SigninFormSchema) {
    signin(formValues);
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
            Ai Chat
          </Typography>
          <Typography sx={{ marginTop: 1 }} variant="body2">
            Don't have an account?{" "}
            <Link style={{ color: theme.palette.secondary.main }} to="/signup">
              Signup
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
              Signin
            </Button>
          </Box>
        </form>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
