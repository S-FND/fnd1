// src/pages/Signup.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, User, FileCheck, Mail, ShieldCheck, User as UserIcon, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { httpClient } from '@/lib/httpClient';
import { toast } from 'sonner';

const Signup = ({ onBackToLogin }) => {
  const [step, setStep] = useState<'role-email' | 'otp' | 'account'>('role-email');
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [signupType, setSignupType] = useState<number>(2);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    isInvestor: false,
    entityType: 2, // default
    isChecked: false,
    otp: '',
    emailVerified: true,
  });

  const { name, email, password, otp } = formData;

  const blockedDomains = [
    'gmail', 'yahoo', 'hotmail', 'outlook', 'protonmail', 'icloud', 'me', 'mac',
    'aol', 'yandex', 'ymail', 'yahoomail', 'mail', 'gmx', 'tutanota',
    'fastmail', 'rediffmail', 'lycos', 'india', 'rediff', 'yopmail',
    'alabamahomenetworks', 'alabamahomenetwoks', 'comcast', 'texashomenet',
  ];

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Step 1: Send OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!isValidEmail(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    const domain = email.split('@')[1]?.split('.')[0]?.toLowerCase();
    if (domain && blockedDomains.includes(domain)) {
      toast.error('Please use your official company email');
      return;
    }

    setLoading(true);
    try {
      const blockedRes:any = await httpClient.post('auth/blocked-status', { email });
      if (blockedRes.data?.blocked) {
        toast.error('This email is not allowed');
        return;
      }

      await httpClient.post('auth/verify-email', { email, entityType: signupType });
      toast.success(`We've sent a 6-digit code to ${email}`);
      setStep('otp');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim() || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      await httpClient.post('auth/verify-otp', { email, otp });
      toast.success('Please create your account');
      setStep('account');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid OTP';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) {
      toast.error('Please fill all fields');
      return;
    }
    if (!isChecked) {
      toast.error('Please accept the Terms of Service');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const res:any = await httpClient.post('auth/register', {
        name,
        email,
        password,
        entityType: signupType,
        termsAccepted: isChecked,
      });

      toast.success('Account created successfully!');
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    //   setTimeout(() => (window.location.href = '/'), 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-md">
      {/* Back to Login */}
      {step !== 'role-email' && (
        <Button
          variant="ghost"
          onClick={() => {
            if (step === 'otp') setStep('role-email');
            else if (step === 'account') setStep('otp');
          }}
          className="flex items-center gap-2 px-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">
          {step === 'role-email' && 'Sign Up'}
          {step === 'otp' && 'Verify Your Email'}
          {step === 'account' && 'Create Your Account'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {step === 'role-email' && 'Select your role and enter your official email'}
          {step === 'otp' && `Enter the 6-digit code sent to ${email}`}
          {step === 'account' && 'Complete your profile to get started'}
        </p>
      </div>

      {/* Step 1: Role + Email */}
      {step === 'role-email' && (
        <div className="space-y-6">
          <Tabs defaultValue="company" onValueChange={(value) => setSignupType(Number(value))}>
            {/* <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>Company</span>
              </TabsTrigger>
              <TabsTrigger value="supplier" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Supplier</span>
              </TabsTrigger>
              <TabsTrigger value="vendor" className="flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                <span>Vendor</span>
              </TabsTrigger>
            </TabsList> */}

            <TabsContent value="company" className="pt-4">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="supplier" className="pt-4">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@supplier.com"
                      value={email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="vendor" className="pt-4">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Work Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@vendor.com"
                      value={email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Step 2: OTP */}
      {step === 'otp' && (
        <form onSubmit={handleOTPSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </Button>
        </form>
      )}

      {/* Step 3: Account Creation */}
      {step === 'account' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              value={name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex items-start space-x-3">
            <div className="pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
            </div>
            <label htmlFor="terms" className="text-sm text-muted-foreground">
              I agree to the{' '}
              <a href="/terms-of-service" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </label>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </form>
      )}

      {/* Footer */}
      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/" className="text-primary hover:underline font-medium">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;