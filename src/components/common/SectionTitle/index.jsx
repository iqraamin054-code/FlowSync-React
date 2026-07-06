import React from 'react';

export default function SectionTitle({ title, subtitle }) {
  return (
    <div>
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
