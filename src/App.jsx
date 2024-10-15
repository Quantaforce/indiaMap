import './App.css'
import * as d3 from 'd3'
import { useState } from 'react'
import { useRef } from 'react';
import { useEffect } from 'react';
import * as topojson from 'topojson-client'
import { height,width } from './constant';
import { drawMap } from './drawMap';
function App() {
  const [geoData,setGeoData]=useState(null);
  const [districtData,setDistrictData]=useState(null);
  const mapRef=useRef(null);
  const toolTip=useRef(null);
  const [zoomed,setZoomed]=useState(false);
  const [menu,setMenu]=useState('1');
  const feature=useRef({strokecolor:'black',strokesize:'2',bgcolor:'green'})
  useEffect(()=>{
    const getGeoJson=async ()=>{
      try{
        const data = await d3.json('test.geojson');
        const topology= await d3.json('india-districts.json');
        const finalData=topojson.feature(topology,"india-districts-2019-734");
        setGeoData(data);
        setDistrictData(finalData);
      }
      catch(error){
        console.log('there is an error',error);
      }
    }
    getGeoJson();
  },[]);
  useEffect(()=>{
      if(geoData){
        if(menu=="1"){
          drawMap(toolTip,geoData,'1',zoomed,setZoomed,feature);
        }
        else if(menu=="2"){
          drawMap(toolTip,districtData,'2',zoomed,setZoomed,feature);
      }
    }
  },[geoData,menu,zoomed]);
  function changeBg(color) {
    d3.selectAll('path').attr('fill',color);
    feature={...feature,bgcolor:color};
  }
  function changeStrokecolor(color) {
    d3.selectAll('path').attr('stroke',color);
  }
  function changeStrokesize(size) {
    d3.selectAll('path').attr('stroke-width',size/10);
  }

  return <>
    <div className='map-con'>
      <svg id='mapSvg' zoom='false' ref={mapRef} height={height} width={width} preserveAspectRatio='xMidYMid meet' >
      </svg>
    </div>
    <div>
      <label >pick map mode</label>
      <select onChange={e=>setMenu(e.target.value) }>
        <option value='1'>States</option>
        <option value='2'>Districts</option>
      </select>
      <div>
        <label for="bgcolor">pick map bg color</label>
        <input id='bgcolor' defaultValue='#a6bddb' onChange={(e)=>changeBg(e.target.value)} type="color"/>
      </div>
      <div>
        <label for="strokecolor">pick stroke color</label>
        <input id='strokecolor'  onChange={(e)=>changeStrokecolor(e.target.value)} type="color"/>
      </div>
      <div>
        <label for="stroke">pick stroke size</label>
        <input id='stroke' onChange={(e)=>changeStrokesize(e.target.value)} type="range" min="1" defaultValue='2' max="10"/>
      </div>
    </div>
    <p ref={toolTip} className='tooltip'></p>
  </>
}

export default App
