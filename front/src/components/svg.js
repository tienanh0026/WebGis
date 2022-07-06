import { React } from 'react'
import './assets/css/base.css'
import './assets/css/main.css'
import './assets/font/fontawesome-free-6.1.1-web/css/all.min.css'
import './assets/css/font.css'
import logoheader from './assets/img/hust.png'
import React, { useRef , useState, useEffect} from "react";
import { UncontrolledReactSVGPanZoom} from "react-svg-pan-zoom";

function Map() {
    return (
        <div className="container__map" id="container_map1">
        <UncontrolledReactSVGPanZoom  
        ref={Viewer1} 
        width={w}
        height={580}
        SVGBackground={'white'} 
        detectAutoPan={false}
        onClick={event => clickFunction(event)}
        miniatureProps={{position: "right"}} 
        id="map1" >
            
            <svg width={1000} height={580} id="container__map-svg" viewBox="-100 0 1000 580" > 

                <polyline style={{stroke:"#000000", fill:"#FFFFFF"}} strokeWidth="0.9517557621" id="e18_polyline" points="600.535,185.021"/>
                <polyline style={{stroke:"#000000", fill:"#FFFFFF",strokeWidth:"1",}} id="e19_polyline" points="601.487,186.925"/>
                <polyline style={{stroke:"#000000",fill:"#FFFFFF", strokeWidth:"1"}} id="e28_polyline" points="-100.909,140.289,285.504,141.241,284.552,1.332"/>
                <polyline style={{stroke:"#000000",fill:"#FFFFFF",strokeWidth:"1px"}}id="e29_polyline" points="400.666,1.332,402.57,133.627,900.338,134.578"/>
                <polyline style={{stroke:"#000000",fill:"#FFFFFF",strokeWidth:"1"}} id="e30_polyline" points="901.29,264.969,613.859,265.921,617.667,577.145"/>
                <polyline style={{stroke:"#000000",fill:"#FFFFFF",strokeWidth:"1"}} id="e32_polyline" points="511.07,267.824,407.328,268.776,407.328,578.096"/>
                <polyline style={{stroke:"#000000",fill:"#FFFFFF",strokeWidth:"1px"}} id="e33_polyline" points="286.456,577.145,285.504,269.728,-101.861,271.631"/>
                <line id="e34_line" x1="511.07" y1="268.776" x2="511.07" y2="578.096" style={{stroke:"#000000",fill:"#FFFFFF",strokeWidth:"1px"}}/>

                <a id="house-object" href='http://localhost:3000/#'>
                <rect className='house' id="house1" x="115.139" y="283.052" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}}  width="157.04" height="118.969"/>
                <rect className='house' id="house2" x="119.898" y="461.03" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}}  width="149.426" height="116.114"/>
                <rect className='house' id="house3" x="-98.054" y="283.052" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}} width="148.474" height="71.382"/>
                <rect className='house' id="house4" x="-97.102" y="56.534" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}} width="171.316" height="73.285"/>
                <rect className='house' id="house5" x="95.153" y="53.679" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}} width="177.978" height="74.237"/>
                <rect className='house' id="house6" x="629.087" y="496.245" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}} width="148.474" height="71.382"/>
                <rect className='house' id="house7" x="628.135" y="280.197" style={{stroke:"#000000",fill:"#800000",strokeWidth:"1px"}} width="157.04" height="118.969"/>
                </a>

                <circle className='tree' id="e2_circle" cx="458.724" cy="312.557" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>
                <circle className='tree' id="e38_circle" cx="243.626" cy="430.574" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="21.5746"/>
                <circle className='tree' id="e1_circle" cx="460.628" cy="382.987" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>
                <circle className='tree' id="e3_circle" cx="462.532" cy="455.32" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>
                <circle className='tree' id="e4_circle" cx="462.532" cy="531.461" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>
                <circle className='tree' id="e5_circle" cx="656.69" cy="450.562" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>
                <circle className='tree' id="e6_circle" cx="725.216" cy="449.61" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>
                <circle className='tree' id="e40_circle" cx="83.7321" cy="308.75" style={{stroke:"#000000",fill:"#3CB371",strokeWidth:"1px"}} r="23.04"/>

                <ellipse className='lake' id="e43_ellipse" cx="657.64" cy="64.1479" style={{fill:"#0000FF",stroke:"#000000" ,strokeWidth:"1px", }} fillOpacity=".67" rx="226.518" ry="50.443"/>
                </svg>

        </UncontrolledReactSVGPanZoom>
        </div>
    )
}

export default Map