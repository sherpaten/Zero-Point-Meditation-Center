
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100';

const buttonClass =
  'rounded-lg bg-amber-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-900 disabled:cursor-not-allowed disabled:opacity-50';

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(
    value.length === 10 ? `${value}T00:00:00` : value
  );

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString();
}

export default function MembershipAdmin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminLoading, setAdminLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [memberEmailAvailable, setMemberEmailAvailable] = useState(true);
  const [emailVerificationAvailable, setEmailVerificationAvailable] = useState(true);
  const [verificationSendingMemberId, setVerificationSendingMemberId] = useState(null);
  const [otpSendingMemberId, setOtpSendingMemberId] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [paymentProofLoading, setPaymentProofLoading] = useState(false);

  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  const [settings, setSettings] = useState(null);
  const [freeClasses, setFreeClasses] = useState('1');
  const [membershipTerm, setMembershipTerm] = useState('ongoing');
  const [discountRules, setDiscountRules] = useState('{}');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const [statusSaving, setStatusSaving] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState(null);
  const [notice, setNotice] = useState('');
  const [noticeType, setNoticeType] = useState('');

  const showNotice = (message, type = 'success') => {
    setNotice(message);
    setNoticeType(type);
  };

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

    async function loadSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        showNotice(error.message, 'error');
      }

      setUser(data?.session?.user || null);
      setAuthLoading(false);
    }

    loadSession();

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
  // ADMINISTRATOR VERIFICATION
  // ========================================

  useEffect(() => {
    let mounted = true;

    async function verifyAdmin() {
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
        showNotice(
          `Could not verify administrator access: ${error.message}`,
          'error'
        );
      } else {
        setIsAdmin(Boolean(data));
      }

      setAdminLoading(false);
    }

    if (!authLoading) {
      verifyAdmin();
    }

    return () => {
      mounted = false;
    };
  }, [user, authLoading]);

  // ========================================
  // LOAD MEMBERS
  // ========================================

  const loadMembers = useCallback(async () => {
    if (!supabase) return;

    setMembersLoading(true);

    // Keep administrator accounts out of the member directory without
    // deleting their member profile or any linked attendance history.
    const { data: adminRows, error: adminRowsError } = await supabase
      .from('admin_users')
      .select('user_id');

    if (adminRowsError) {
      showNotice(`Could not identify administrator accounts: ${adminRowsError.message}`, 'error');
      setMembersLoading(false);
      return;
    }

    const administratorIds = new Set((adminRows || []).map((row) => row.user_id));

    let { data, error } = await supabase
      .from('members')
      .select(
        'id, member_number, display_member_number, full_name, email, email_confirmed_at, phone, country, status, created_at'
      )
      .order('display_member_number', { ascending: true });

    if (error && (error.code === '42703' || /column .*email_confirmed_at.* does not exist/i.test(error.message || ''))) {
      setEmailVerificationAvailable(false);
      const emailFallback = await supabase
        .from('members')
        .select('id, member_number, display_member_number, full_name, email, phone, country, status, created_at')
        .order('display_member_number', { ascending: true });

      data = emailFallback.data;
      error = emailFallback.error;

      if (error && (error.code === '42703' || /column .*email.* does not exist/i.test(error.message || ''))) {
        setMemberEmailAvailable(false);
        const basicFallback = await supabase
          .from('members')
          .select('id, member_number, display_member_number, full_name, phone, country, status, created_at')
          .order('display_member_number', { ascending: true });
        data = basicFallback.data;
        error = basicFallback.error;
        if (!error) {
          showNotice('Member email and verification tracking need the Supabase membership email migration.', 'error');
        }
      } else if (!error) {
        setMemberEmailAvailable(true);
        showNotice('Email verification tracking needs the new Supabase verification migration. Member emails are still available.', 'error');
      }
    } else if (!error) {
      setMemberEmailAvailable(true);
      setEmailVerificationAvailable(true);
    }

    if (error) {
      showNotice(`Could not load members: ${error.message}`, 'error');
    } else {
      // Administrators are not counted or shown as community members.
      setMembers((data || []).filter((member) => !administratorIds.has(member.id)));
    }

    setMembersLoading(false);
  }, []);

  // ========================================
  // LOAD MEMBERSHIP SETTINGS
  // ========================================

  const loadSettings = useCallback(async () => {
    if (!supabase) return;

    setSettingsLoading(true);

    const { data, error } = await supabase
      .from('membership_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      showNotice(
        `Could not load membership settings: ${error.message}`,
        'error'
      );
    } else if (data) {
      setSettings(data);
      setFreeClasses(String(data.free_classes_per_week ?? 1));
      setMembershipTerm(data.membership_term || 'ongoing');
      setDiscountRules(
        JSON.stringify(data.discount_rules ?? {}, null, 2)
      );
    } else {
      setSettings(null);
      showNotice(
        'No membership settings record was found. Please check the Supabase membership_settings table.',
        'error'
      );
    }

    setSettingsLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin && !adminLoading) {
      loadMembers();
      loadSettings();
    }
  }, [isAdmin, adminLoading, loadMembers, loadSettings]);

  // ========================================
  // LOAD SELECTED MEMBER ATTENDANCE
  // ========================================

  useEffect(() => {
    let mounted = true;

    async function loadAttendance() {
      if (!supabase || !selectedMember) {
        setAttendance([]);
        return;
      }

      setAttendanceLoading(true);

      const { data, error } = await supabase
        .from('weekly_attendance')
        .select(
          'id, class_date, week_start, checked_in_by, notes, created_at'
        )
        .eq('member_id', selectedMember.id)
        .order('class_date', { ascending: false });

      if (!mounted) return;

      if (error) {
        setAttendance([]);
        showNotice(
          `Could not load attendance: ${error.message}`,
          'error'
        );
      } else {
        setAttendance(data || []);
      }

      setAttendanceLoading(false);
    }

    loadAttendance();

    return () => {
      mounted = false;
    };
  }, [selectedMember]);

  // ========================================
  // MEMBER SEARCH
  // ========================================

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return members;

    return members.filter((member) => {
      return (
        String(member.display_member_number).includes(term) ||
        (member.full_name || '').toLowerCase().includes(term) ||
        (member.email || '').toLowerCase().includes(term) ||
        (member.phone || '').toLowerCase().includes(term) ||
        (member.country || '').toLowerCase().includes(term)
      );
    });
  }, [members, search]);

  const memberCounts = useMemo(() => {
    return {
      total: members.length,
      pendingVerification: members.filter((member) => !member.email_confirmed_at).length,
      pending: members.filter((member) => member.status === 'pending').length,
      active: members.filter((member) => member.status === 'active').length,
      suspended: members.filter(
        (member) => member.status === 'suspended'
      ).length,
      expired: members.filter((member) => member.status === 'expired').length,
    };
  }, [members]);

  // ========================================
  // UPDATE MEMBERSHIP STATUS
  // ========================================

  async function handleStatusChange(newStatus) {
    if (!selectedMember || !supabase) return;
    if (!['pending', 'active', 'suspended', 'expired'].includes(newStatus)) {
      showNotice('Invalid membership status.', 'error');
      return;
    }
    if (selectedMember.status === newStatus) return;

    const isApproval = newStatus === 'active' && selectedMember.status === 'pending';
    const confirmed = window.confirm(
      isApproval
        ? `Have you independently verified ${selectedMember.full_name}'s payment? Approving will activate membership and send a confirmation email.`
        : `Change ${selectedMember.full_name}'s membership status to ${newStatus}?`
    );
    if (!confirmed) return;

    setStatusSaving(true);
    setNotice('');
    try {
      let updatedMember;
      let emailWarning = '';
      if (isApproval) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        const accessToken = sessionData?.session?.access_token;
        if (!accessToken) throw new Error('Your administrator session has expired. Please sign in again.');
        const response = await fetch('/api/admin-resend-member-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ memberId: selectedMember.id, action: 'approve-membership' }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not approve this membership.');
        updatedMember = result.member;
        if (!result.emailSent) emailWarning = result.emailWarning || 'Membership was approved, but the confirmation email could not be sent.';
      } else {
        const { data, error } = await supabase.from('members').update({ status: newStatus }).eq('id', selectedMember.id).select('*').single();
        if (error) throw error;
        updatedMember = data;
      }
      if (!updatedMember) throw new Error('The server did not return the updated member record.');
      setSelectedMember(updatedMember);
      setMembers((current) => current.map((member) => member.id === updatedMember.id ? updatedMember : member));
      showNotice(emailWarning || (isApproval
        ? 'Payment approval recorded. Membership is active and the confirmation email was sent.'
        : `Membership status updated to ${newStatus}.`), emailWarning ? 'error' : 'success');
    } catch (error) {
      showNotice(error.message || 'Could not update membership status.', 'error');
    } finally {
      setStatusSaving(false);
    }
  }

  // ========================================
  // SEND MEMBER ONE-TIME LOGIN CODE
  // ========================================

  async function handleSendMemberOtp(member) {
    if (!supabase || !member?.id || !member?.email || !memberEmailAvailable) {
      showNotice('A registered member email is not available. Run the Supabase email migration first.', 'error');
      return;
    }

    setOtpSendingMemberId(member.id);
    setNotice('');

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('Your administrator session has expired. Please sign in again.');

      const response = await fetch('/api/admin-send-member-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ memberId: member.id }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not send the one-time login code.');

      showNotice(`A one-time login code has been sent to the registered email for ${member.full_name}.`);
    } catch (error) {
      showNotice(error.message || 'Could not send the one-time login code.', 'error');
    } finally {
      setOtpSendingMemberId(null);
    }
  }

  async function handleViewPaymentProof(member) {
    if (!supabase || !member?.id) return;
    setPaymentProofLoading(true);
    setPaymentProofUrl('');
    setNotice('');
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('Your administrator session has expired. Please sign in again.');
      const response = await fetch('/api/admin-membership-proof', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ memberId: member.id }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not open the payment proof.');
      setPaymentProofUrl(result.signedUrl);
    } catch (error) {
      showNotice(error.message || 'Could not open the payment proof.', 'error');
    } finally {
      setPaymentProofLoading(false);
    }
  }

  // ========================================
  // RESEND MEMBER EMAIL VERIFICATION LINK
  // ========================================

  async function handleResendVerification(member) {
    if (!supabase || !member?.id || !member?.email || !emailVerificationAvailable) {
      showNotice('Email verification tracking is not available. Run the ZPMC verification migration first.', 'error');
      return;
    }

    if (member.email_confirmed_at) {
      showNotice('This member has already verified their email address.', 'error');
      return;
    }

    setVerificationSendingMemberId(member.id);
    setNotice('');

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('Your administrator session has expired. Please sign in again.');

      const response = await fetch('/api/admin-resend-member-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ memberId: member.id }),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not resend the verification email.');

      showNotice(`A new verification link has been sent to ${member.email}.`);
    } catch (error) {
      showNotice(error.message || 'Could not resend the verification email.', 'error');
    } finally {
      setVerificationSendingMemberId(null);
    }
  }

  // ========================================
  // DELETE MEMBER PROFILE (NEVER DELETE AUTH USERS)
  // ========================================

  async function handleDeleteMember(member) {
    if (!supabase || !member?.id) return;

    const confirmed = window.confirm(
      `Permanently remove the membership profile for ${member.full_name} (Member #${member.display_member_number})? Their Supabase login will not be deleted. Linked attendance records may be affected by the database's foreign-key rules. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingMemberId(member.id);
    setNotice('');

    try {
      // A member linked to the administrator allowlist must never be deleted.
      const { data: protectedAdmin, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', member.id)
        .maybeSingle();

      if (adminCheckError) throw adminCheckError;

      if (protectedAdmin) {
        showNotice(
          'This account is registered as a ZPMC administrator and cannot be deleted here.',
          'error'
        );
        return;
      }

      // Request the deleted row back so a zero-row/RLS-filtered delete
      // cannot be mistaken for a successful deletion.
      const { data: deletedMember, error: deleteError } = await supabase
        .from('members')
        .delete()
        .eq('id', member.id)
        .select('id')
        .maybeSingle();

      if (deleteError) throw deleteError;

      if (!deletedMember) {
        showNotice(
          'Supabase did not confirm deleting this member. No member was removed from the dashboard. Check the members table DELETE policy and whether this record still exists.',
          'error'
        );
        return;
      }

      setMembers((current) =>
        current.filter((item) => item.id !== deletedMember.id)
      );

      if (selectedMember?.id === member.id) {
        setSelectedMember(null);
        setAttendance([]);
      }

      showNotice(
        `Membership profile for ${member.full_name} (Member #${member.display_member_number}) was removed. Their Supabase login was not deleted.`
      );
    } catch (error) {
      showNotice(
        `Could not delete member: ${error.message}. If this member has attendance records, the database may require those records to be retained or handled separately.`,
        'error'
      );
    } finally {
      setDeletingMemberId(null);
    }
  }

  // ========================================
  // SAVE MEMBERSHIP SETTINGS
  // ========================================

  async function handleSaveSettings(event) {
    event.preventDefault();

    if (!supabase || !settings?.id) {
      showNotice('Membership settings could not be identified.', 'error');
      return;
    }

    const numberOfClasses = Number(freeClasses);

    if (
      !Number.isInteger(numberOfClasses) ||
      numberOfClasses < 0 ||
      numberOfClasses > 30
    ) {
      showNotice(
        'Free classes per week must be a whole number between 0 and 30.',
        'error'
      );
      return;
    }

    let parsedDiscountRules;

    try {
      parsedDiscountRules = JSON.parse(discountRules);
    } catch {
      showNotice(
        'Discount settings must contain valid JSON. Please check the formatting.',
        'error'
      );
      return;
    }

    setSettingsSaving(true);
    setNotice('');

    const { data, error } = await supabase
      .from('membership_settings')
      .update({
        free_classes_per_week: numberOfClasses,
        membership_term: membershipTerm,
        discount_rules: parsedDiscountRules,
      })
      .eq('id', settings.id)
      .select('*')
      .single();

    if (error) {
      showNotice(
        `Could not save membership settings: ${error.message}`,
        'error'
      );
    } else {
      setSettings(data);
      setFreeClasses(String(data.free_classes_per_week));
      setMembershipTerm(data.membership_term || 'ongoing');
      setDiscountRules(
        JSON.stringify(data.discount_rules ?? {}, null, 2)
      );

      showNotice('Membership settings saved successfully.');
    }

    setSettingsSaving(false);
  }

  // ========================================
  // SIGN OUT
  // ========================================

  async function handleSignOut() {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();

    if (error) {
      showNotice(error.message, 'error');
      return;
    }

    setIsAdmin(false);
    setSelectedMember(null);
    setMembers([]);
    setAttendance([]);
  }

  // ========================================
  // CONFIGURATION
  // ========================================

  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="mt-3">
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
        <h1 className="text-2xl font-semibold">
          ZPMC Admin Dashboard
        </h1>

        <p className="mt-3 text-gray-600">
          Please sign in with your ZPMC administrator account.
        </p>

        <a
          href="/admin-login"
          className="mt-6 inline-block rounded-lg bg-amber-800 px-6 py-3 text-white"
        >
          Go to Administrator Sign In
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
        <h1 className="text-2xl font-semibold">Access Restricted</h1>

        <p className="mt-3 text-gray-600">
          This dashboard is only available to authorized ZPMC administrators.
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
  // ADMIN DASHBOARD
  // ========================================

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-widest text-amber-800">
            ZERO POINT MEDITATION CENTER
          </p>

          <h1 className="mt-2 text-3xl font-serif font-bold text-buddhist-burgundy">
            Membership Administration
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Manage members, attendance, and membership settings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a href="/payment-receipts-admin" className="rounded-lg border border-amber-700 px-4 py-2 text-sm font-semibold text-amber-900 hover:bg-amber-50">Donations & Payment Receipts</a>
          <span className="rounded-full bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
            Administrator
          </span>

          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-500">Signed in as</p>
        <p className="font-semibold text-gray-800">{user.email}</p>
      </div>

      {notice && (
        <div
          role="status"
          className={`mb-6 rounded-lg p-4 text-sm ${
            noticeType === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {notice}
        </div>
      )}

      {/* MEMBER SUMMARY */}

      <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-6">
        {[
          ['Total Members', memberCounts.total],
          ['Pending Payment', memberCounts.pending],
          ['Pending Email', emailVerificationAvailable ? memberCounts.pendingVerification : '—'],
          ['Active', memberCounts.active],
          ['Suspended', memberCounts.suspended],
          ['Expired', memberCounts.expired],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-buddhist-burgundy">
              {value}
            </p>
          </div>
        ))}
      </section>

      {/* MEMBER DIRECTORY */}

      <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Member Directory
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Search and manage registered ZPMC members.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMembers}
            disabled={membersLoading}
            className={buttonClass}
          >
            {membersLoading ? 'Refreshing...' : 'Refresh Members'}
          </button>
        </div>

        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, membership number, phone, or country..."
          className={inputClass}
        />

        {membersLoading ? (
          <p className="py-8 text-center text-gray-500">
            Loading members...
          </p>
        ) : filteredMembers.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            No members found.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-600">
                  <th className="px-4 py-3">Member No.</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Registered Email</th>
                  <th className="px-4 py-3">Email Verification</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Member Since</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className={`border-b last:border-0 ${
                      selectedMember?.id === member.id
                        ? 'bg-amber-50'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-4 font-semibold">
                      {member.display_member_number}
                    </td>

                    <td className="px-4 py-4">
                      {member.full_name}
                    </td>

                    <td className="px-4 py-4">
                      {member.email || 'Not available'}
                    </td>

                    <td className="px-4 py-4">
                      {emailVerificationAvailable ? (
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${member.email_confirmed_at ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-900'}`}>
                          {member.email_confirmed_at ? 'Verified' : 'Pending'}
                        </span>
                      ) : 'Run migration'}
                    </td>

                    <td className="px-4 py-4">
                      {member.phone || '—'}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                          member.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : member.status === 'suspended'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {formatDate(member.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMember(member);
                            setAttendance([]);
                            setNotice('');
                          }}
                          className="font-semibold text-amber-800 underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMember(member)}
                          disabled={deletingMemberId === member.id}
                          className="font-semibold text-red-700 underline disabled:opacity-50"
                        >
                          {deletingMemberId === member.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-gray-500">
          Showing {filteredMembers.length} of {members.length} members.
        </p>
      </section>

      {/* SELECTED MEMBER DETAILS */}

      {selectedMember && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 sm:p-6"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedMember(null);
              setAttendance([]);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="member-details-title"
            className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl sm:p-7"
          >
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold tracking-wide text-amber-800">
                MEMBER DETAILS
              </p>

              <h2 id="member-details-title" className="mt-2 text-2xl font-semibold text-buddhist-burgundy">
                {selectedMember.full_name}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Membership Number: {selectedMember.display_member_number}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedMember(null);
                setAttendance([]);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Registered Email</p>
              <p className="mt-1 break-all font-medium">
                {selectedMember.email || 'Not available — run the Supabase email migration'}
              </p>
              <p className={`mt-2 text-xs font-semibold ${selectedMember.email_confirmed_at ? 'text-green-700' : 'text-amber-700'}`}>
                {emailVerificationAvailable
                  ? (selectedMember.email_confirmed_at ? 'Email verified' : 'Email verification pending')
                  : 'Run the verification migration to see status'}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Phone</p>
              <p className="mt-1 font-medium">
                {selectedMember.phone || 'Not provided'}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Country</p>
              <p className="mt-1 font-medium">
                {selectedMember.country || 'Not provided'}
              </p>
            </div>

            <div className="rounded-lg bg-gray-50 p-4">
              <p className="text-xs text-gray-500">Registration Date</p>
              <p className="mt-1 font-medium">
                {formatDate(selectedMember.created_at)}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
            <h3 className="font-semibold text-gray-900">Membership Payment Proof</h3>
            <p className="mt-1 text-sm text-gray-600">The uploaded receipt is stored privately. Only authorized ZPMC administrators can generate a temporary viewing link.</p>
            <button
              type="button"
              onClick={() => handleViewPaymentProof(selectedMember)}
              disabled={paymentProofLoading}
              className={`${buttonClass} mt-3`}
            >
              {paymentProofLoading ? 'Preparing Secure Link…' : 'View Uploaded Payment Proof'}
            </button>
            {paymentProofUrl && (
              <p className="mt-3 text-sm">
                <a href={paymentProofUrl} target="_blank" rel="noreferrer" className="font-semibold text-amber-800 underline">
                  Open receipt (link expires in 60 seconds)
                </a>
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleResendVerification(selectedMember)}
              disabled={!emailVerificationAvailable || !memberEmailAvailable || !selectedMember.email || Boolean(selectedMember.email_confirmed_at) || verificationSendingMemberId === selectedMember.id}
              className={buttonClass}
            >
              {verificationSendingMemberId === selectedMember.id
                ? 'Sending Verification Link...'
                : 'Resend Verification Email'}
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Sends a fresh account-confirmation link to a member whose email is still unverified. A link cannot be retrieved from Supabase after it has been sent.
          </p>

          <div className="mt-5">
            <button
              type="button"
              onClick={() => handleSendMemberOtp(selectedMember)}
              disabled={!memberEmailAvailable || !selectedMember.email || otpSendingMemberId === selectedMember.id}
              className={buttonClass}
            >
              {otpSendingMemberId === selectedMember.id
                ? 'Sending One-Time Code...'
                : 'Send One-Time Login Code'}
            </button>
            <p className="mt-2 text-xs text-gray-500">
              Sends a sign-in code directly to this member's registered email. The code is never shown in the admin dashboard.
            </p>
          </div>

          {/* STATUS MANAGEMENT */}

          <div className="mt-7 border-t pt-6">
            <h3 className="font-semibold text-gray-900">
              Membership Status
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Approve a pending application only after independently confirming the payment. Approval activates membership and sends the member a confirmation email.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <select
                aria-label="Membership status"
                value={selectedMember.status}
                disabled={statusSaving}
                onChange={(event) =>
                  handleStatusChange(event.target.value)
                }
                className="rounded-lg border border-gray-300 px-4 py-3"
              >
                <option value="pending">Pending payment</option>
                <option value="active">Active (approve)</option>
                <option value="suspended">Suspended</option>
                <option value="expired">Expired</option>
              </select>

              {statusSaving && (
                <span className="text-sm text-gray-500">
                  Updating status...
                </span>
              )}
            </div>
          </div>

          {/* ATTENDANCE HISTORY */}

          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Attendance History
            </h3>

            {attendanceLoading ? (
              <p className="mt-4 text-sm text-gray-500">
                Loading attendance...
              </p>
            ) : attendance.length === 0 ? (
              <p className="mt-4 text-sm text-gray-500">
                No attendance records found for this member.
              </p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[450px] text-left text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50 text-gray-600">
                      <th className="px-4 py-3">Class Date</th>
                      <th className="px-4 py-3">Week Starting</th>
                      <th className="px-4 py-3">Attendance</th>
                    </tr>
                  </thead>

                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          {formatDate(record.class_date)}
                        </td>

                        <td className="px-4 py-3">
                          {formatDate(record.week_start)}
                        </td>

                        <td className="px-4 py-3 font-medium text-green-700">
                          Attended
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <p className="mt-3 text-xs text-gray-500">
              Attendance records are read-only in this dashboard.
            </p>
          </div>
          </section>
        </div>
      )}

      {/* MEMBERSHIP SETTINGS */}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Membership Settings
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Configure weekly class benefits and member discounts.
          </p>
        </div>

        {settingsLoading ? (
          <p className="text-sm text-gray-500">
            Loading membership settings...
          </p>
        ) : !settings ? (
          <p className="text-sm text-gray-500">
            Membership settings are not available.
          </p>
        ) : (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <div>
              <label
                htmlFor="free-classes"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Free Community Classes Per Week
              </label>

              <input
                id="free-classes"
                type="number"
                min="0"
                max="30"
                step="1"
                value={freeClasses}
                onChange={(event) =>
                  setFreeClasses(event.target.value)
                }
                className={inputClass}
                required
              />

              <p className="mt-2 text-xs text-gray-500">
                This setting is stored in Supabase. The existing check-in
                process currently enforces one attendance record per member
                per week, so changing this number alone does not change that
                check-in rule.
              </p>
            </div>

            <div>
              <label
                htmlFor="membership-term"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Membership Term
              </label>

              <select
                id="membership-term"
                value={membershipTerm}
                onChange={(event) =>
                  setMembershipTerm(event.target.value)
                }
                className={inputClass}
              >
                <option value="ongoing">Ongoing</option>
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="discount-rules"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Member Discount Rules (JSON)
              </label>

              <textarea
                id="discount-rules"
                rows={9}
                value={discountRules}
                onChange={(event) =>
                  setDiscountRules(event.target.value)
                }
                spellCheck="false"
                className={`${inputClass} font-mono text-sm`}
                placeholder='{"activities": []}'
              />

              <p className="mt-2 text-xs text-gray-500">
                Enter valid JSON. These rules are saved as configuration;
                they do not automatically apply discounts to bookings or
                payments.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={settingsSaving}
                className={buttonClass}
              >
                {settingsSaving
                  ? 'Saving Settings...'
                  : 'Save Membership Settings'}
              </button>

              <button
                type="button"
                onClick={loadSettings}
                disabled={settingsLoading || settingsSaving}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Reload Settings
              </button>
            </div>
          </form>
        )}
      </section>

      <div className="mt-8 text-center">
        <a
          href="/membership-checkin"
          className="font-semibold text-amber-800 underline"
        >
          Open Staff Attendance Check-in
        </a>
      </div>
    </main>
  );
}
