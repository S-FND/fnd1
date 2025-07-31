import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  checkBlockedStatus, 
  forgotPassword, 
  verifyOtp, 
  resetPassword 
} from "./auth";
import { useNavigate } from 'react-router-dom';
import { Routes } from "react-router"

interface ForgotPasswordFlowProps {
  onBackToLogin: () => void;
  loginType: string;
}

export const ForgotPasswordFlow = ({ onBackToLogin, loginType }: ForgotPasswordFlowProps) => {
  const navigate = useNavigate()
  
  const [step, setStep] = useState<number>(1);
  const [email, setEmail] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [resendTimer, setResendTimer] = useState<number>(60);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value.toLowerCase());
    if (name === 'otp') setOtp(value);
    if (name === 'password') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  const checkEmailDomain = (email: string) => {
    const domain = email.split("@")[1]?.split(".")[0];
    const blockedDomains = [
      "gmail", "yahoo", "hotmail", "outlook", "protonmail", 
      "icloud", "me", "mac", "aol", "yandex", "ymail", 
      "yahoomail", "mail", "gmx", "tutanota", "fastmail", 
      "rediffmail", "lycos", "india", "rediff", "yopmail",
      "alabamahomenetworks", "alabamahomenetwoks", "comcast", "texashomenet"
    ];
    return blockedDomains.includes(domain);
  };

  const startResendTimer = () => {
    setResendDisabled(true);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || email.trim() === "") {
      toast.error(`Please enter your email ID`);
      return;
    }

    // if (checkEmailDomain(email)) {
    //   toast({
    //     title: 'Error',
    //     description: 'Please enter official email ID',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    setIsLoading(true);

    try {
      // First API call: Check blocked status
      const { error: blockedError } = await checkBlockedStatus(email);
      if (blockedError) {
        throw new Error(blockedError || 'Your account is currently blocked. Please contact support.');
      }

      // Second API call: Send forgot password request
      const { error: forgotError } = await forgotPassword(email);
      
      if (forgotError) {
        throw new Error(forgotError || 'Failed to send OTP');
      }

      toast.success(`We've sent a 6-digit code to ${email}`);
      
      setStep(2);
      startResendTimer();
      
    } catch (error) {
      toast.error(error.message || 'Failed to initiate password reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { error } = await forgotPassword(email);
      
      if (error) {
        throw new Error(error || 'Failed to resend OTP');
      }

      toast.success(`New OTP sent to ${email}`);
      
      startResendTimer();
      
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.trim() === "" || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await verifyOtp(email, otp);
      
      if (error) {
        throw new Error(error || 'Invalid OTP. Please try again.');
      }

      toast.success('Please create a new password for your account');
      
      setStep(3);
      
    } catch (error) {
      toast.error(error.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.trim() === "") {
      toast.error('Please enter a new password');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await resetPassword(email, otp, newPassword);
      
      if (error) {
        throw new Error(error || 'Failed to update password');
      }

      toast.success('Your password has been updated successfully');
      onBackToLogin();
      
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      <Button 
        variant="ghost" 
        onClick={onBackToLogin}
        className="flex items-center gap-2 px-0"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to login
      </Button>

      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {step === 1 && 'Reset Password'}
          {step === 2 && 'Verify Your Email'}
          {step === 3 && 'Create New Password'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === 1 && 'Enter your email to receive a verification code'}
          {step === 2 && `Enter the 6-digit code sent to ${email}`}
          {step === 3 && 'Create a strong password to secure your account'}
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={handleSubmitEmail} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@company.com"
              value={email}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Code...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="123456"
              value={otp}
              onChange={handleInputChange}
              maxLength={6}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <Button 
              variant="link" 
              type="button" 
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className="px-0 text-sm"
            >
              {resendDisabled ? `Resend in ${resendTimer}s` : 'Resend Code'}
            </Button>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleCreatePassword} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Password must contain:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li className={newPassword.length >= 8 ? 'text-green-500' : ''}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(newPassword) ? 'text-green-500' : ''}>
                At least one uppercase letter
              </li>
              <li className={/\d/.test(newPassword) ? 'text-green-500' : ''}>
                At least one number
              </li>
            </ul>
          </div>
          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              'Update Password'
            )}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordFlow;