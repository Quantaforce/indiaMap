import * as d3 from 'd3';
import { height,width } from './constant';
export function drawMap(toolTip,geoData,menu,zoomed,setZoomed) {
      const projection = d3.geoMercator().center([80,22]).scale(800).translate([width/2,height/2]);
      const pathGenerator = d3.geoPath().projection(projection);
      const svg=d3.select('#mapSvg');
      svg.selectAll('g').remove();
      const g=svg.append('g');
      const zoom=d3.zoom()
        .scaleExtent([1,8])
        .on('zoom',(event)=>{
        svg.selectAll('path').attr('transform',event.transform);
      })
      svg.call(zoom);
      const tooltip = d3.select(toolTip.current)
        g 
        .selectAll('path')
        .data(geoData.features)
        .join('path')
        .attr('class','boundary')
        .attr('d',pathGenerator)
        .attr('fill','#a6bddb')
        .attr('stroke','black')
        .attr('stroke-width',0.25)
        .on('mouseover',function(event,d){
          tooltip.transition().duration(200).style('display','block');
          tooltip.html(menu==='1'?d.properties.ST_NM:`${d.properties.district}, ${d.properties.st_nm}`)
            .style('left',(event.pageX)+'px')
            .style('top',(event.pageY-60)+'px');
        })
        .on('mousemove',function(event,d){
          tooltip
            .style('left',(event.pageX)+'px')
            .style('top',(event.pageY-60)+'px');
        })
        .on('mouseout',function(){
          tooltip.transition().duration(200).style('display','none');
        })
      .on('click', function (event, d) {
          if(zoomed){
            svg.transition()
              .duration(750)
              .call(zoom.transform, d3.zoomIdentity);
            setZoomed(false);
          }
          else{
            setZoomed(true);
            const bounds = pathGenerator.bounds(d);
            const dx = bounds[1][0] - bounds[0][0];
            const dy = bounds[1][1] - bounds[0][1];
            const x = (bounds[0][0] + bounds[1][0]) / 2;
            const y = (bounds[0][1] + bounds[1][1]) / 2;
            const scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height)));
            const translate = [width / 2 - scale * x, height / 2 - scale * y];
            svg.transition()
              .duration(750)
              .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
          }
      });
}
