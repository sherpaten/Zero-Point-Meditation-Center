
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

// ========================================
// DATE HELPERS
// ========================================

const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Monday is the beginning of the attendance week.
const getWeekStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);

  return formatLocalDate(date);
};

export default function Membership() {
  const [mode, setMode] = useState('signup');
  const [membershipPlan, setMembershipPlan] = useState('yearly');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPath, setPaymentProofPath] = useState('');
  const [proofUploading, setProofUploading] = useState(false);
  const [zelleQrOpen, setZelleQrOpen] = useState(false);
  const zelleQrValue = 'https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiWkVSTyBQT0lOVCBNRURJVEFUSU9OIENFTlRFUiBJTkMuIiwiYWN0aW9uIjoicGF5bWVudCIsInRva2VuIjoiNjQ2NDU2MDg0MyJ9';

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    country: '',
    password: '',
    confirmPassword: '',
  });

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [user, setUser] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');

  // ATTENDANCE STATE
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState('');

  // ========================================
  // AUTHENTICATION AND SESSION
  // ========================================

  useEffect(() => {
    if (!supabase) return;

    const hash = window.location.hash;

    if (hash.includes('error_code=otp_expired')) {
      setMode('forgot');
      setError(
        'This recovery link has expired or has already been used. Please request a new password reset email.'
      );
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
        setError('');
        setMessage('');
      }

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        setUser(session?.user ?? null);
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setMemberProfile(null);
        setAttendance([]);
      }
    });

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!sessionError) {
        setUser(data.session?.user ?? null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ========================================
  // LOAD MEMBER PROFILE FROM SUPABASE
  // ========================================

  useEffect(() => {
    if (!user || !supabase) {
      setMemberProfile(null);
      setProfileError('');
      setProfileLoading(false);
      return;
    }

    let active = true;

    const loadMemberProfile = async () => {
      setProfileLoading(true);
      setProfileError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('members')
          .select(
            'id, member_number, display_member_number, full_name, phone, country, status, created_at'
          )
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (active) {
          setMemberProfile(data);
        }
      } catch (err) {
        if (active) {
          setProfileError(
            err.message || 'Unable to load your membership profile.'
          );
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    };

    loadMemberProfile();

    return () => {
      active = false;
    };
  }, [user]);

  // ========================================
  // LOAD MEMBER ATTENDANCE
  // ========================================

  useEffect(() => {
    if (!memberProfile || !supabase) {
      setAttendance([]);
      setAttendanceError('');
      setAttendanceLoading(false);
      return;
    }

    let active = true;

    const loadAttendance = async () => {
      setAttendanceLoading(true);
      setAttendanceError('');

      try {
        const { data, error: fetchError } = await supabase
          .from('weekly_attendance')
          .select('id, class_date, week_start, created_at')
          .eq('member_id', memberProfile.id)
          .order('class_date', { ascending: false });

        if (fetchError) throw fetchError;

        if (active) {
          setAttendance(data || []);
        }
      } catch (err) {
        if (active) {
          setAttendanceError(
            err.message || 'Unable to load your attendance history.'
          );
        }
      } finally {
        if (active) {
          setAttendanceLoading(false);
        }
      }
    };

    loadAttendance();

    return () => {
      active = false;
    };
  }, [memberProfile]);

  // ========================================
  // FORM HANDLERS
  // ========================================

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleLoginChange = (event) => {
    setLoginForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handlePaymentProofSelection = (event) => {
    const file = event.target.files?.[0] || null;
    setPaymentProof(file);
    setPaymentProofPath('');
    setError('');
    setMessage('');
  };

  const handleUploadPaymentProof = async () => {
    setError('');
    setMessage('');
    if (!paymentProof) return setError('Please choose your payment receipt first.');
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(paymentProof.type)) return setError('Upload a JPG, PNG, WebP, or PDF receipt.');
    if (paymentProof.size <= 0 || paymentProof.size > 10 * 1024 * 1024) return setError('Your payment proof must be smaller than 10 MB.');
    if (!isSupabaseConfigured) return setError('Secure payment upload is not configured yet.');

    setProofUploading(true);
    try {
      const urlResponse = await fetch('/api/membership-proof-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: paymentProof.type, size: paymentProof.size }),
      });
      const uploadDetails = await urlResponse.json().catch(() => ({}));
      if (!urlResponse.ok) throw new Error(uploadDetails.error || 'Could not prepare the secure upload.');
      const { error: uploadError } = await supabase.storage
        .from('membership-payment-proofs')
        .uploadToSignedUrl(uploadDetails.path, uploadDetails.token, paymentProof, {
          contentType: paymentProof.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;
      setPaymentProofPath(uploadDetails.path);
      setMessage('Payment proof uploaded securely. You can now create your membership.');
    } catch (uploadError) {
      setPaymentProofPath('');
      setError(uploadError.message || 'Payment proof upload failed. Please try again.');
    } finally {
      setProofUploading(false);
    }
  };

  // ========================================
  // MEMBER REGISTRATION
  // ========================================

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isSupabaseConfigured) {
      setError('Membership registration is not configured yet.');
      return;
    }

    if (!paymentProofPath) {
      setError('Please upload your payment proof before creating your membership.');
      return;
    }

    if (form.password.length < 8) {
      setError('Your password must contain at least 8 characters.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { data: signupData, error: signupError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/membership`,
          data: {
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            country: form.country.trim(),
            membership_plan: membershipPlan,
            payment_proof_path: paymentProofPath,
          },
        },
      });

      if (signupError) throw signupError;

      try {
        const notificationResponse = await fetch('/api/membership-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.full_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            country: form.country.trim(),
            membershipPlan,
            paymentProofUploaded: true,
            memberId: signupData?.user?.id,
          }),
        });
        if (!notificationResponse.ok) {
          console.error('Membership was created, but the team notification email could not be sent.');
        }
      } catch (notificationError) {
        console.error('Membership was created, but the team notification request failed:', notificationError);
      }

      setMessage(
        'Thank you for joining us! Please check your email for a verification link to activate your account.'
      );

      setPaymentProof(null);
      setPaymentProofPath('');
      setForm({
        full_name: '',
        email: '',
        phone: '',
        country: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // MEMBER LOGIN
  // ========================================

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        throw new Error('Membership login is not configured yet.');
      }

      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: loginForm.email.trim(),
          password: loginForm.password,
        });

      if (loginError) throw loginError;

      setUser(data.user);
      setLoginForm({ email: '', password: '' });
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // ONE-TIME EMAIL CODE SIGN-IN
  // ========================================

  const handleSendLoginCode = async () => {
    setError('');
    setMessage('');

    const email = loginForm.email.trim();
    if (!email) {
      setError('Please enter your registered email address first.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Email-code sign-in is not configured yet.');
      return;
    }

    setLoading(true);

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: false },
      });

      if (otpError) throw otpError;

      setOtpCode('');
      setMode('otp');
      setMessage('If this email belongs to a ZPMC member, a one-time sign-in code has been sent. Please check your inbox and spam folder.');
    } catch (err) {
      setError(err.message || 'Could not send a one-time sign-in code.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLoginCode = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const email = loginForm.email.trim();
    const token = otpCode.trim();

    if (!email || !/^\d{6,8}$/.test(token)) {
      setError('Enter the registered email address and the 6–8 digit code from your email.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email',
      });

      if (verifyError) throw verifyError;

      setUser(data.user);
      setLoginForm({ email: '', password: '' });
      setOtpCode('');
      setMode('signin');
      setMessage('You are now signed in to your ZPMC membership.');
    } catch (err) {
      setError(err.message || 'The code is invalid or has expired. Request a new code and try again.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // FORGOT PASSWORD
  // ========================================

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!resetEmail.trim()) {
      setError('Please enter your registered email address.');
      return;
    }

    if (!isSupabaseConfigured) {
      setError('Password recovery is not configured yet.');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(
          resetEmail.trim(),
          {
            redirectTo: `${window.location.origin}/membership`,
          }
        );

      if (resetError) throw resetError;

      setMessage(
        'If an account exists for this email, a password reset link will be sent. Please check your inbox and spam folder.'
      );
    } catch (err) {
      setError(err.message || 'Could not send the password reset email.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UPDATE PASSWORD
  // ========================================

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 8) {
      setError('Your new password must contain at least 8 characters.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Your new passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setNewPassword('');
      setConfirmNewPassword('');

      await supabase.auth.signOut();

      setUser(null);
      setMemberProfile(null);
      setAttendance([]);
      setMode('signin');

      setMessage(
        'Your password has been updated successfully. You can now sign in with your new password.'
      );
    } catch (err) {
      setError(
        err.message ||
          'Unable to update your password. Please request a new reset link.'
      );
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SIGN OUT
  // ========================================

  const handleSignOut = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) throw signOutError;

      setUser(null);
      setMemberProfile(null);
      setAttendance([]);
      setMode('signin');
      setMessage('You have signed out successfully.');
    } catch (err) {
      setError(err.message || 'Unable to sign out.');
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // SWITCH FORM MODE
  // ========================================

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
  };

  // ========================================
  // PAGE
  // ========================================

  return (
    <section className="min-h-screen bg-buddhist-bg px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-2xl">

        {/* PAGE INTRODUCTION */}

        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-buddhist-gold">
            ZPMC Community
          </p>

          <h1 className="font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">
            Community Membership
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-stone-600">
            Join our community, deepen your meditation practice, and stay
            connected with the activities of Zero Point Meditation Center.
          </p>
        </div>

        {/* MEMBERSHIP OPTIONS */}

        <section className="mb-8 rounded-2xl border border-amber-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-buddhist-gold">
              Membership Options
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-buddhist-burgundy">
              Choose Your Membership
            </h2>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-5 text-center">
              <h3 className="font-semibold text-buddhist-burgundy">Yearly Membership</h3>
              <p className="mt-3 font-serif text-3xl font-bold text-buddhist-burgundy">$25</p>
              <p className="mt-1 text-xs text-stone-600">Per year</p>
              <p className="mt-3 text-sm font-semibold text-amber-800">
                New-member offer: 2 years for $25
              </p>
              <p className="mt-1 text-xs text-stone-600">
                Pay for one year and receive two years of membership.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 p-5 text-center">
              <h3 className="font-semibold text-buddhist-burgundy">Benefactor Membership</h3>
              <p className="mt-3 font-serif text-3xl font-bold text-buddhist-burgundy">$500</p>
              <p className="mt-1 text-xs text-stone-600">Per year</p>
            </div>

            <div className="rounded-xl border border-stone-200 p-5 text-center">
              <h3 className="font-semibold text-buddhist-burgundy">Lifetime Membership</h3>
              <p className="mt-3 font-serif text-3xl font-bold text-buddhist-burgundy">$3,000</p>
              <p className="mt-1 text-xs text-stone-600">One-time membership</p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs leading-relaxed text-stone-500">
            This registration form creates your member account; payment is not collected online through this form.
          </p>
        </section>

        {/* MEMBERSHIP BENEFITS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="font-semibold text-buddhist-burgundy">
              200+ Free Meditation Sessions
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Access more than 200 free meditation sessions held every Saturday and Sunday.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="font-semibold text-buddhist-burgundy">
              Free English Learning Camp in 2027
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Take part in a free English Learning Camp running for approximately 4–6 months in 2027.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="font-semibold text-buddhist-burgundy">
              Butter Lamp Offering
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              One butter lamp offering will be made in each new member’s name.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="font-semibold text-buddhist-burgundy">
              Join Our Community
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Build a connection with the Zero Point Meditation Center community.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">

          {/* SIGNED-IN MEMBER DASHBOARD */}

          {user && mode !== 'reset' ? (
            <div className="py-6">

              <div className="mb-6 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-buddhist-gold">
                  ZPMC Community
                </p>

                <h2 className="mt-2 font-serif text-2xl font-bold text-buddhist-burgundy">
                  Welcome, {memberProfile?.full_name || user.email}
                </h2>

                <p className="mt-2 text-sm text-stone-500">
                  Your community membership account
                </p>
              </div>

              {profileLoading ? (
                <p className="py-8 text-center text-stone-500">
                  Loading your membership details...
                </p>
              ) : profileError ? (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  {profileError}
                </div>
              ) : !memberProfile ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-center">
                  <p className="font-semibold text-buddhist-burgundy">
                    Membership profile not found
                  </p>

                  <p className="mt-2 text-sm text-stone-600">
                    Your login works, but we could not find a matching member
                    record. Please contact the ZPMC team.
                  </p>
                </div>
              ) : (
                <>
                  {/* DIGITAL MEMBERSHIP CARD */}

                  <div className="rounded-2xl border-2 border-amber-200 bg-buddhist-bg p-6">

                    <div className="text-center">
                      <h3 className="font-serif text-xl font-bold text-buddhist-burgundy">
                        Zero Point Meditation Center
                      </h3>

                      <p className="mt-1 text-xs uppercase tracking-widest text-buddhist-gold">
                        Community Membership Card
                      </p>
                    </div>

                    <div className="my-6 border-t border-amber-200" />

                    <div className="text-center">
                      <p className="text-sm text-stone-500">
                        Member Name
                      </p>

                      <p className="text-lg font-semibold text-buddhist-burgundy">
                        {memberProfile.full_name}
                      </p>
                    </div>

                    {/* PROMINENT MEMBERSHIP NUMBER */}

                    <div className="my-6 rounded-xl border-2 border-amber-300 bg-white px-5 py-6 text-center shadow-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                        Membership Number
                      </p>

                      <p className="mt-2 font-serif text-5xl font-bold tracking-wider text-buddhist-burgundy">
                        {memberProfile.display_member_number ?? 'Pending'}
                      </p>

                      <p className="mt-2 text-xs text-stone-500">
                        Present this number to ZPMC staff when attending a
                        community class.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                      <div>
                        <p className="text-xs text-stone-500">
                          Membership Status
                        </p>

                        <p className="mt-1 font-bold capitalize text-buddhist-burgundy">
                          {memberProfile.status}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-stone-500">
                          Registered Email
                        </p>

                        <p className="mt-1 break-all text-sm text-stone-700">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    {memberProfile.created_at && (
                      <div className="mt-4">
                        <p className="text-xs text-stone-500">
                          Member Since
                        </p>

                        <p className="mt-1 text-sm text-stone-700">
                          {new Date(
                            memberProfile.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    <div className="mt-6 border-t border-amber-200 pt-5">
                      <p className="text-center text-xs font-medium tracking-wider text-buddhist-gold">
                        PRESERVING HIMALAYAN LINEAGE WISDOM
                      </p>
                    </div>

                  </div>

                  {/* MEMBERSHIP BENEFITS */}

                  <div className="mt-6 rounded-xl border border-stone-200 p-5">
                    <h3 className="font-semibold text-buddhist-burgundy">
                      Your Membership Benefits
                    </h3>

                    <ul className="mt-3 space-y-2 text-sm text-stone-600">
                      <li>• Access to 200+ free meditation sessions held every Saturday and Sunday</li>
                      <li>• Free English Learning Camp in 2027, running for approximately 4–6 months</li>
                      <li>• One butter lamp offering made in your name</li>
                      <li>• Connection with the Zero Point Meditation Center community</li>
                    </ul>
                  </div>

                  {/* WEEKLY ATTENDANCE AND MEMBER DISCOUNTS */}

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">

                    {/* WEEKLY ATTENDANCE */}

                    <div className="rounded-xl border border-stone-200 p-5">
                      <h3 className="font-semibold text-buddhist-burgundy">
                        Weekly Attendance
                      </h3>

                      {attendanceLoading ? (
                        <p className="mt-3 text-sm text-stone-500">
                          Loading your attendance...
                        </p>
                      ) : attendanceError ? (
                        <p className="mt-3 text-sm text-red-600">
                          {attendanceError}
                        </p>
                      ) : (
                        <>
                          {attendance.some(
                            (record) =>
                              record.week_start === getWeekStart()
                          ) ? (
                            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
                              <p className="font-semibold text-green-800">
                                Your free class has been used this week.
                              </p>

                              <p className="mt-1 text-sm text-green-700">
                                Thank you for attending a ZPMC community class!
                              </p>
                            </div>
                          ) : (
                            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                              <p className="font-semibold text-buddhist-burgundy">
                                Your free class is available this week.
                              </p>

                              <p className="mt-1 text-sm text-stone-600">
                                Present your membership number to staff when
                                you attend.
                              </p>
                            </div>
                          )}

                          <div className="mt-5">
                            <p className="text-sm font-semibold text-buddhist-burgundy">
                              Attendance History
                            </p>

                            {attendance.length === 0 ? (
                              <p className="mt-2 text-sm text-stone-500">
                                You have no recorded attendance yet.
                              </p>
                            ) : (
                              <div className="mt-3 space-y-3">
                                {attendance.slice(0, 5).map((record) => (
                                  <div
                                    key={record.id}
                                    className="flex items-center justify-between border-b border-stone-100 pb-3"
                                  >
                                    <div>
                                      <p className="text-sm font-medium text-stone-700">
                                        Community Meditation Class
                                      </p>

                                      <p className="text-xs text-stone-500">
                                        {new Date(
                                          `${record.class_date}T00:00:00`
                                        ).toLocaleDateString()}
                                      </p>
                                    </div>

                                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                      Attended
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {attendance.length > 5 && (
                              <p className="mt-3 text-xs text-stone-500">
                                Showing your 5 most recent classes.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>

                    {/* MEMBER DISCOUNTS */}

                    <div className="rounded-xl border border-stone-200 p-5">
                      <h3 className="font-semibold text-buddhist-burgundy">
                        Member Discounts
                      </h3>

                      <p className="mt-2 text-sm text-stone-500">
                        Your eligible member discounts will appear here once
                        the ZPMC team configures them.
                      </p>
                    </div>

                  </div>
                </>
              )}

              {/* SIGN OUT */}

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={loading}
                  className="rounded-lg border border-buddhist-burgundy px-6 py-3 font-semibold text-buddhist-burgundy transition hover:bg-buddhist-burgundy hover:text-white disabled:opacity-60"
                >
                  {loading ? 'Signing out…' : 'Sign Out'}
                </button>
              </div>

            </div>
          ) : (
            <>
              {mode !== 'reset' && (
                <div className="mb-6 grid grid-cols-2 rounded-lg bg-stone-100 p-1">

                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className={`rounded-md px-4 py-3 text-sm font-semibold transition ${
                      mode === 'signup'
                        ? 'bg-buddhist-burgundy text-white shadow-sm'
                        : 'text-stone-600 hover:text-buddhist-burgundy'
                    }`}
                  >
                    Sign Up
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className={`rounded-md px-4 py-3 text-sm font-semibold transition ${
                      mode === 'signin' || mode === 'forgot'
                        ? 'bg-buddhist-burgundy text-white shadow-sm'
                        : 'text-stone-600 hover:text-buddhist-burgundy'
                    }`}
                  >
                    Sign In
                  </button>

                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              {message && (
                <div
                  role="status"
                  className="mb-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800"
                >
                  {message}
                </div>
              )}

              {/* SIGN UP */}

              {mode === 'signup' && (
                <>
                  <h2 className="mb-6 font-serif text-2xl font-bold text-buddhist-burgundy">
                    Membership Registration
                  </h2>

                  <form onSubmit={handleSignup} className="space-y-5">
                    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                      <label htmlFor="membership-plan" className="mb-2 block text-sm font-semibold text-buddhist-burgundy">Choose your membership plan</label>
                      <select id="membership-plan" value={membershipPlan} onChange={event => setMembershipPlan(event.target.value)} className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100">
                        <option value="yearly">Yearly Membership — $25/year (new members: 2 years for $25)</option>
                        <option value="benefactor">Benefactor Membership — $500/year</option>
                        <option value="lifetime">Lifetime Membership — $3,000 one-time</option>
                      </select>
                      <p className="mt-2 text-xs text-stone-600">Pay using Zelle, then upload your receipt before creating your membership.</p>
                      <button type="button" onClick={() => setZelleQrOpen(true)} className="mt-4 rounded-lg border border-buddhist-burgundy px-4 py-2.5 text-sm font-semibold text-buddhist-burgundy transition hover:bg-buddhist-burgundy hover:text-white">View Zelle Payment QR</button>
                    </div>
                    <div>
                      <label
                        htmlFor="full_name"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Full Name *
                      </label>

                      <input
                        id="full_name"
                        name="full_name"
                        value={form.full_name}
                        onChange={handleChange}
                        required
                        minLength={2}
                        maxLength={120}
                        autoComplete="name"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Email Address *
                      </label>

                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="phone"
                          className="mb-1 block text-sm font-medium text-stone-700"
                        >
                          Phone Number
                        </label>

                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          autoComplete="tel"
                          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                          placeholder="Phone number"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="country"
                          className="mb-1 block text-sm font-medium text-stone-700"
                        >
                          Country
                        </label>

                        <input
                          id="country"
                          name="country"
                          value={form.country}
                          onChange={handleChange}
                          autoComplete="country-name"
                          className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                          placeholder="Your country"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Create Password *
                      </label>

                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Confirm Password *
                      </label>

                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your password again"
                      />
                    </div>

                    <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                      <h3 className="font-semibold text-buddhist-burgundy">Upload Payment Proof *</h3>
                      <p className="mt-1 text-sm text-stone-600">Upload a screenshot, receipt photo, or bank statement. Accepted: JPG, PNG, WebP, or PDF. Maximum size: 10 MB.</p>
                      <input id="membership-payment-proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handlePaymentProofSelection} className="mt-3 block w-full text-sm text-stone-700 file:mr-3 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:font-semibold file:text-buddhist-burgundy" required />
                      {paymentProof && <p className="mt-2 break-all text-xs text-stone-600">Selected: {paymentProof.name}</p>}
                      <button type="button" onClick={handleUploadPaymentProof} disabled={!paymentProof || proofUploading || Boolean(paymentProofPath)} className="mt-3 rounded-lg border border-buddhist-burgundy px-4 py-2.5 text-sm font-semibold text-buddhist-burgundy disabled:cursor-not-allowed disabled:opacity-50">
                        {proofUploading ? 'Uploading Receipt…' : paymentProofPath ? 'Payment Proof Uploaded' : 'Upload Payment Proof'}
                      </button>
                      {paymentProofPath && <p className="mt-2 text-sm font-semibold text-green-700">Your receipt is securely uploaded.</p>}
                    </div>

                    <p className="text-xs leading-relaxed text-stone-500">
                      Fields marked * are required. Your membership account will be created after your payment proof has uploaded successfully. You will then receive an email verification link.
                    </p>

                    <button
                      type="submit"
                      disabled={loading || !paymentProofPath || proofUploading}
                      className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Creating Membership…' : 'Create Membership'}
                    </button>
                  </form>
                </>
              )}

              {/* SIGN IN */}

              {mode === 'signin' && (
                <>
                  <h2 className="mb-6 font-serif text-2xl font-bold text-buddhist-burgundy">
                    Member Sign In
                  </h2>

                  <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                      <label
                        htmlFor="login-email"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Email Address
                      </label>

                      <input
                        id="login-email"
                        name="email"
                        type="email"
                        value={loginForm.email}
                        onChange={handleLoginChange}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your registered email"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="login-password"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Password
                      </label>

                      <input
                        id="login-password"
                        name="password"
                        type="password"
                        value={loginForm.password}
                        onChange={handleLoginChange}
                        required
                        autoComplete="current-password"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Signing in…' : 'Sign In to Your Account'}
                    </button>
                  </form>

                  <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-center">
                    <button
                      type="button"
                      onClick={handleSendLoginCode}
                      disabled={loading}
                      className="text-sm font-medium text-buddhist-burgundy underline disabled:opacity-60"
                    >
                      Email me a one-time code
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('otp')}
                      className="text-sm font-medium text-buddhist-burgundy underline"
                    >
                      I already have a code
                    </button>
                  </div>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(loginForm.email);
                        switchMode('forgot');
                      }}
                      className="text-sm font-medium text-buddhist-burgundy underline"
                    >
                      Forgot your password?
                    </button>
                  </div>

                  <p className="mt-4 text-center text-sm text-stone-500">
                    Not a member yet?{' '}

                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="font-semibold text-buddhist-burgundy underline"
                    >
                      Join the community
                    </button>
                  </p>
                </>
              )}

              {/* ONE-TIME EMAIL CODE SIGN-IN */}

              {mode === 'otp' && (
                <>
                  <h2 className="mb-3 font-serif text-2xl font-bold text-buddhist-burgundy">
                    Sign In with One-Time Code
                  </h2>

                  <p className="mb-6 text-sm text-stone-600">
                    Enter the registered email address and the one-time code sent by ZPMC. Codes expire for your security.
                  </p>

                  <form onSubmit={handleVerifyLoginCode} className="space-y-5">
                    <div>
                      <label
                        htmlFor="otp-login-email"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Registered Email Address
                      </label>
                      <input
                        id="otp-login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(event) => setLoginForm((previous) => ({ ...previous, email: event.target.value }))}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your registered email"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="otp-login-code"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        One-Time Code
                      </label>
                      <input
                        id="otp-login-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={otpCode}
                        onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 8))}
                        required
                        minLength={6}
                        maxLength={8}
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 tracking-[0.25em] outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter email code"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:opacity-60"
                    >
                      {loading ? 'Verifying…' : 'Verify Code & Sign In'}
                    </button>
                  </form>

                  <div className="mt-5 flex flex-wrap justify-center gap-5 text-center">
                    <button
                      type="button"
                      onClick={handleSendLoginCode}
                      disabled={loading}
                      className="text-sm font-medium text-buddhist-burgundy underline disabled:opacity-60"
                    >
                      Send a new code
                    </button>
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="text-sm font-medium text-buddhist-burgundy underline"
                    >
                      Back to password sign in
                    </button>
                  </div>
                </>
              )}

              {/* FORGOT PASSWORD */}

              {mode === 'forgot' && (
                <>
                  <h2 className="mb-3 font-serif text-2xl font-bold text-buddhist-burgundy">
                    Reset Your Password
                  </h2>

                  <p className="mb-6 text-sm text-stone-600">
                    Enter the email address connected to your membership.
                    We will send you a password reset link.
                  </p>

                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div>
                      <label
                        htmlFor="reset-email"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Email Address
                      </label>

                      <input
                        id="reset-email"
                        type="email"
                        value={resetEmail}
                        onChange={(event) => setResetEmail(event.target.value)}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your registered email"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:opacity-60"
                    >
                      {loading ? 'Sending…' : 'Send Reset Link'}
                    </button>
                  </form>

                  <p className="mt-5 text-center text-sm">
                    <button
                      type="button"
                      onClick={() => switchMode('signin')}
                      className="font-semibold text-buddhist-burgundy underline"
                    >
                      Back to Sign In
                    </button>
                  </p>
                </>
              )}

              {/* SET NEW PASSWORD */}

              {mode === 'reset' && (
                <>
                  <h2 className="mb-3 font-serif text-2xl font-bold text-buddhist-burgundy">
                    Set a New Password
                  </h2>

                  <p className="mb-6 text-sm text-stone-600">
                    Choose a new password for your ZPMC Community Membership.
                  </p>

                  <form onSubmit={handleUpdatePassword} className="space-y-5">
                    <div>
                      <label
                        htmlFor="new-password"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        New Password
                      </label>

                      <input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="At least 8 characters"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirm-new-password"
                        className="mb-1 block text-sm font-medium text-stone-700"
                      >
                        Confirm New Password
                      </label>

                      <input
                        id="confirm-new-password"
                        type="password"
                        value={confirmNewPassword}
                        onChange={(event) =>
                          setConfirmNewPassword(event.target.value)
                        }
                        required
                        minLength={8}
                        autoComplete="new-password"
                        className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-buddhist-gold focus:ring-2 focus:ring-amber-100"
                        placeholder="Enter your new password again"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:opacity-60"
                    >
                      {loading ? 'Updating Password…' : 'Save New Password'}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {zelleQrOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4" onClick={(event) => { if (event.target === event.currentTarget) setZelleQrOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="membership-zelle-title" className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h2 id="membership-zelle-title" className="font-serif text-xl font-bold text-buddhist-burgundy">ZPMC Zelle Payment</h2>
            <p className="mt-2 text-sm text-stone-600">ZERO POINT MEDITATION CENTER INC.</p>
            <div className="my-5 flex justify-center rounded-xl bg-white p-3">
              <QRCodeSVG value={zelleQrValue} size={260} level="H" bgColor="#ffffff" fgColor="#000000" includeMargin />
            </div>
            <p className="text-xs text-stone-500">Scan this QR code with your Zelle app to make your membership payment.</p>
            <button type="button" onClick={() => setZelleQrOpen(false)} className="mt-5 w-full rounded-lg bg-buddhist-burgundy px-5 py-3 font-semibold text-white">Close</button>
          </div>
        </div>
      )}

    </section>
  );
}
