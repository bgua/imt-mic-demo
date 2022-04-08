import React from 'react';
import './index.css';

export default function ImageWrapper(props) {
    return (
        <div className="px-12 cursor-pointer">
            <img src={props.imgSrc} alt={props.alt} className="img rounded-lg" />
        </div>
    )
}