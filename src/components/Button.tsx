import styled from "@emotion/styled";

export const PrimaryButton = styled.button`
  appearance: none;
  outline: none;
  box-sizing: border-box;

  padding: 8px 16px;
  width: 100%;  
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--green);
  border: 2px solid var(--green);
  border-radius: 4px;

  font-weight: bold;  
  font-size: 22px;
  line-height: 160%;
  letter-spacing: 0.05em;

  color: var(--gray-1);
  
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
  }
`;

export const SecondaryButton = styled.button`
  appearance: none;
  outline: none;
  box-sizing: border-box;

  padding: 16px 0;
  width: 100%;  
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 2px solid var(--gray-12);
  background: transparent;
  
  font-weight: bold;
  font-size: 22px;
  line-height: 160%;
  letter-spacing: 0.05em;

  color: var(--gray-12);
  background: var(--gray-1);
  
  cursor: pointer;
  
  &:disabled {
    color: var(--gray-12);
    border-color: var(--gray-12);
    cursor: not-allowed;
  }
  
  &:hover {
    background: var(--gray-2);
  }
`;