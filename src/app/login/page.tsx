"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/procedures";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { toast } = useToast();

  // If already logged in, redirect to the callback URL
  useEffect(() => {
    if (status === "authenticated" && session) {
      console.log("User is already authenticated, redirecting to:", callbackUrl);
      setIsRedirecting(true);
      router.push(callbackUrl);
    }
  }, [status, session, callbackUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", email);
      console.log("Callback URL is:", callbackUrl);

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      console.log("Login result:", result);

      if (!result?.ok) {
        setError("Invalid email or password");
        setIsLoading(false);
        return;
      }

      // Show success message
      toast({
        title: "Login successful",
        description: "You've been successfully logged in",
      });

      setIsRedirecting(true);

      // Allow the session to be established before redirecting
      setTimeout(() => {
        console.log("Redirecting to:", callbackUrl);
        router.push(callbackUrl);
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl });
    } catch (error) {
      console.error("Google login error:", error);
      setIsLoading(false);
    }
  };

  // Show redirecting state
  if (isRedirecting) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Redirecting...</CardTitle>
            <CardDescription className="text-center">
              You've been successfully authenticated, setting up your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If already authenticated, show loading state
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md glass-card">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Checking session...</CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your authentication status
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)]">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in to NeuroLog</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your surgical logbook
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-500 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Sign in"}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className="mr-2">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:text-blue-700">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
