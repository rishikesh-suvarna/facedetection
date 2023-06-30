import React from 'react';
import FaceBox from '../FaceBox/FaceBox';
import './FaceRecognition.css'

const FaceRecognition = ({imageUrl, box, boxes}) => {
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                {
                    imageUrl
                    ?
                    <img id='inputImage' style={{ border: '2px solid #000' }} width={'800px'} height='auto' src={imageUrl} alt='' />
                    :
                    null
                }
                    {
                        boxes.map((box, i) => {
                            return <FaceBox
                            key={i} 
                            top={box.topRow}
                            right={box.rightCol}
                            bottom={box.bottomRow}
                            left={box.leftCol} />
                        })
                    }
            </div>
        </div>
    );
}

export default FaceRecognition;