import styled from "@emotion/styled";

export const PrimaryButton = styled.button`
  appearance: none;
  outline: none;
  box-sizing: border-box;

  padding: 16px 0;
  width: 100%;  
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--green);
  border: 2px solid var(--green);
  border-radius: 4px;

  font-weight: bold;  
  font-size: 20px;
  line-height: 23px;

  color: var(--gray-0);
  
  cursor: pointer;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
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
  border: 2px solid var(--gray-9);
  background: transparent;
  
  font-weight: bold;
  font-size: 20px;
  line-height: 23px;

  color: var(--gray-9);
  
  cursor: pointer;
  
  &:disabled {
    color: #C4C4C4;
    border-color: #C4C4C4;
    cursor: not-allowed;
  }
`;