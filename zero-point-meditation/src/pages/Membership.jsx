
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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
            'id, member_number, full_name, phone, country, status, created_at'
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
      const { error: signupError } = await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,
        options: {
          emailRedirectTo: `${window.location.origin}/membership`,
          data: {
            full_name: form.full_name.trim(),
            phone: form.phone.trim(),
            country: form.country.trim(),
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

        {/* MEMBERSHIP BENEFITS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="font-semibold text-buddhist-burgundy">
              Weekly Meditation
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              One free community meditation class each week.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-white p-5">
            <h2 className="font-semibold text-buddhist-burgundy">
              Community Benefits
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Member discounts on selected activities and early event updates.
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
                        {memberProfile.member_number ?? 'Pending'}
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
                      <li>
                        • One free community meditation class each week
                      </li>
                      <li>
                        • Discounts on selected ZPMC activities
                      </li>
                      <li>
                        • Early notice of events and community activities
                      </li>
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

                    <p className="text-xs leading-relaxed text-stone-500">
                      Fields marked * are required. By registering, you are
                      requesting a free ZPMC Community Membership.
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Registering…' : 'Join the Community'}
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

                  <div className="mt-5 text-center">
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
    </section>
  );
}
