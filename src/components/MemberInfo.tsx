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
  overflow: hidden;
  
  > * + * {
    margin-left: 8px;
  }
`;

const ImageWrapper = styled.div`
  overflow: hidden;
  background: var(--gray-3);
  border-radius: 16px;
  width: 24px;
  height: 24px;

  > img {
    width: 24px;
    height: auto;
    line-height: 1;
    object-fit: cover;
  }
`;

const NameWrapper = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: keep-all;
  white-space: nowrap;
`;

export const MemberInfo: React.FC<{ name: string; icon: string; }> = (props) => (
  <MemberInfoContainer>
    <ImageWrapper>
      <img src={props.icon} alt={``} />
    </ImageWrapper>
    <NameWrapper>
      <span>@{props.name}</span>
    </NameWrapper>
  </MemberInfoContainer>
);