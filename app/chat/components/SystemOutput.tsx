import React from 'react';
import styled from 'styled-components';

interface Props {
  text: string;
}

const Styled_System_Output: React.FC<Props> = ({ text }) => {
  return (
      <div className="max-w-[80%] shadow-none border-none bg-transparent">
        <div className="flex items-center gap-1">
          <StyledWrapper>
            <span className="btn-shine">{text}</span>
          </StyledWrapper>
        </div>
      </div>
  );
}

const StyledWrapper = styled.div`
  .btn-shine {
    position: relative;
    display: inline-block;
    padding: 6px 12px;
    color: #fff;
    background: linear-gradient(to right, #9f9f9f 0, #fff 10%, #868686 20%);
    background-position: 0;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shine 3s infinite linear;
    animation-fill-mode: forwards;
    -webkit-text-size-adjust: none;
    font-weight: 500;
    font-size: 14px;
    text-decoration: none;
    white-space: nowrap;
    font-family: "Poppins", sans-serif;
  }
  @-moz-keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }
  @-webkit-keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }
  @-o-keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }
  @keyframes shine {
    0% {
      background-position: 0;
    }
    60% {
      background-position: 180px;
    }
    100% {
      background-position: 180px;
    }
  }`;

export default Styled_System_Output;