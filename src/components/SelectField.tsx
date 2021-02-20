import styled from "@emotion/styled";
import React from "react";

const SelectLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 100%;

  border: solid var(--gray-9) 2px;
  border-radius: 8px;
  box-sizing: border-box;

  > svg {
    position: absolute;
    right: 12px;
    width: 12px;
    top: calc(50% - 4px);
    pointer-events: none;
    fill: var(--gray-9);
  }

  &:focus-within {
    border: solid var(--green) 2px;
    outline: var(--green);
  }
`;

const Select = styled.select`
  background: transparent;
  appearance: none;
  outline: none;
  border: none;
  width: 100%;

  font-size: 0.9rem;
  color: var(--gray-9);

  padding: 12px 32px 12px 16px;
`;

export const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = props => (
  <SelectLabel>
    <Select {...props} />

    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10.59 0.294998L6 4.875L1.41 0.294998L0 1.705L6 7.705L12 1.705L10.59 0.294998Z" />
    </svg>
  </SelectLabel>
);