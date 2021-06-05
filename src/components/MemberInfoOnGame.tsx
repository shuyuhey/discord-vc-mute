import React from "react";
import styled from "@emotion/styled";
import { MemberInfo } from "./MemberInfo";

const MemberOnGame = styled.button<{ isDied: boolean }>`
  appearance: none;
  outline: none;
  border: none;

  padding: 12px 16px;
  background: var(--gray-2);
  border-radius: 24px;
  gap: 12px;

  display: flex;
  align-items: center;

  cursor: pointer;
  
  ${props => props.isDied ? 'filter: grayscale(100%);' : ''};
  
  &:hover {
    background: var(--gray-3);
  }
`;

const DiedCaption = styled.div`
  margin-left: auto;
  font-size: 12px;
  line-height: 12px;
  
  color: var(--gray-9);
`;

type Props = MemberWithGameInfo & {
  setDied: (id: string, isDied: boolean) => Promise<void>
};

export const MemberInfoOnGame: React.FC<Props> = props => {
  const [isLoading, setIsLoading] = React.useState(false);

  const [isDied, setIsDied] = React.useState(props.isDied);

  const handleOnClick = React.useCallback(() => {
    setIsLoading(true);
    setIsDied(!props.isDied);
    props.setDied(props.id, !props.isDied)
      .catch(() => {
        setIsDied(props.isDied);
      }).finally(() => {
      setIsLoading(false);
    });
  }, [setIsDied, props, setIsLoading]);

  React.useEffect(() => {
    setIsDied(props.isDied);
  }, [props.isDied])

  return (
    <MemberOnGame
      onClick={handleOnClick}
      isDied={isDied}
      disabled={isLoading}
    >
      <MemberInfo name={props.name} icon={props.icon} />

      {isDied && (<DiedCaption>やられた！</DiedCaption>)}
    </MemberOnGame>
  );
};