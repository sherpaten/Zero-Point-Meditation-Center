import React from 'react';
import { useNavigate } from 'react-router-dom';
import MembershipPrompt from '../components/MembershipPrompt.jsx';

export default function MembershipRegistration() {
  const navigate = useNavigate();

  return (
    <MembershipPrompt
      open
      source="navigation"
      onClose={() => navigate('/home')}
    />
  );
}
