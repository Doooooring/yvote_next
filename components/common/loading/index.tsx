import styled from "styled-components";

export default function Loading({state} : {state : boolean}) {
    return <Wrapper state={state}></Wrapper>
}

interface WrapperProps {
    state : boolean;
}

const Wrapper = styled.div<WrapperProps>`

`