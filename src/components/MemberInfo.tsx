import styled from "@emotion/styled";
import React from "react";

const MemberInfoContainer = styled.div`
  display: flex;
  align-items: center;

  font-weight: bold;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.05em;
  color: var(--blue);

  > img {
    width: 24px;
    height: auto;
    line-height: 1;
    border-radius: 16px;
  }

  > * + * {
    margin-left: 8px;
  }
`;

export const MemberInfo: React.FC<{ name: string; icon: string; }> = (props) => (
  <MemberInfoContainer>
    <img src={props.icon} alt={`${props.name}のアイコン`}
         onError={(e) => e.currentTarget.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='} />
    <span>@{props.name}</span>
  </MemberInfoContainer>
);