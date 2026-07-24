import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import api from "../../utils/api";
import { Lock, Eye, EyeOff, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const resetSchema = z.object({
  password: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const ResetPassword = () => {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/reset-password", {
        token: token,
        password: data.password,
      });
      setIsLoading(false);
      toast.success("Password reset successfully! Please log in with your new password.");
      navigate("/login");
    } catch (err) {
      setIsLoading(false);
      const msg = err.response?.data?.message || "Invalid or expired password reset link. Please request a new one.";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-inter">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-3">
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100">
            <KeyRound className="w-3.5 h-3.5 text-primary-600" />
            Password Reset
          </span>
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 tracking-tight font-outfit">
          Set New Account Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter and confirm your new secure password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-3xl sm:px-10 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500" />

          {/* Error Alert */}
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

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="New Password"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
              {...register("password")}
              error={errors.password?.message}
            />

            <Input
              label="Confirm New Password"
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full h-11 text-sm font-bold shadow-lg shadow-primary-600/25 rounded-2xl flex items-center justify-center gap-2" 
              isLoading={isLoading}
            >
              <span>Update Password</span>
              {!isLoading && <CheckCircle2 className="w-4 h-4" />}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500">
            Back to{" "}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700 transition-colors">
              Sign In Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
