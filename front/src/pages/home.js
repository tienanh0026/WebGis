import '../assets/css/base.css'
import '../assets/css/main.css'
import '../assets/font/fontawesome-free-6.1.1-web/css/all.min.css'
import '../assets/css/font.css'
import '../assets/css/map.css'

import React, { useRef , useState, useEffect} from "react";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";
import {inverse, applyToPoints} from 'transformation-matrix';
import { Point } from 'geojson-to-svg/src/default_styles'


  
const Home = () => {
    const Viewer1 = useRef(null);
    let w = window.innerWidth;
    let a = 0.2*w;
    const [scale, setScale] = useState(0);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);
    const [Button, setButton] = useState(10);
    const distance_vietnam = 0.0006333506258222088;
    const distance_province = 0.0009331911029070842;
    const distance_district = 0.0010366561142713135; 
    //dược lấy từ hàm reduce()

    const [measure,SetMeasure] = useState(false);
    const [measuring,setMeasuring] = useState(false);
    const [info,setInfo] = useState(false);

    function convertToDms(dd, isLng) {
        var dir = dd < 0
          ? isLng ? 'W' : 'S'
          : isLng ? 'E' : 'N';
      
        var absDd = Math.abs(dd);
        var deg = absDd | 0;
        var frac = absDd - deg;
        var min = (frac * 60) | 0;
        var sec = frac * 3600 - min * 60;
        // Round it to 2 decimal points.
        sec = Math.round(sec * 100) / 100;
        return deg + "°" + min + "'" + sec + '"' + dir;
      }

    //This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
    function calcCrow(lat1, lon1, lat2, lon2) 
    {
        var R = 6371; // km
        var dLat = toRad(lat2-lat1);
        var dLon = toRad(lon2-lon1);
        var lat1 = toRad(lat1);
        var lat2 = toRad(lat2);

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }    

    function coordinate_display(event){
        //setX(convertToDms((event.x/15),false));
        //setY(convertToDms((-event.y/15),true));
        // chỉnh lại để xem rìa của tọa độ chỉnh lai

        document.getElementById('x-coordinate').innerHTML = event.x;
        document.getElementById('y-coordinate').innerHTML = event.y;
        // document.getElementById('x-coordinate').innerHTML = convertToDms((event.x/15),false);
        // document.getElementById('y-coordinate').innerHTML = convertToDms((-event.y/15),true);
        // return console.log('click', event.x, event.y, 
    }   

    // function pan_display(event){
    //     // document.getElementById('startX').innerHTML ="start X: "+ event.startX;
    //     // document.getElementById('startY').innerHTML ="start Y: "+ event.startY;
    //     // document.getElementById('endX').innerHTML = "end X: "+event.endX;
    //     // document.getElementById('endY').innerHTML = "end Y: "+event.endY;
    //     // document.getElementById('current_w').innerHTML = "Current width: "+(432.69/Math.pow(1.3,scale));
    //     // document.getElementById('current_h').innerHTML = "Current height: "+(280/Math.pow(1.3,scale));
    //     // // ban đầu tọa độ của O là (1450,-370)
    //     // document.getElementById('new_x').innerHTML = "New X: "+event.endX;
    //     // document.getElementById('new_y').innerHTML = "New Y: "+event.endY;
    //     document.getElementById('e').innerHTML = "translationX: "+(event.startX-event.endX);
    //     document.getElementById('f').innerHTML = "translationY: "+(event.startY-event.endY);
    //     // x={x1} y={y1} width={x2 - x1} height={y2 - y1}
    // }   

    function toogleButton(){
        setButton(Button+1);
        if (Button%2 === 0){
            document.getElementById('button-left').style.display='none';
            document.getElementsByClassName('container__map')[0].style.width = (0,7*w+a);
        }   
        else {
            document.getElementById('button-left').style.display='block';
            document.getElementsByClassName('container__map')[0].style.width=0.7*w;
        }
    }

    function displayObject(button,object) {
        // Get the checkbox
        var checkBox = document.getElementById(button);
        
        // Get the output text
        var elems = document.getElementsByClassName(object);
        
        // If the checkbox is checked, display the output text
        if (checkBox.checked){
            for (var i=0;i<elems.length;i+=1){
                elems[i].style.display = 'block';
              }
        } else {
            for (i=0;i<elems.length;i+=1){
                elems[i].style.display = 'none';
              }
        }
      } 


    const [svg_vietnam,setSvg_vietnam]=useState([]);

    const getSVG = async () => {
        if(svg_vietnam.length == 0){
        try{
            const response = await fetch('http://localhost/api/get-geometry-vietnam/vietnam',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            let responseData = await response.json();
            setSvg_vietnam(responseData)
            //reduce_points(svg_vietnam.svg_geo_vn);
            //console.log(svg_vietnam.svg_geo_vn[0].st_assvg.length);
            for (var b = 0; b <65; b++){
                var a = 'province';
                document.getElementById(a.concat(b+1)).innerHTML = "";
            }
            document.getElementById("svg_districts").innerHTML = "";
            document.getElementById("svg_communes").innerHTML = "";
            var path = '';
            document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
            document.getElementById("layer_1").style.transform = "scale(15,15)";
            getLabel_vietnam();
            //reduce(svg_vietnam.svg_geo_vn);
            // document.getElementById("layer_1").d = responseData.geoVN.rows[0].st_assvg;
            //console.log(responseData.svg_geo.rows[0].svg);
            // document.getElementById("layer_1").innerHTML = responseData.svg_geo_vn.rows[0].svg;
            // console.log(document.getElementById("layer_1"))
        } catch(err) {
            console.log(err)
        }
        }
        else{
            console.log("k can gui tu tren server vè nữa");
            //console.log(svg_vietnam)
            for (var b = 0; b <65; b++){
                var a = 'province';
                document.getElementById(a.concat(b+1)).innerHTML = "";
            }
            document.getElementById("svg_districts").innerHTML = "";
            document.getElementById("svg_communes").innerHTML = "";
            var path = '';
            document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
            document.getElementById("layer_1").style.transform = "scale(15,15)";
            
            getLabel_vietnam();
            //reduce(svg_vietnam.svg_geo_vn);
        }
    }
    
    const [svg_provinces,setSvg_provinces] = useState([]);

    const getSVG_provinces = async () => {
        if(svg_provinces.length == 0){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/provinces',{
                    method: 'GET',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify()
                });
                let responseData= await response.json();
                setSvg_provinces(responseData.svg_geo_provinces)
                // console.log(svg_provinces);
                document.getElementById("layer_1").innerHTML = "";
                document.getElementById("svg_districts").innerHTML = "";
                document.getElementById("svg_communes").innerHTML = "";
                //var new_svg = reduce_points_provinces(svg_provinces);
                for (var z = 0; z < svg_provinces.length; z++){
                    var path = '';
                    var a = 'province';
                    var type = '';
                    if(svg_provinces[z].type_1 === 'Thành phố trực thuộc tỉnh'){
                        type = 'yellow';
                    }
                    else type = 'green';
                    document.getElementById(a.concat(z+1)).innerHTML = path.concat('<path d="',
                    svg_provinces[z].st_assvg,
                    //new_svg[z],
                    '" id="',svg_provinces[z].name_1,' " fill="',type,'"/>');
                    document.getElementById(a.concat(z+1)).style.transform = "scale(15,15)";
                    getLabel_provinces();
                }
                //reduce(svg_provinces);
            } catch(err) {
                console.log(err)
            }
        }
        else{
            console.log("k gui")
            document.getElementById("layer_1").innerHTML = "";
            document.getElementById("svg_districts").innerHTML = "";
            document.getElementById("svg_communes").innerHTML = "";
            //var new_svg = reduce_points_provinces(svg_provinces);
            for (var z = 0; z < svg_provinces.length; z++){
                var path = '';
                var a = 'province';
                var type = '';
                if(svg_provinces[z].type_1 === 'Thành phố trực thuộc tỉnh'){
                    type = 'yellow';
                }
                else type = 'green';
                document.getElementById(a.concat(z+1)).innerHTML = path.concat('<path d="',
                svg_provinces[z].st_assvg,
                //new_svg[z],
                '" id="',svg_provinces[z].name_1,' " fill="',type,'"/>');
                document.getElementById(a.concat(z+1)).style.transform = "scale(15,15)";
                getLabel_provinces();   
            }
            //reduce(svg_provinces);
        }
    }

    const [svg_districts,setSvg_districts] = useState([]);

    const getSVG_district = async () => {
        if(svg_districts.length == 0 ){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/district',{
                    method: 'GET',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify()
                });
                let responseData= await response.json();
                var path ='';
                var district_svg_path = '';
                console.log('a')
                setSvg_districts(responseData.svg_geo_districts);
                //var new_svg = reduce_points_districts(svg_districts);
                for(var i = 0; i < svg_districts.length; i++){
                    var type = '';
                    if(svg_districts[i].type_2 === 'Than Pho'){
                        type = "gold";
                    }
                    if(svg_districts[i].type_2 === 'Thi xa'){
                        type = 'red';
                    }
                    if(svg_districts[i].type_2 === 'Quận'){
                        type = 'blue';
                    }
                    if(svg_districts[i].type_2 === 'Huyện'){
                        type = 'green';
                    }
                    district_svg_path+=path.concat(' <path d="',
                    svg_districts[i].st_assvg
                    //new_svg[i]
                    ,'" id="',svg_districts[i].name_2,'" onClick = {()=>setSvg_commune(',svg_districts[i].name_2,')}  fill="',type,'"  transform="scale(15,15)"/> ');
                }
                //reduce(svg_districts);
                document.getElementById("layer_1").innerHTML = '';
                for (var b = 0; b <65; b++){
                    var a = 'province';
                    document.getElementById(a.concat(b+1)).innerHTML = "";
                }
                document.getElementById("svg_communes").innerHTML = "";
                document.getElementById('svg_districts').innerHTML = district_svg_path;
                getLabel_districts();
            } catch(err) {
                console.log(err)
            }
        }
        else{
            var path ='';
            var district_svg_path = '';
            for(var i = 0; i < svg_districts.length; i++){
                    
                var type = '';
                if(svg_districts[i].type_2 === 'Than Pho'){
                    type = "gold";
                }
                if(svg_districts[i].type_2 === 'Thi xa'){
                    type = 'red';
                }
                if(svg_districts[i].type_2 === 'Quận'){
                    type = 'blue';
                }
                if(svg_districts[i].type_2 === 'Huyện'){
                    type = 'green';
                }
                district_svg_path+=path.concat(' <path d="',
                svg_districts[i].st_assvg
                //new_svg[i]
                ,'" id="',svg_districts[i].name_2,' " fill="',type,'"  transform="scale(15,15)"/> ');
            }
            console.log('a')
            //reduce(svg_districts);
            document.getElementById("layer_1").innerHTML = '';
            for (var b = 0; b <65; b++){
                var a = 'province';
                document.getElementById(a.concat(b+1)).innerHTML = "";
            }
            document.getElementById("svg_communes").innerHTML = "";
            document.getElementById('svg_districts').innerHTML = district_svg_path;
            getLabel_districts();
        }
    }
    
    const takeSVG_district = async (screen) => {
        if(scale<5){
            if(svg_vietnam.length == 0){
                try{
                    const response = await fetch('http://localhost/api/get-geometry-vietnam/vietnam',{
                        method: 'GET',
                        credentials: 'omit',
                        headers: {"Content-Type":'application/json'},
                        body: JSON.stringify()
                    });
                    let responseData = await response.json();
                    setSvg_vietnam(responseData)
                    //reduce_points(svg_vietnam.svg_geo_vn);
                    //console.log(svg_vietnam.svg_geo_vn[0].st_assvg.length);
                    document.getElementById("svg_districts").innerHTML = "";
                    document.getElementById("svg_communes").innerHTML = "";
                    document.getElementById("svg_provinces").innerHTML = "";
                    var path = '';
                    document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
                    document.getElementById("layer_1").style.transform = "scale(15,15)";
                    getLabel_vietnam();
                    //reduce(svg_vietnam.svg_geo_vn);
                    // document.getElementById("layer_1").d = responseData.geoVN.rows[0].st_assvg;
                    //console.log(responseData.svg_geo.rows[0].svg);
                    // document.getElementById("layer_1").innerHTML = responseData.svg_geo_vn.rows[0].svg;
                    // console.log(document.getElementById("layer_1"))
                } catch(err) {
                    console.log(err)
                }
                }
                else{
                    console.log("k can gui tu tren server vè nữa");
                    document.getElementById("svg_districts").innerHTML = "";
                    document.getElementById("svg_communes").innerHTML = "";
                    document.getElementById("svg_provinces").innerHTML = "";
                    var path = '';
                    document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
                    document.getElementById("layer_1").style.transform = "scale(15,15)";
                    
                    getLabel_vietnam();
                    //reduce(svg_vietnam.svg_geo_vn);
                }
        }
        if(scale>5 && scale<11){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/province-new',{
                    method: 'POST',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify({screen})
                });
                let responseData= await response.json();
                var path ='';
                var province_svg_path = '';
                console.log(responseData.province_screen_reduce);
                var svg_provinces = responseData.province_screen_reduce;
                console.log(svg_provinces);
                // console.log(svg_provinces);
                document.getElementById("layer_1").innerHTML = "";
                document.getElementById("svg_districts").innerHTML = "";
                //var new_svg = reduce_points_provinces(svg_provinces);
                for(var i = 0; i < svg_provinces.length; i++){
                    var type = '';
                    if(svg_provinces[i].type_1 === 'Thành phố trực thuộc tỉnh'){
                        type = 'yellow';
                    }
                    if(svg_provinces[i].name_1 == 'Hà Nội'){
                        type = 'red';
                    }
                    else type = 'green'; 
                    province_svg_path+=path.concat(' <path d="',
                    svg_provinces[i].st_assvg
                    ,'" id="',svg_provinces[i].name_1,'" fill="',type,'"  transform="scale(15,15)" /> ');
                }
                document.getElementById('svg_provinces').innerHTML = province_svg_path;
                //console.log(district_svg_path);
                console.log(document.getElementById('svg_provinces'));
            } catch(err) {
                console.log(err)
            }
        }
        if(scale >11){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/district-new',{
                    method: 'POST',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify({screen})
                });
                //console.log(responseData.screen_reduce);
                let responseData= await response.json();
                var path ='';
                var district_svg_path = '';
                var svg_districts = responseData.screen_reduce;
                console.log(svg_districts);
                //var new_svg = reduce_points_districts(svg_districts);
                for(var i = 0; i < svg_districts.length; i++){
                    var type = '';
                    if(svg_districts[i].type_2 === 'Than Pho'){
                        type = "gold";
                    }
                    if(svg_districts[i].type_2 === 'Thi xa'){
                        type = 'red';
                    }
                    if(svg_districts[i].type_2 === 'Quận'){
                        type = 'blue';
                    }
                    if(svg_districts[i].type_2 === 'Huyện'){
                        type = 'green';
                    }
                    district_svg_path+=path.concat(' <path d="',
                    svg_districts[i].st_assvg
                    ,'" id="',svg_districts[i].name_2,'" fill="',type,'"  transform="scale(15,15)" /> ');
                }
                document.getElementById("layer_1").innerHTML = '';
                document.getElementById("svg_provinces").innerHTML = '';
                document.getElementById('svg_districts').innerHTML = district_svg_path;
                //console.log(district_svg_path);
                console.log(document.getElementById('svg_districts'));
            } catch(err) {
                console.log(err)
            }
        }
        
    }

    const [svg_communes,setSvg_communes] = useState([]);

    function getLabel_vietnam(){
        var object = document.getElementById("layer_1");
        var x = object.getBBox().x;
        var y = object.getBBox().y;
        var width = object.getBBox().width;
        var height = object.getBBox().height;
        // console.log(object);
        var path='';
        document.getElementById("label").innerHTML = path.concat('<text id="vietnam_label" x=',x+width/2,' y=',y+height/2,' fill="red" dominant-baseline="middle" text-anchor="middle" font-size="0.5px" font-weight="600">Việt Nam</text>')   //'<text id="vietnam_label" x=',x,' y=',y,' fill="red">Việt Nam</text>'
        // console.log('x: ',x*15,'y: ',y*15,'width: ',width*15,' height:', height*15)
        // console.log(document.getElementById("vietnam_label"))
    }
    function getLabel_provinces(){
        var provinces_label = ''
        for (var z = 0; z < province_bbox.length; z++){
            var a='province'
            var x = province_bbox[z].xmin;
            var y = province_bbox[z].ymin;
            var width = province_bbox[z].xmax-province_bbox[z].xmin;
            var height = province_bbox[z].ymax-province_bbox[z].ymin;
            var path='';
            provinces_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="red" dominantBaseline="middle" textAnchor="middle" font-size="0.08px" font-weight="400">',province_bbox[z].name_1,'</text>')
        }
        document.getElementById("provinces_label").innerHTML = provinces_label;
    }

    function getLabel_districts(){
        var districts_label = ''
        for (var z = 0; z < district_bbox.length; z++){
            var districts = document.getElementById("svg_districts");
            var x = district_bbox[z].xmin;
            var y = district_bbox[z].ymin;
            var width = district_bbox[z].xmax-district_bbox[z].xmin;
            var height = district_bbox[z].ymax-district_bbox[z].ymin;
            var path='';
            var font_size;
            if((district_bbox[z].name_1 === 'Hà Nội' && district_bbox[z].type_2 === 'Quận') || (district_bbox[z].name_1 === 'Hồ Chí Minh city'  && district_bbox[z].type_2 === 'Quận') || (district_bbox[z].name_1 === 'Đà Nẵng' && district_bbox[z].type_2 === 'Quận')){
                font_size = '0.006px';
            }
            else font_size = '0.015 px';
            districts_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="black" dominantBaseline="middle" textAnchor="middle" font-size=',font_size, ' font-weight="400"  >',district_bbox[z].name_2,'</text>')
        }
        document.getElementById("districts_label").innerHTML = districts_label;
    }

    function getLabel_communes(){
        var communes_label = '';
        for (var z = 0; z < svg_communes.length; z++){
            var communes = document.getElementById("svg_communes");
            var object = communes.getElementsByTagName("path");
            var x = object[z].getBBox().x;
            var y = object[z].getBBox().y;
            var width = object[z].getBBox().width;
            var height = object[z].getBBox().height;
            var path='';
            var font_size;
            if((svg_communes[z].name_1 === 'Hà Nội' && svg_communes[z].type_3 ==='ward') || (svg_communes[z].name_1 === 'Hồ Chí Minh city' && svg_communes[z].type_3 ==='ward') || (svg_communes[z].name_1 === 'Đà Nẵng' && svg_communes[z].type_3 ==='ward')){
                font_size = '0.0007px';
            }
            else font_size = '0.0016px';
            communes_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="black" dominantBaseline="middle" textAnchor="middle" font-size=',font_size, ' font-weight="300">',svg_communes[z].name_3,'</text>')
        }
        document.getElementById("communes_label").innerHTML = communes_label;
        console.log("a");
        console.log(document.getElementById("communes_label"))
    }

    const [district_bbox, setDistrict_bbox] = useState(null);

    const getDistrict_bbox = async () => {
        try{
            const response = await fetch('http://localhost/api/get-geometry-vietnam/district_bbox',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            let responseData = await response.json();
            setDistrict_bbox(responseData.svg_district_bbox)
            //console.log(district_bbox);
        } catch(err) {
            console.log(err)
        }
    }

    const [province_bbox, setProvince_bbox] = useState(null);

    const getProvince_bbox = async () => {
        try{
            const response = await fetch('http://localhost/api/get-geometry-vietnam/province_bbox',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            let responseData = await response.json();
            setProvince_bbox(responseData.svg_province_bbox);
            //console.log(province_bbox);
        } catch(err) {
            console.log(err)
        }
    }
    // hàm tính logarit
    function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
      }

    function getLayer(){ 
        if(scale <5){
            // for (var b = 0; b <65; b++){
            //     var a = 'province';
            //     document.getElementById(a.concat(b+1)).innerHTML = "";
            // }
            document.getElementById("provinces_label").innerHTML = "";
            document.getElementById("districts_label").innerHTML = "";
            if (document.getElementById("layer_1").innerHTML !== ""){
                return
            }
            if (document.getElementById("layer_1").innerHTML === ""){
                getSVG();
            }
            //getSVG();
        }
        if(scale >=5 && scale <=11){
            document.getElementById("districts_label").innerHTML = "";
            document.getElementById("communes_label").innerHTML = "";
            if(document.getElementById("province1").innerHTML !==""){
                return
            }
            for (var b = 0; b <65; b++){
                var a = 'province';
                if(document.getElementById(a.concat(b+1)).innerHTML === ""){
                    getSVG_provinces();
                    console.log(b)
                    break;
                }
            }
            // document.getElementById("layer_1").innerHTML = "";
            // document.getElementById("svg_districts").innerHTML = "";
        }
        if(scale>11 ){
            document.getElementById("provinces_label").innerHTML = "";
            //document.getElementById("communes_label").innerHTML = "";
            if(document.getElementById("svg_districts").innerHTML === ""){
                getSVG_district();
            }
        }
        // if (scale > 22){
        //     document.getElementById("districts_label").innerHTML = "";
        //     if(document.getElementById("svg_communes").innerHTML === ""){
        //         getSVG_commune();
        //     }
        // }
    }

    function display_object(){
        if(district_bbox == null){
            return
        }
        else{
            var screen_extend = 1.1;
            if (document.getElementById('province6').innerHTML != ""){
                if(scale > 5 && scale < 8){
                    screen_extend = 1.4;
                }
                else if (scale > 8 && scale < 11){
                    screen_extend = 1.55;
                }
                for (var a=0;a<province_bbox.length;a++){
                    var xmin = province_bbox[a].xmin;
                    var xmax = province_bbox[a].xmax;
                    var ymin = province_bbox[a].ymin;
                    var ymax = province_bbox[a].ymax;
                    var center_x = xmin + (xmax-xmin)/2;
                    var center_y = ymax + (Math.abs(ymin-ymax)/2);
                    // setCoor_x(c[0].x);
                    // setCoor_y(c[0].y);
                    // setScreen_width(c[1].x-c[0].x);
                    // setScreen_height(c[1].y-c[0].y);
                    var coor_x = screen_para[0].x;
                    var coor_y = screen_para[0].y;
                    var screen_width = screen_para[1].x - screen_para[0].x;
                    var screen_height = screen_para[1].y - screen_para[0].y;
                    if(((coor_x-screen_width*(screen_extend-1))<center_x && center_x<(coor_x+screen_width*screen_extend)) && (coor_y-screen_width*(screen_extend-1))< center_y &&center_y<(coor_y+screen_height*screen_extend)){
                        //console.log(province_bbox[a].name_1);
                        var x='province';
                        document.getElementById(x.concat(a+1)).style.display = "block";    
                        //console.log('trong sccreen')
                    }
                    else {
                        var x='province';
                        document.getElementById(x.concat(a+1)).style.display = "none";    
                    }
                    //console.log('coor_x:', coor_x, ' center_x: ',center_x)
                }
                //console.log('coor_x:', coor_x, ' center_x: ',center_x, " endX: ",coor_x+screen_width,'coor_y:', coor_y, ' center_y: ',center_y, " endy: ",coor_y+screen_height)
                //console.log('tỉnh')
                //console.log((coor_x<center_x && center_x<(coor_x+screen_width)) && (coor_y)< center_y &&center_y<(coor_y+screen_height))
                // }
            }
            if(document.getElementById("svg_districts").innerHTML != ""){
                var a='';
                var b='';
                var districts = document.getElementById("svg_districts");
                var object = districts.getElementsByTagName("path");
                if(scale > 11 && scale < 14){
                    screen_extend = 1.65;
                }
                else if(scale > 14 && scale < 16){
                    screen_extend = 1.76;
                }
                else if(scale > 16 && scale < 19){
                    screen_extend = 1.85;
                }
                else if(scale > 19){
                    screen_extend = 2.05;
                }

                for (var a=0;a<district_bbox.length;a++){
                    var xmin = district_bbox[a].xmin;
                    var xmax = district_bbox[a].xmax;
                    var ymin = district_bbox[a].ymin;
                    var ymax = district_bbox[a].ymax;
                    var center_x = xmin + (xmax-xmin)/2;
                    var center_y = ymax + (Math.abs(ymin-ymax)/2);
                    var coor_x = screen_para[0].x;
                    var coor_y = screen_para[0].y;
                    var screen_width = screen_para[1].x - screen_para[0].x;
                    var screen_height = screen_para[1].y - screen_para[0].y;
                    if(((coor_x-screen_width*(screen_extend-1))<center_x && center_x<(coor_x+screen_width*screen_extend)) && (coor_y-screen_width*(screen_extend-1))< center_y &&center_y<(coor_y+screen_height*screen_extend)){
                        object[a].style.display = 'block'
                        //object.style.display = "block";   
                        //a+=b.concat(getSVG_district_test(district_bbox[a].name_2));
                        //console.log('trong sccreen')
                    }
                    else{
                        object[a].style.display = 'none'
                    }
                }
                //document.getElementById('svg_districts').innerHTML = a;
                //console.log("a")
            }
        }
    }
    // const getSVG_district_test = async (name) => {
    //     var z = name;
    //     console.log(z)
    //         try{
    //             const response = await fetch('http://localhost/api/get-geometry-vietnam/district_test',{
    //                 method: 'POST',
    //                 credentials: 'omit',
    //                 headers: {"Content-Type":'application/json'},
    //                 body: JSON.stringify({name})
    //             });
    const getSVG_district_test = async (district_name) => {
                    try{
                        const response = await fetch('http://localhost/api/get-geometry-vietnam/district_test',{
                            method: 'POST',
                            credentials: 'omit',
                            headers: {"Content-Type":'application/json'},
                            body: JSON.stringify({district_name})
                        });
                let responseData= await response.json();
                var path ='';
                var district_svg_path = '';
                
                setSvg_districts(responseData.svg_geo_communes);
                //console.log(svg_districts)
                //var new_svg = reduce_points_districts(svg_districts);
                    var type = '';
                    if(svg_districts[0].type_2 === 'Than Pho'){
                        type = "gold";
                    }
                    if(svg_districts[0].type_2 === 'Thi xa'){
                        type = 'red';
                    }
                    if(svg_districts[0].type_2 === 'Quận'){
                        type = 'blue';
                    }
                    if(svg_districts[0].type_2 === 'Huyện'){
                        type = 'green';
                    }
                    district_svg_path+=path.concat(' <path d="',
                    svg_districts[0].st_assvg
                    ,'"  id="',svg_districts[0].name_2,'" onClick = {()=>setSvg_commune("Hoàng Mai")}  fill="blue"  "/> ');
                    //onClick = {()=>setSvg_commune(',svg_districts[0].name_2,')}  fill="',type,'"  transform="scale(15,15)"/> ');
                // document.getElementById("layer_1").innerHTML = '';
                // for (var b = 0; b <65; b++){
                //     var a = 'province';
                //     document.getElementById(a.concat(b+1)).innerHTML = "";
                // }
                // document.getElementById("svg_communes").innerHTML = "";

                // console.log(district_svg_path);
                // var abc = path.concat(' <path d="',
                // svg_districts[0].st_assvg
                // ,'" id="',svg_districts[0].name_2,'" onClick = {()=>setSvg_commune(',svg_districts[0].name_2,')}  fill="',type,'"  transform="scale(15,15)"/> ');
                // console.log(abc)
                setTest(district_svg_path);
            } catch(err) {
                console.log(err)
            }
    }
    const [test, setTest] = useState(null);
 
    function getLabel(){ 
        if(scale <5){
            document.getElementById("provinces_label").innerHTML = "";
            document.getElementById("districts_label").innerHTML = "";
        }
        if(scale >=5 && scale <=11){
            document.getElementById("districts_label").innerHTML = "";
            getLabel_provinces();
        }
        if(scale>11){
            document.getElementById("provinces_label").innerHTML = "";
            getLabel_districts();
        }
    }



    
    const setSVG_commune = async (e) => {
        var district_name = e.target.id;
        try{
            const response = await fetch('http://localhost/api/get-geometry-vietnam/commune',{
                method: 'POST',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify({district_name})
            });
            let responseData= await response.json();
            var path ='';
            var commune_svg_path = '';
            //console.log(responseData.svg_geo_communes)
            setSvg_communes(responseData.svg_geo_communes);
            console.log(svg_communes);
            document.getElementById("layer_1").innerHTML = '';
            for(var i = 0; i < svg_communes.length; i++){
                var type = '';
                if(svg_communes[i].type_3 === 'Commune'){
                    type = "gold";
                }
                if(svg_communes[i].type_3 === 'Ward'){
                    type = 'red';
                }
                if(svg_communes[i].type_3 === 'Townlet'){
                    type = 'blue';
                }
                commune_svg_path+=path.concat(' <path d="',
                svg_communes[i].st_assvg
                ,'" id="',svg_communes[i].name_3,' " fill="',type,'"  transform="scale(15,15)"/> ');
            }
            document.getElementById('svg_communes').innerHTML = commune_svg_path;
            getLabel_communes();
            //reduce(svg_communes);
        } catch(err) {
            console.log(err)
        }
    }

    function showlist(a) {
        document.getElementById(a).classList.toggle('show')
    }

    //_fitSelection chưa chuẩn
    // const _fitSelection_map1 = () => Viewer2.current.fitSelection(-w, 0, w, 2000); //cho map quận

    const _fitSelection_map = () => {
        
        Viewer1.current.fitSelection(1450, -370, 300, 280); 
    }
    // "102.14499664306646 -23.39273071289091 7.324432373047102 14.829399108887003" viewbox chuẩn cho map 

    // function province_map_selection(xmax,xmin,ymax,ymin){
    //     Viewer1.current.fitSelection(xmin*15, ymin*(-15), (xmax-xmin)*15, (ymax-ymin)*15); 
    //     getSVG_provinces();
    // }

    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();

    function getLocation() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(showPosition);
        } else { 
          console.log = "Geolocation is not supported by this browser.";
        }
      }
      
    function showPosition(position) {
        // x.innerHTML = "Latitude: " + position.coords.latitude + 
        // "<br>Longitude: " + position.coords.longitude;
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log("latitude: ",latitude, " longitude: ",longitude);
        var a = '';
            var point = a.concat('<circle id="current_position" cx="',longitude*15,'" cy="',-latitude*15,'" r="',1/Math.pow(1.3,scale),'" fill="white"  stroke="black" strokeWidth="',1.5/Math.pow(1.3,scale),'" />')
            document.getElementById('position').innerHTML = point;
            console.log( document.getElementById('position'));
      }

    function List_Select() {
        var list1 = document.getElementById('list_provinces');
        var list2 = document.getElementById('list_districts');
        var checkBox = document.getElementsByClassName("list_type");
        if (checkBox[0].checked){
            list1.style.display = 'block';
            list2.style.display = 'none';
        } else if(checkBox[1].checked){
            list1.style.display = 'none';
            list2.style.display = 'block';
        } 
    }


    function findProvince(id){
        getSVG_provinces();
        setTimeout(()=>{
            var a='province'
            var object = document.getElementById(a.concat(id));
            var x = object.getBBox().x;
            var y = object.getBBox().y;
            var width = object.getBBox().width;
            var height = object.getBBox().height;
            console.log( x, y,width,height);   
            Viewer1.current.fitSelection(x*15-11, y*(15)-7, width*15+16, height*15+14)
        }
            ,800 )
    }

    function findDistrict(id){
        getSVG_district();
        setTimeout(()=>{
            var districts = document.getElementById("svg_districts");
            var object = districts.getElementsByTagName("path")
            //console.log(object);
            var x = object[id].getBBox().x;
            var y = object[id].getBBox().y;
            var width = object[id].getBBox().width;
            var height = object[id].getBBox().height;
            console.log( x, y,width,height);   
            Viewer1.current.fitSelection(x*15-2, y*(15)-1, width*15+2, height*15+2)
        }
            ,800 )
    }
    
    const [search_data, setSearchData] = useState([]);
    const [search_data_districts, setSearchData_districts] = useState([]);

    const get_search_list = async () => {
        //showlist('search-container' );
        try{
            const response = await fetch('http://localhost/api/search-provinces',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            let responseData = await response.json();
            setSearchData(responseData.province);
            // console.log(search_data);
        } catch(err) {
            console.log(err)
        }
    }

    const get_search_list_districts = async () => {
        //showlist('search-container' );
        try{
            const response = await fetch('http://localhost/api/search-districts',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            let responseData = await response.json();
            setSearchData_districts(responseData.districts);
            // console.log(search_data);
        } catch(err) {
            console.log(err)
        }
    }

    //bỏ tiếng việt khi search
    function removeAccents(str) {
        return str.normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        }  

    //search
    const [inputText, setInputText] = useState("");

    let inputHandler = (e) => {
        //convert input text to lower case
        var lowerCase = e.target.value.toLowerCase();
        setInputText(lowerCase);
    };

    const filteredData = search_data.filter((el) => {
        if(inputText ===''){
            return el;
        }
        else{
            return removeAccents(el.name_1).toLowerCase().includes(removeAccents(inputText))
        }
    })  

    const filteredData_districts = search_data_districts.filter((el) => {
        if(inputText ===''){
            return el;
        }
        else{
            return removeAccents(el.name_2).toLowerCase().includes(removeAccents(inputText))
        }
    })  

    function List() {
        return (
            <ul >
                {filteredData.map((item1) => (
                <li key={item1.id_1} onClick={()=>findProvince(item1.id_1)} >
                    {/* onClick={()=>selectProvince(item1.id_1)} */}
                    {item1.name_1} 
                </li>
                ))}
            </ul>
            )
        }

    function List_districts() {
        return (
            <ul >
                {filteredData_districts.map((item1) => (
                    <li key={item1.id_2} 
                    onClick={()=>findDistrict(item1.id_2-1)}
                    >{item1.name_2} ({item1.name_1})
                    </li>
                ))}
            </ul>
            )
        }

    function reduce(arr){
        var distance = [];
        for(var z = 0; z< arr.length; z++){
            a = arr[z].st_assvg.split(" ");
            // console.log(a.length);
            // console.log(a[4]-a[6]);
            var cnt_x =0;
            var cnt_y =0;
            var cnt = 0;
            var cnt_test = 0;
            var avg_x = 0;
            var avg_y = 0;
            var avg= 0;
            for (var i = 0; i < a.length;i++){
                if (a[i] == "M" || a[i]=="L"|| a[i]=="Z"){
                    cnt+=1;
                    continue
                }
                if (102 < a[i] ){
                    if(i< a.length-2){
                        if(a[i+2] == "M" || a[i+2] =="L"|| a[i+2]=="Z"){
                            cnt_test+=1;
                        }
                        else{
                            avg_x= Math.pow((a[i]-a[i+2]),2);
                            avg_y= Math.pow((a[i+1]-a[i+3]),2);
                            avg += Math.sqrt(Math.abs(avg_x+avg_y));
                        }
                        cnt_x+=1;
                    }
                }
                else if (a[i] <-8){
                    cnt_y+=1;
                }
            }
            distance.push(avg/cnt_x);
        }
        console.log(a.length)
        // console.log("so luong x: ",cnt_x)
        // console.log("so luong y: ",cnt_y)
        // console.log("so luong diem chữ ",cnt)
        // console.log("so luong diem không xet được khoảng cách: ",cnt_test)
        // console.log("Khoang cach trung binh của layer: ",avg/cnt_x)
        var avg_total = 0;
        for (var x = 0; x<distance.length;x++){
            avg_total += distance[x];
        }
        avg_total = avg_total/distance.length;
        console.log("Khoang cach trung binh của layer: ",avg_total)
        //arr_distance.push(avg/cnt_x);
    }

    function reduce(arr){
        var total_point_reduce = 0;
        var total_points = 0;
        var new_arr = [];
        var distance = [];
        for(var z = 0; z< arr.length; z++){
            a = arr[z].st_assvg.split(" ");
            var cnt_x =0;
            var cnt_y =0;
            var cnt = 0;
            var cnt_test = 0;
            var cnt_points = 0;
            var point_reduce = 0;
            var avg_x = 0;
            var avg_y = 0;
            var avg= 0;
            for (var i = 0; i < a.length;i++){
                if (a[i] == "M" || a[i]=="L"|| a[i]=="Z" ){
                    cnt+=1;
                    continue
                }
                if (a[i] == ""){
                    point_reduce+=1;
                    continue
                }
                if (102 < a[i] ){
                    if(i < a.length-2){
                        if(a[i+2] == "M" || a[i+2] =="L"|| a[i+2]=="Z"){
                            cnt_test+=1;
                        }
                        else{
                            avg_x= Math.pow((a[i]-a[i+2]),2);
                            avg_y= Math.pow((a[i+1]-a[i+3]),2);
                            avg += Math.sqrt(Math.abs(avg_x+avg_y));

                        }
                        cnt_x+=1;
                    }
                    distance.push(avg/cnt_x);
                }
                else if (a[i] <-8){
                    cnt_y+=1;
                }                
            }     
        }
        console.log(arr.length)
        var avg_total = 0;
        for (var x = 0; x<distance.length;x++){
            avg_total += distance[x];
        }
        avg_total = avg_total/distance.length;
        console.log("Khoang cach trung binh của layer: ",avg_total)
        //arr_distance.push(avg/cnt_x);
        return new_arr;
    }


    function onMouseMove(event) {
        //Add code here
        var newLine = document.getElementById('path')
        if (measuring) {
          newLine.setAttribute("x2", event.x);
          newLine.setAttribute("y2", event.y);
        }
      }

    const [screen_para, setScreen_para] = useState(null);


    function show_mode(){
        if(measure){
            document.getElementsByClassName('container__map-mode')[0].innerHTML = "Chế độ đo"
        }
        else
            document.getElementsByClassName('container__map-mode')[0].innerHTML = ""
    }

    function info_mode(){
        setInfo(!info);
        if(info){
            SetMeasure(false);
            console.log(info)
            document.getElementsByClassName('container__map')[0].style.cursor = 'help';
        }
        else document.getElementsByClassName('container__map')[0].style.cursor = 'default'
    }

    useEffect(() => { 
        _fitSelection_map();
        getSVG();
        get_search_list();
        get_search_list_districts();
        getProvince_bbox();
        getDistrict_bbox();
        //getSVG_commune();
        //getSVG_provinces();
        // Run! Like go get some data from an API. run only once
    }, []);

    useEffect(() => { 
        //getLayer();
        //display_object();
        //getLabel();
        show_mode();
        // setTimeout(()=>{
        // display_object()},1000)
        // fitToViewerClick();
        // execute side effect
    })

  return (
    <div>
        <div id="container">
            <div className="container__button-left" style={{width:a}} id='button-left'>
                <ul className="container__button-left-list">
                    <li className="container__button-left-item"  onClick={()=>showlist('map-list')}><i className="fa-solid fa-map-location-dot"> </i>  Danh sách bản đồ</li>
                        <div id='map-list' className='map-dropdown' >
                        </div>
                    <li className="container__button-left-item" onClick={()=>showlist('display-info' )}><i className="fa-solid fa-circle-info"> </i> Thông tin đối tượng</li>
                        <div id='display-info' className='display-info-dropdown' >
                            <p id='location-info' onClick={()=>showlist('location-info-content')}>Vị Trí <i className="fa-solid fa-caret-down"></i>
                            </p>
                                <div id='location-info-content' className='dropdown-info'>
                                </div>
                            <p id='province-info' onClick={()=>showlist('province-info-content')}>Nền hành chính Tỉnh <i className="fa-solid fa-caret-down"></i></p>
                            <div id='province-info-content' className='dropdown-info'>
                                </div>
                            <p id='district-info' onClick={()=>showlist('district-info-content')}>Nền Hành chính Huyện <i className="fa-solid fa-caret-down"></i></p>
                            <div id='district-info-content' className='dropdown-info'>
                                </div>
                            {/* <p>
                                <label htmlFor="display-tree" className='display-info'>Cây</label> 
                                    <input type="checkbox" id="display-tree" defaultChecked={true}  onClick={()=>displayObject('display-tree','tree')}></input>
                            </p>
                            <p>
                                <label htmlFor="display-house" className='display-info'>Nhà</label> 
                                    <input type="checkbox" id="display-house" defaultChecked={true} ></input>
                            </p>
                            <p>
                                <label htmlFor="display-lake" className='display-info'>Hồ</label> 
                                    <input type="checkbox" id="display-lake" defaultChecked={true} onClick={()=>displayObject('display-lake','lake')}></input>
                            </p> */}
                            {/* <a href='#' id='display-lake' onClick={()=>displayLake()}>Sông</a>
                            <a href='#' id='display-house' onClick={()=>displayHouse()}>Nhà</a> */}
                        </div>
                    <li className="container__button-left-item" onClick={()=>showlist('search-container')}><i className="fa-solid fa-magnifying-glass" > </i> Tìm kiếm</li>
                        <div id='search-container' className='search-container1'>
                            <div className='search-type'>
                                <input type='radio' name="myname" className='list_type' defaultChecked={true} onChange={()=>List_Select()}/>  <label htmlFor="provinces_type" >Tỉnh   </label> 
                                <input type='radio' name="myname" className='list_type' onChange={()=>List_Select()} />  <label htmlFor="districts_type" >Quận/Huyện</label> 
                            </div>
                            <div className='search-info'>
                                <input type = "text" placeholder='Tìm kiếm' id='search-text' onChange={inputHandler} autoComplete="off" variant="outlined" label="Search"/> 
                            </div>
                            <div id='search-list-container'>
                                <div id='list_provinces'>
                                    <List input={inputText}/>
                                </div>
                                <div id='list_districts'>
                                    <List_districts input={inputText}/>
                                </div>
                            </div>
                        </div>
                    <li className="container__button-left-item" onClick={()=>showlist('note')}><i className="fa-solid fa-book-atlas"></i> Chú giải</li>
                            <div id='note' className='note1' >
                                <div className='note_name'>
                                <ul id='note_province'>
                                    <li>Thủ Đô</li>
                                    <li><i className="fa-solid fa-rectangle"></i>Thành Phố Trực Thuộc Tỉnh</li>
                                    <li><i className="fa-solid fa-rectangle"></i>Tỉnh</li>
                                </ul>
                                <ul id='note_district'>
                                    <li><i className="fa-solid fa-rectangle"></i>Thành Phố</li>
                                    <li><i className="fa-solid fa-rectangle"></i>Quận</li>
                                    <li><i className="fa-solid fa-rectangle"></i>Huyện</li>
                                    <li><i className="fa-solid fa-rectangle"></i>Thị xã</li>
                                </ul>
                                </div>
                                <div id='note_icon'>
                                    <i className="fa-solid fa-square" id='Thủ_đô'></i>
                                    <i className="fa-solid fa-square" id='Trực_Thuộc'></i>
                                    <i className="fa-solid fa-square" id='Tỉnh'></i>
                                    <i className="fa-solid fa-square" id='Thành_Phố'></i>
                                    <i className="fa-solid fa-square" id='Quận'></i>
                                    <i className="fa-solid fa-square" id='Huyện'></i>
                                    <i className="fa-solid fa-square" id='Thị_Xã'></i>
                                </div>
                            </div>
                </ul>
            </div>
            <div className="container__button-right">
                <ul className="container__button-right-list">
                    <li className="container__button-right-item"><i className="fa-solid fa-backward" id="close" onClick={() => toogleButton()}></i></li>  
                    <li className="container__button-right-item"><i className="fa-solid fa-magnifying-glass-plus" onClick={() =>getLocation()}></i></li>
                    <li className="container__button-right-item"><i className="fa-solid fa-magnifying-glass-minus" onClick={()=> {
                    }
                        }></i></li>
                    <li className="container__button-right-item"><i className ="fa-solid fa-ruler" onClick={()=> {
                        SetMeasure(!measure);
                        console.log(measure)
                        document.getElementById('path').removeAttribute('x1');
                        document.getElementById('path').removeAttribute('y1');
                        document.getElementById('path').removeAttribute('x2');
                        document.getElementById('path').removeAttribute('y2');
                        document.getElementById('point1').removeAttribute('cx');
                        document.getElementById('point1').removeAttribute('cy');
                        document.getElementById('point2').removeAttribute('cx');
                        document.getElementById('point2').removeAttribute('cy');
                        document.getElementById('path-distance').innerHTML = ''
                        if(measure){
                            document.getElementsByClassName('container__map-mode')[0].innerHTML = "Chế độ đo"
                        }
                        else
                            document.getElementsByClassName('container__map-mode')[0].innerHTML = "";
                        }}></i></li> 
                    <li className="container__button-right-item"><i className="fa-solid fa-circle-info" onClick={()=>{info_mode()}}></i></li>
                </ul>
            </div>
            <div className="container__map" >
                <UncontrolledReactSVGPanZoom  
                    id='container__map-svg'
                    width={900}
                    height={580}
                    ref = {Viewer1}
                    SVGBackground={'white'} 
                    detectAutoPan={false}
                    onMouseMove={event => {
                        coordinate_display(event)
                        if(measuring){
                            onMouseMove(event);
                            var object = document.getElementById('path')
                            var object1 = document.getElementById("point1");
                            var object2 = document.getElementById("point1");
                            var text = document.getElementById('path-distance')
                            text.setAttribute('x',(object.x1.animVal.value+object.x2.animVal.value)/2)
                            text.setAttribute('y',(object.y1.animVal.value+object.y2.animVal.value)/2)
                            text.innerHTML = calcCrow(object.y1.animVal.value/15, object.x1.animVal.value/15, object.y2.animVal.value/15, object.x2.animVal.value/15) ;
                            console.log(object.x1.animVal.value);
                        }
                    }}
                    // onTouchStart = {v => console.log(v)}
                    // onTouchEnd = {v => console.log(v)}
                    miniatureProps={{position: "right"}} 
                    preventPanOutside = {true}
                    scaleFactor = {1.3}
                    scaleFactorOnWheel = {1.3}
                    onZoom = {(v)=>{
                        setScale(getBaseLog(1.3,v.a/(2.0714285714285716)));  //chỉ số a ban đầu: 2.0714285714285716   scalefactor:1.3
                        //var a = b.concat('scale(1.3/',scale,',1.3/',scale,')'); //transform='scale(15,15)'
                        let c= applyToPoints(inverse(v), [
                        {x: 0, y: 0},
                        {x: v.viewerWidth, y: v.viewerHeight}
                        ]);
                        console.log('a');
                        takeSVG_district(c);
                        // // document.getElementById('e').innerHTML = "old_X: "+(c[0].x);
                        // // document.getElementById('f').innerHTML = "old_Y: "+(c[0].y);
                        // // document.getElementById('g').innerHTML = "new_X: "+(coor_x);
                        // // document.getElementById('h').innerHTML = "new_Y: "+(coor_y);
                        // setCoor_x(c[0].x);
                        // setCoor_y(c[0].y);
                        // setScreen_width(c[1].x-c[0].x);
                        // setScreen_height(c[1].y-c[0].y);
                        if(measure){
                            if(scale > 0 ){
                                var value = 2/Math.pow(1.3,scale);
                                document.getElementById('point1').setAttribute('r', value);
                                document.getElementById('point1').setAttribute('strokeWidth', value);
                                document.getElementById('point2').setAttribute('r', value);
                                document.getElementById('point2').setAttribute('strokeWidth', value);
                                document.getElementById('path').setAttribute('strokeWidth', value);
                            }
                        }
                        console.log(scale);
                        if(document.getElementById('current_position')!=null){
                            if(scale > 0 ){
                                var value = 2/Math.pow(1.3,scale);
                                document.getElementById('current_position').setAttribute('r', value);
                                document.getElementById('current_position').setAttribute('strokeWidth', value);
                                console.log('value:',value);
                                console.log(document.getElementById('current_position').r.animVal.value);
                            }
                        }
                        //console.log(a);
                        //getLayer_onZoom();
                        // console.log(v) 
                    }}
                    onMouseUp = {e => {
                        // let c= applyToPoints(inverse(e.value), [
                        // {x: 0, y: 0},
                        // {x: e.value.viewerWidth, y: e.value.viewerHeight}
                        // ]);
                        // setScreen_para(c);
                        // takeSVG_district(c);
                        // console.log("x=",c[0].x," y=",c[0].y," width=",(c[1].x-c[0].x)," height=",(c[1].y-c[0].y));
                    }
            }        
                    onPan = {event => { 
                        //setTimeout(()=>{
                        if(event.startX == null && event.startY == null){
                            console.log(event);
                            // setScreen_para( applyToPoints(inverse(event), [
                            //     {x: 0, y: 0},
                            //     {x: event.viewerWidth, y: event.viewerHeight}
                            // ]));
                            let c= applyToPoints(inverse(event), [
                                {x: 0, y: 0},
                                {x: event.viewerWidth, y: event.viewerHeight}
                                ]);
                            //console.log('coor_x:', screen_para[0].x,'coor_y:', screen_para[0].y, " screen width: ",screen_para[1].x-screen_para[0].x, " screen height: ",screen_para[1].y-screen_para[0].y)
                            takeSVG_district(c)
                        }
                            
                    }}
                    onClick={(event) => {
                        // if(document.getElementById('path').x1 != 0){
                        //     document.getElementById('path').setAttribute('x1',event.x);
                        //     document.getElementById('path').setAttribute('y1',event.y);
                        // }
                        // if(document.getElementById('path').x2 != 0){
                        //     document.getElementById('path').setAttribute('x2',event.x);
                        //     document.getElementById('path').setAttribute('y2',event.y);
                        // }
                        //console.log(document.getElementById('path'))
                        let c= applyToPoints(inverse(event), [
                            {x: 0, y: 0},
                            {x: event.viewerWidth, y: event.viewerHeight}
                            ]);
                        if(measuring){
                            console.log(document.getElementById('path'));
                            document.getElementById('path').setAttribute('x2',event.x);
                            document.getElementById('path').setAttribute('y2',event.y);
                            document.getElementById('point2').setAttribute('cx',event.x);
                            document.getElementById('point2').setAttribute('cy',event.y);
                            document.getElementById('point2').setAttribute('r',1/Math.pow(1.3,scale))
                            console.log(document.getElementById('path'))
                            setMeasuring(!measuring);
                            return;
                        }
                        if(measure){
                            //var newLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
                            //newLine.setAttribute('id', 'path_measure');
                            document.getElementById('path').setAttribute('x1',event.x);
                            document.getElementById('path').setAttribute('y1',event.y);
                            document.getElementById('point1').setAttribute('cx',event.x);
                            document.getElementById('point1').setAttribute('cy',event.y);
                            document.getElementById('point1').setAttribute('r',1/Math.pow(1.3,scale))
                            setMeasuring(true);
                            return;
                        }
                        if(!info){
                            var district_name = '';
                            var province_name = '';
                            var object;
                            //console.log('info')
                            for (var a=0;a<district_bbox.length;a++){
                                var xmin = district_bbox[a].xmin;
                                var xmax = district_bbox[a].xmax;
                                var ymin = district_bbox[a].ymin;
                                var ymax = district_bbox[a].ymax;
                                if((event.x>xmin)&&(event.x<xmax)&&(event.y>ymax)&&(event.y<ymin)){
                                    district_name = district_bbox[a].name_2;
                                    province_name = district_bbox[a].name_1;
                                    break
                                }
                                // if(district_bbox[a].name_2 == "Hoàng Mai"){
                                //     district_name = district_bbox[a].name_2;
                                //     province_name = district_bbox[a].name_1;
                                //     object = district_bbox[a]
                                // }
                            }
                            //console.log('tỉnh:',province_name,' Huyện: ',district_name);
                            //console.log('x:',event.x/15,' y: ',event.y/15);
                            var longitude = convertToDms(event.x/15);
                            var latitude = convertToDms(event.y/15);
                            document.getElementById('location-info-content').innerHTML = longitude+' '+latitude;
                            document.getElementById('province-info-content').innerHTML = province_name;
                            document.getElementById('district-info-content').innerHTML = district_name;
                            //console.log(document.getElementById('district-info'));
                            return;
                        }
                        // setX1(event.x);
                        // setY1(event.y);
                        // if(document.getElementById('path').x1.animVal.value == 0)
                        //     document.getElementById('path').setAttribute('x1',event.x);
                        //     document.getElementById('path').setAttribute('y1',event.y);
                        //     return
                        // // document.getElementById('path').setAttribute('x2',event.x);
                        // // document.getElementById('path').setAttribute('y2',event.y);
                        // if (document.getElementById('path').x1.animVal.value != 0){
                        //     document.getElementById('path').setAttribute('x2',event.x);
                        //     document.getElementById('path').setAttribute('y2',event.y);   
                        // }
                        // console.log( document.getElementById('path'));
                        // console.log(document.getElementById('path').x1.animVal.value);
                    }}
                    className="map2" >
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="280" width="300" id='svg_map'
                    viewBox="1450 -370 300 280">
                        <g id='label' transform='scale(15,15)' onClick = {(v) => console.log(v)}>
                        </g>
                        <g id='provinces_label' transform='scale(15,15)' onClick = {(v) => console.log(v)}>
                        </g>
                        <g id='districts_label' transform='scale(15,15)' onClick = {(v) => console.log(v)}>
                        </g>
                        <g id='communes_label' transform='scale(15,15)'>
                        </g>
                        <g id='layer_1' >
                        </g>                
                        <g id='Vietnam-provinces'>  
                            <g id='province1'>
                            </g>
                            <g id='province2'>
                            </g>
                            <g id='province3'>
                            </g>
                            <g id='province4'>
                            </g>
                            <g id='province5'>
                            </g>
                            <g id='province6'>
                            </g>
                            <g id='province7'>
                            </g>
                            <g id='province8'>
                            </g>
                            <g id='province9'>
                            </g>
                            <g id='province10'>
                            </g>
                            <g id='province11'>
                            </g>
                            <g id='province12'>
                            </g>
                            <g id='province13'>
                            </g>
                            <g id='province14'>
                            </g>
                            <g id='province15'>
                            </g>
                            <g id='province16'>
                            </g>
                            <g id='province17'>
                            </g>
                            <g id='province18'>
                            </g>
                            <g id='province19'>
                            </g>
                            <g id='province20'>
                            </g>
                            <g id='province21'>
                            </g>
                            <g id='province22'>
                            </g>
                            <g id='province23'>
                            </g>
                            <g id='province24'>
                            </g>
                            <g id='province25'>
                            </g>
                            <g id='province26'>
                            </g>
                            <g id='province27'>
                            </g>
                            <g id='province28'>
                            </g>
                            <g id='province29'>
                            </g>
                            <g id='province30'>
                            </g>
                            <g id='province31'>
                            </g>
                            <g id='province32'>
                            </g>
                            <g id='province33'>
                            </g>
                            <g id='province34'>
                            </g>
                            <g id='province35'>
                            </g>
                            <g id='province36'>
                            </g>
                            <g id='province37'>
                            </g>
                            <g id='province38'>
                            </g>
                            <g id='province39'>
                            </g>
                            <g id='province40'>
                            </g>
                            <g id='province41'>
                            </g>
                            <g id='province42'>
                            </g>
                            <g id='province43'>
                            </g>
                            <g id='province44'>
                            </g>
                            <g id='province45'>
                            </g>
                            <g id='province46'>
                            </g>
                            <g id='province47'>
                            </g>
                            <g id='province48'>
                            </g>
                            <g id='province49'>
                            </g>
                            <g id='province50'>
                            </g>
                            <g id='province51'>
                            </g>
                            <g id='province52'>
                            </g>
                            <g id='province53'>
                            </g>
                            <g id='province54'>
                            </g>
                            <g id='province55'>
                            </g>
                            <g id='province56'>
                            </g>
                            <g id='province57'>
                            </g>
                            <g id='province58'>
                            </g>
                            <g id='province59'>
                            </g>
                            <g id='province60'>
                            </g>
                            <g id='province61'>
                            </g>
                            <g id='province62'>
                            </g>
                            <g id='province63'>
                            </g>
                            <g id='province64'>
                            </g>
                            <g id='province65'>
                            </g>
                        </g>
                        <g id='svg_provinces'></g>
                        <g id='svg_districts'  onClick={(e)=> setSVG_commune(e)}>
                        </g>
                        <g id='svg_communes'>
                        </g>
                        <g id='position'></g>
                        <g id='measure' >
                            <line id='path' strokeWidth={1.5/Math.pow(1.3,scale)}/>
                            <circle id='point1'></circle>
                            <circle id='point2'></circle>
                            <text id='path-distance' dominantBaseline="middle" textAnchor="middle" fontSize={'10px'}></text> 
                        </g>

                        <use xlinkHref="#provinces_label" />
                        <use xlinkHref="#districts_label" />
                        <use xlinkHref="#communes_label" />
                        <use xlinkHref="#position" />
                    </svg>
                </UncontrolledReactSVGPanZoom>
                <div className='container__map-mode'>
                        abc
                </div>
                <div className='container__map-coordinate'>
                    <div id='coordinate'>
                        Tọa độ:
                        <div id='x-coordinate'></div>
                        <div id='y-coordinate'></div>
                    </div>
                    <div id='pan'>
                        <div id='e'></div>
                        <div id='f'></div>
                        <div id='g'></div>
                        <div id='h'></div>
                    </div>
                </div>        
            </div>
        </div>
        <footer>
            {/* <div class="name">
                <p>Nguyễn Tiến Anh</p>
            </div> */}

            <div className="social">
                <i className="fa-brands fa-facebook"></i>
                <i className="fa-solid fa-envelope"></i>
                <i className="fa-brands fa-linkedin"></i>
                <i className="fa-solid fa-phone"></i>
            </div>

        </footer>
    </div>
  );
};
  
export default Home;

