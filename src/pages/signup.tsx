import { zodResolver } from "@hookform/resolvers/zod";
import { Box, FormControl } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import z from "zod";
import { ContainedButton } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Link } from "../components/ui/link";
import { LoadingBackdrop } from "../components/ui/loading-backdrop";
import { Text } from "../components/ui/text";
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
            Already have an account? <Link to="/signin">Sign In</Link>
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
              <Label htmlFor="name">Name</Label>
              <Input placeholder="Name" {...register("name")} />
              {errors.name != null && (
                <Text variant="caption" color="error">
                  {errors.name.message}
                </Text>
              )}
            </FormControl>
            <FormControl>
              <Label htmlFor="email">Email</Label>
              <Input placeholder="Email" {...register("email")} />
              {errors.email != null && (
                <Text variant="caption" color="error">
                  {errors.email.message}
                </Text>
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
              Sign Up
            </ContainedButton>
          </Box>
        </form>
        <Text sx={{ textAlign: "center" }}>
          By signing up, you agree to our <br />{" "}
          <Link to="#">Terms of Service</Link>
          {" and "}
          <Link to="#">Privacy Policy</Link>.
        </Text>
      </Box>
      <LoadingBackdrop isLoading={isPending} />
    </Box>
  );
}
