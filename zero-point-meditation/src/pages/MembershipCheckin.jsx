
import React, { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getWeekStart() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);

  return formatLocalDate(date);
}

export default function MembershipCheckin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [membershipNumber, setMembershipNumber] = useState('');
  const [checking, setChecking] = useState(false);
  const [member, setMember] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // ========================================
  // AUTHENTICATION
  // ========================================

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      setAdminLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;

      if (error) {
        setMessage(error.message);
        setMessageType('error');
      }

      setUser(data?.session?.user || null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      setUser(session?.user || null);
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ========================================
  // VERIFY ADMINISTRATOR ACCESS
  // ========================================

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (!supabase || !user) {
        if (mounted) {
          setIsAdmin(false);
          setAdminLoading(false);
        }
        return;
      }

      setAdminLoading(true);

      const { data, error } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        setIsAdmin(false);
        setMessage(
          `Could not verify administrator access: ${error.message}`
        );
        setMessageType('error');
      } else {
        setIsAdmin(Boolean(data));
      }

      setAdminLoading(false);
    }

    if (!authLoading) {
      checkAdmin();
    }

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  // ========================================
  // CLEAR PREVIOUS RESULTS
  // ========================================

  function clearResult() {
    setMember(null);
    setMessage('');
    setMessageType('');
  }

  // ========================================
  // LOOK UP MEMBER BY MEMBERSHIP NUMBER
  // ========================================

  async function handleCheckin(event) {
    event.preventDefault();

    clearResult();

    const number = membershipNumber.trim();

    if (!number || !/^\d+$/.test(number)) {
      setMessage('Please enter a valid membership number.');
      setMessageType('error');
      return;
    }

    setChecking(true);

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('id, member_number, full_name, status')
        .eq('member_number', Number(number))
        .maybeSingle();

      if (memberError) throw memberError;

      if (!memberData) {
        throw new Error(
          'No membership record was found for this membership number.'
        );
      }

      setMember(memberData);

      if (memberData.status !== 'active') {
        setMessage(
          `This membership is ${memberData.status}. Please contact the ZPMC team before checking in.`
        );
        setMessageType('error');
        return;
      }

      const today = formatLocalDate(new Date());
      const weekStart = getWeekStart();

      // Check whether this member has already attended this week.
      const { data: existingAttendance, error: attendanceError } =
        await supabase
          .from('weekly_attendance')
          .select('member_id')
          .eq('member_id', memberData.id)
          .eq('week_start', weekStart)
          .maybeSingle();

      if (attendanceError) throw attendanceError;

      if (existingAttendance) {
        setMessage(
          'This member has already used their free community class this week.'
        );
        setMessageType('warning');
        return;
      }

      // Record the member's attendance.
      const { error: insertError } = await supabase
        .from('weekly_attendance')
        .insert({
          member_id: memberData.id,
          class_date: today,
          week_start: weekStart,
          checked_in_by: user.id,
        });

      if (insertError) {
        if (insertError.code === '23505') {
          setMessage(
            'Attendance has already been recorded for this member this week.'
          );
          setMessageType('warning');
          return;
        }

        throw insertError;
      }

      setMessage(
        'Attendance recorded successfully. Enjoy your community class!'
      );
      setMessageType('success');
    } catch (error) {
      setMessage(
        error.message || 'Something went wrong during check-in.'
      );
      setMessageType('error');
    } finally {
      setChecking(false);
    }
  }

  // ========================================
  // SIGN OUT
  // ========================================

  async function handleSignOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      setMessageType('error');
      return;
    }

    setIsAdmin(false);
    setMember(null);
    setMembershipNumber('');
    setMessage('');
  }

  // ========================================
  // CONFIGURATION CHECK
  // ========================================

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <p>
          Supabase is not configured. Please check your application setup.
        </p>
      </main>
    );
  }

  // ========================================
  // AUTHENTICATION LOADING
  // ========================================

  if (authLoading || adminLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p>Verifying administrator access...</p>
      </main>
    );
  }

  // ========================================
  // NOT SIGNED IN
  // ========================================

  if (!user) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-semibold">
          Staff Check-in
        </h1>

        <p>Please sign in with your ZPMC administrator account.</p>

        <a
          href="/membership"
          className="mt-6 inline-block rounded-lg bg-amber-800 px-6 py-3 text-white"
        >
          Go to Membership Login
        </a>
      </main>
    );
  }

  // ========================================
  // ACCESS RESTRICTED
  // ========================================

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="mb-4 text-2xl font-semibold">
          Access Restricted
        </h1>

        <p>
          This page is only available to authorized ZPMC administrators.
        </p>

        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 rounded-lg bg-gray-800 px-6 py-3 text-white"
        >
          Sign Out
        </button>
      </main>
    );
  }

  // ========================================
  // ADMIN CHECK-IN PAGE
  // ========================================

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 text-center">
        <p className="mb-2 text-sm font-semibold tracking-widest text-amber-800">
          ZERO POINT MEDITATION CENTER
        </p>

        <h1 className="mb-3 text-3xl font-semibold">
          Member Attendance
        </h1>

        <p className="text-gray-600">
          Enter a member's membership number to verify their account
          and record their weekly community class attendance.
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-6 shadow-md sm:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">
              Membership Check-in
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Signed in as {user.email}
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
            Administrator
          </span>
        </div>

        <form onSubmit={handleCheckin} className="space-y-4">
          <div>
            <label
              htmlFor="membership-number"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Member ID / Membership Number
            </label>

            <input
              id="membership-number"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              value={membershipNumber}
              onChange={(event) => {
                setMembershipNumber(event.target.value);
                clearResult();
              }}
              placeholder="Enter membership number"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-4 text-lg outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <button
            type="submit"
            disabled={checking || !membershipNumber.trim()}
            className="w-full rounded-lg bg-amber-800 py-4 font-semibold text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking ? 'Verifying Member...' : 'Verify & Check In'}
          </button>
        </form>

        {checking && (
          <p className="mt-5 text-center text-sm text-gray-600">
            Verifying membership and attendance...
          </p>
        )}

        {member && (
          <div className="mt-6 rounded-xl border bg-gray-50 p-5">
            <h3 className="mb-4 text-lg font-semibold">
              Member Information
            </h3>

            <div className="space-y-3">
              <p>
                <strong>Member Name:</strong> {member.full_name}
              </p>

              <p>
                <strong>Membership Number:</strong> {member.member_number}
              </p>

              <p>
                <strong>Membership Status:</strong>{' '}
                <span className="capitalize">{member.status}</span>
              </p>
            </div>
          </div>
        )}

        {message && (
          <div
            role="status"
            className={`mt-5 rounded-lg p-4 text-sm ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800'
                : messageType === 'warning'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <a
            href="/membership"
            className="text-amber-800 underline"
          >
            Back to Community Membership
          </a>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={handleSignOut}
          className="text-sm text-gray-500 underline hover:text-gray-800"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}
