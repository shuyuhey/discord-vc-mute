import React from "react";
import styled from "@emotion/styled";

const BackButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  box-sizing: border-box;
  cursor: pointer;

  padding: 4px;
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: transparent;

  color: var(--gray-9);

  font-size: 12px;
  line-height: 14px;

  svg {
    margin-right: 8px;
  }

  &:hover {
    background: var(--gray-1);
  }
`;

export const BackButtonWithIcon: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = props => (
  <BackButton {...props}>
    <svg height="14" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M2.82843 9.50001L10.1213 16.7929L8.70711 18.2071L0 9.50001L8.70711 0.792908L10.1213 2.20712L2.82843 9.50001Z"
            fill="#292b31" />
    </svg>
    {props.children}
  </BackButton>
);