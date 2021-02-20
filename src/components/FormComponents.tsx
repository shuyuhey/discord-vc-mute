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
  font-size: 20px;
  line-height: 23px;

  color: var(--gray-9);
`;

