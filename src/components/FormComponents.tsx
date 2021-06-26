import styled from "@emotion/styled";
import { Form } from "formik";
import React from "react";

export const StretchForm = styled(Form)`
  flex: 1;
  display: flex;
  flex-direction: column;

  padding: 32px 16px 16px;
`;

export const FieldContainer = styled.div`
  > * + * {
    margin-top: 8px;
  }

  & + & {
    margin-top: 24px;
  }
`;

export const FieldLabel = styled.div`
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.03em;

  color: var(--gray-12);
`;

export const ErrorLabel = styled.div`
  font-weight: 500;
  font-size: 0.8rem;
  
  color: var(--fatal);
`;