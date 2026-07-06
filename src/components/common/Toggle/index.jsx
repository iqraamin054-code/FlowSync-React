import React from 'react';

export default function Toggle({ checked = false, onChange }) {
  return <input type="checkbox" checked={checked} onChange={onChange} />;
}
