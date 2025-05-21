import React from 'react';

const Button = ({onClick, title, loading}) => {
    if(loading){
        return <button disabled>Loading ...</button>;
    }
    return <button onClick={onClick}>{title}</button>
};

export default Button;