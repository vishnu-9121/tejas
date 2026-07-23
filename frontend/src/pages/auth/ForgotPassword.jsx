import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import api from "../../utils/api";
import { Mail, Lock, ShieldCheck, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const resetSchema = z.object({
  otp: z.string().min(6, { message: "OTP code must be 6 digits." }),
  password: z.string().min(6, { message: "New password must be at least 6 characters." }),
});

export const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset
  const [isLoading, setIsLoading] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [serverOtp, setServerOtp] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
  });

  // Step 1: Send Forgot Password Email Request
  const handleSendResetEmail = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/forgot-password", { email: data.email });
      setSubmittedEmail(data.email);
      const receivedOtp = response.data?.data?.otp;
      if (receivedOtp) {
        setServerOtp(receivedOtp);
      }
      setIsLoading(false);
      setStep(2);
      toast.success("Password reset OTP sent to your email!");
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || "Could not find an account with that email address.";
      setError(msg);
      toast.error(msg);
    }
  };

  // Step 2: Verify OTP & Set New Password
  const handleResetPassword = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", {
        otp: data.otp,
        password: data.password,
      });
      setIsLoading(false);
      toast.success("Password reset successfully! Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || "Invalid or expired OTP code. Please try again.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter selection:bg-primary-100 selection:text-primary-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100">
            <KeyRound className="w-3.5 h-3.5 text-primary-600" />
            Account Security Portal
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">
          {step === 1 ? "Reset your password" : "Set new password"}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 
            ? "Enter your registered email address to receive password recovery instructions." 
            : `Enter the 6-digit OTP code sent to ${submittedEmail}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />

          {/* Error Alert Diagnostic */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-2xl text-sm flex items-start gap-3 shadow-sm" 
                role="alert"
              >
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 text-xs font-medium leading-relaxed">{error}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Development OTP Banner */}
          {serverOtp && step === 2 && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verification OTP Code:</span>
              </div>
              <span className="font-mono font-bold text-sm bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg border border-emerald-300">
                {serverOtp}
              </span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: SEND RESET EMAIL FORM */
            <form onSubmit={emailForm.handleSubmit(handleSendResetEmail)} className="space-y-6">
              <Input
                label="Registered Email Address"
                id="email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                {...emailForm.register("email")}
                error={emailForm.formState.errors.email?.message}
              />

              <Button type="submit" variant="primary" className="w-full h-11 text-sm font-bold shadow-lg shadow-primary-600/25 rounded-2xl flex items-center justify-center gap-2" isLoading={isLoading}>
                <span>Send Reset Email</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
              </Button>
            </form>
          ) : (
            /* STEP 2: VERIFY OTP & RESET PASSWORD FORM */
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-5">
              <Input
                label="6-Digit OTP Code"
                id="otp"
                type="text"
                placeholder="123456"
                leftIcon={<ShieldCheck className="w-4 h-4" />}
                {...resetForm.register("otp")}
                error={resetForm.formState.errors.otp?.message}
              />

              <Input
                label="New Password"
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                {...resetForm.register("password")}
                error={resetForm.formState.errors.password?.message}
              />

              <Button type="submit" variant="primary" className="w-full h-11 text-sm font-bold shadow-lg shadow-primary-600/25 rounded-2xl flex items-center justify-center gap-2" isLoading={isLoading}>
                <span>Update Password</span>
                {!isLoading && <CheckCircle2 className="w-4 h-4" />}
              </Button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors pt-2 flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Resend email to a different address</span>
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            Remember your password?{" "}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
