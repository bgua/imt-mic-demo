import React from 'react';
import microscope from './images/axiozoom-optical-inspection.jpg';
import measurement from './images/spectrum-coordinate-measuring-machine-250x250.jpg';
import ImageWrapper from '../../components/image-wrapper';

const images = [
    {
        imgSrc: measurement,
        alt: "measurement"
    },
    {
        imgSrc: microscope,
        alt: "microscope"
    }
];

export default function Machines() {

    return (
        <div className="text-black flex justify-center items-center h-full">
            { images.map(img => (<ImageWrapper {...img} />))}
        </div>
    )
}