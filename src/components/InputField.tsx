import styled from "@emotion/styled";

export const InputField = styled.input`
  display: inline-block;
  padding: 12px 16px;
  width: 100%;
  background: inherit;
  
  border: solid var(--gray-12) 2px;
  border-radius: 8px;
  box-sizing: border-box;

  font-size: 0.9rem;
  color: var(--gray-12);
  
  &:focus {
    border: solid var(--green) 2px;
    outline: var(--green);
  }
`;