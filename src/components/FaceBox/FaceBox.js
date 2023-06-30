import React from 'react';
import './FaceBox.css'

const FaceBox = (props) => {
    return (
        <div className='bounding-box' style={{ 
            top: props.top,
            right: props.right,
            bottom: props.bottom,
            left: props.left }} >
        </div>
    );
}

export default FaceBox;