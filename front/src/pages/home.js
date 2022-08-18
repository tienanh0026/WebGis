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
        document.getElementById('x-coordinate').innerHTML = convertToDms((event.x/15),false);
        document.getElementById('y-coordinate').innerHTML = convertToDms((-event.y/15),true);
    }   

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
            for (var b = 0; b <65; b++){
                var a = 'province';
                document.getElementById(a.concat(b+1)).innerHTML = "";
            }
            document.getElementById("svg_districts").innerHTML = "";
            document.getElementById("svg_communes").innerHTML = "";
            document.getElementById("communes_label").innerHTML = "";
            var path = '';
            document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
            document.getElementById("layer_1").style.transform = "scale(15,15)";
            getLabel_vietnam();
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
            document.getElementById("communes_label").innerHTML = "";
            var path = '';
            document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
            document.getElementById("layer_1").style.transform = "scale(15,15)";
            
            getLabel_vietnam();
            //reduce(svg_vietnam.svg_geo_vn);
        }
    }

    const takeSVG = async (screen,scale) => {
        if(scale<5){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/vietnam',{
                    method: 'GET',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify()
                });
                let responseData = await response.json();
                var svg_vietnam = responseData;
                document.getElementById("svg_districts").innerHTML = "";
                document.getElementById("svg_communes").innerHTML = "";
                document.getElementById("svg_provinces").innerHTML = "";
                document.getElementById("districts_label").innerHTML = '';
                document.getElementById("provinces_label").innerHTML = '';
                var path = '';
                document.getElementById("layer_1").innerHTML = path.concat('<path id="vietnam" d="',svg_vietnam.svg_geo_vn[0].st_assvg,'" fill="yellow"/>');            
                document.getElementById("layer_1").style.transform = "scale(15,15)";
                getLabel_vietnam();
                console.log('lop1')
            } catch(err) {
                console.log(err)
            }
        }
        if(scale>=5 && scale<11){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/province-new',{
                    method: 'POST',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify({screen,scale})
                });
                let responseData= await response.json();
                var path ='';
                var province_svg_path = '';
                var provinces_label = ''
                var svg_provinces = responseData.province_screen_reduce;
                console.log(svg_provinces);
                console.log(svg_provinces[0].xmin);
                document.getElementById("layer_1").innerHTML = "";
                document.getElementById("svg_districts").innerHTML = "";
                document.getElementById("svg_communes").innerHTML = "";
                document.getElementById("districts_label").innerHTML = '';
                for(var i = 0; i < svg_provinces.length; i++){
                    var type = '';
                    if(svg_provinces[i].type_1 === 'Thành phố trực thuộc tỉnh'){
                        type = 'blue';
                    }
                    else type = 'green'; 
                    if(svg_provinces[i].name_1 == 'Hà Nội'){
                        type = 'red';
                    }
                    province_svg_path+=path.concat(' <path d="',
                    svg_provinces[i].st_assvg
                    ,'" id="',svg_provinces[i].name_1,'" fill="',type,'"  transform="scale(15,15)" /> ');  
                    var x = svg_provinces[i].xmin;
                    var y = svg_provinces[i].ymin;
                    var width = svg_provinces[i].xmax-svg_provinces[i].xmin;
                    var height = svg_provinces[i].ymax-svg_provinces[i].ymin;
                    var path='';
                    provinces_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="#FFD100" dominantBaseline="middle" textAnchor="middle" font-size="1px" font-weight="400">',svg_provinces[i].name_1,'</text>')
                }
                document.getElementById('svg_provinces').innerHTML = province_svg_path;
                document.getElementById("provinces_label").innerHTML = provinces_label;
                console.log(document.getElementById('svg_provinces'));
                console.log(document.getElementById('provinces_label'));
            } catch(err) {
                console.log(err)
            }
        }
        if(scale >11 && scale <20){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/district-new',{
                    method: 'POST',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify({screen,scale})
                });
                //console.log(responseData.screen_reduce);
                let responseData= await response.json();
                var path ='';
                var district_svg_path = '';
                var district_label = '';
                var svg_districts = responseData.screen_reduce;
                console.log(svg_districts);
                //var new_svg = reduce_points_districts(svg_districts);
                for(var i = 0; i < svg_districts.length; i++){
                    var type = '';
                    if(svg_districts[i].type_2 === 'Than Pho'){
                        type = "red";
                    }
                    if(svg_districts[i].type_2 === 'Thi xa'){
                        type = 'blue';
                    }
                    if(svg_districts[i].type_2 === 'Quận'){
                        type = 'brown';
                    }
                    if(svg_districts[i].type_2 === 'Huyện'){
                        type = 'green';
                    }
                    district_svg_path+=path.concat(' <path d="',
                    svg_districts[i].st_assvg
                    ,'" id="',svg_districts[i].name_2,'" fill="',type,'"  transform="scale(15,15)" /> ');
                    var x = svg_districts[i].xmin;
                    var y = svg_districts[i].ymin;
                    var width = svg_districts[i].xmax-svg_districts[i].xmin;
                    var height = svg_districts[i].ymax-svg_districts[i].ymin;
                    var path='';
                    var font_size = '';
                    if((svg_districts[i].name_1 === 'Hà Nội' && svg_districts[i].type_2 === 'Quận') || (svg_districts[i].name_1 === 'Hồ Chí Minh city'  && svg_districts[i].type_2 === 'Quận') || (svg_districts[i].name_1 === 'Đà Nẵng' && svg_districts[i].type_2 === 'Quận')){
                        font_size = '0.09px';
                    }
                    else font_size = '0.225px';
                    district_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="#FFD100" font-size="',font_size,'" font-weight="200">',svg_districts[i].name_2,'</text>')
   
                }
                document.getElementById('districts_label').innerHTML = district_label;
                document.getElementById("layer_1").innerHTML = '';
                document.getElementById("svg_provinces").innerHTML = '';
                document.getElementById("svg_communes").innerHTML = "";
                document.getElementById('communes_label').innerHTML = '';
                document.getElementById("provinces_label").innerHTML = '';
                document.getElementById('svg_districts').innerHTML = district_svg_path;
                //console.log(district_svg_path);
                console.log(document.getElementById('districts_label'));
                console.log(document.getElementById('svg_districts'));
                
            } catch(err) {
                console.log(err)
            }
        }
        if(scale >20){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/communes-new',{
                    method: 'POST',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify({screen,scale})
                });
                //console.log(responseData.screen_reduce);
                let responseData= await response.json();
                var path ='';
                var communes_svg_path = '';
                var communes_label = '';
                var svg_communes = responseData.screen_reduce_communes;
                console.log(svg_communes);
                //var new_svg = reduce_points_districts(svg_districts);
                for(var i = 0; i < svg_communes.length; i++){
                    if((svg_communes[i].name_1 === 'Hà Nội' && svg_communes[i].type_3 ==='ward') || (svg_communes[i].name_1 === 'Hồ Chí Minh city' && svg_communes[i].type_3 ==='ward') || (svg_communes[i].name_1 === 'Đà Nẵng' && svg_communes[i].type_3 ==='ward')){
                        font_size = '0.0105px';
                    }
                    else font_size = '0.024px';
                    var x = svg_communes[i].xmin;
                    var y = svg_communes[i].ymin;
                    var width = svg_communes[i].xmax-svg_communes[i].xmin;
                    var height = svg_communes[i].ymax-svg_communes[i].ymin;
                    communes_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="black" font-size="',font_size, '" font-weight="300">',svg_communes[i].name_3,'</text>')
                    
                    var type = '';
                    if(svg_communes[i].type_3 === 'Commune'){
                        type = "gold";
                    }
                    if(svg_communes[i].type_3 === 'Ward'){
                        type = 'red';
                    }
                    if(svg_communes[i].type_3 === 'Townlet'){
                        type = 'green';
                    }
                    communes_svg_path+=path.concat(' <path d="',
                    svg_communes[i].st_assvg
                    ,'" id="',svg_communes[i].name_3,' " fill="',type,'"  transform="scale(15,15)"/> ');

                }
                document.getElementById('districts_label').innerHTML ='';
                document.getElementById("svg_districts").innerHTML = '';
                document.getElementById("layer_1").innerHTML = '';
                document.getElementById("svg_provinces").innerHTML = '';
                document.getElementById("provinces_label").innerHTML = '';
                document.getElementById('svg_communes').innerHTML = communes_svg_path;
                document.getElementById('communes_label').innerHTML = communes_label;
                //console.log(district_svg_path);
                console.log(document.getElementById('communes_label'));
                console.log(document.getElementById('svg_communes'));
                
            } catch(err) {
                console.log(err)
            }
        }
        
    }

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
        document.getElementById("communes_label").innerHTML = '';
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

    const [commune_bbox, setCommune_bbox] = useState(null);

    const getCommune_bbox = async () => {
        try{
            const response = await fetch('http://localhost/api/get-geometry-vietnam/commune_bbox',{
                method: 'GET',
                credentials: 'omit',
                headers: {"Content-Type":'application/json'},
                body: JSON.stringify()
            });
            let responseData = await response.json();
            setCommune_bbox(responseData.svg_commune_bbox);
            //console.log(province_bbox);
        } catch(err) {
            console.log(err)
        }
    }
    // hàm tính logarit
    function getBaseLog(x, y) {
        return Math.log(y) / Math.log(x);
      }


    function showlist(a) {
        document.getElementById(a).classList.toggle('show')
    }


    const _fitSelection_map = () => {
        
        Viewer1.current.fitSelection(1450, -370, 300, 280); 
    }

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
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        console.log("latitude: ",latitude, " longitude: ",longitude);
        var a = '';
            var point = a.concat('<circle id="current_position" cx="',position.coords.longitude*15,'" cy="',-position.coords.latitude*15,'" r="',1/Math.pow(1.3,scale),'" fill="white"  stroke="black" strokeWidth="',1.5/Math.pow(1.3,scale),'" />')
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


    function findProvince(name){
        for (var i=0; i< province_bbox.length; i++){
            if(name == province_bbox[i].name_1){
                console.log(province_bbox[i]);
                var x = province_bbox[i].xmin;
                var y = province_bbox[i].ymax;
                var width = province_bbox[i].xmax-province_bbox[i].xmin;
                var height = province_bbox[i].ymin-province_bbox[i].ymax;
                console.log( x, y,width,height);   
                Viewer1.current.fitSelection(x-11, y-5, width+16, height+10)
                break;
            }
        }
    }

    function findDistrict(name){
        for (var i=0; i< district_bbox.length; i++){
            if(name == district_bbox[i].name_2){
                console.log(district_bbox[i]);
                var x = district_bbox[i].xmin;
                var y = district_bbox[i].ymax;
                var width = district_bbox[i].xmax-district_bbox[i].xmin;
                var height = district_bbox[i].ymin-district_bbox[i].ymax;
                console.log( x, y,width,height);   
                Viewer1.current.fitSelection(x-2, y-1.5, width+4, height+3)
                break;
            }
        }
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
                <li key={item1.id_1} onClick={()=>findProvince(item1.name_1)} >
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
                    onClick={()=>findDistrict(item1.name_2)}
                    >{item1.name_2} ({item1.name_1})
                    </li>
                ))}
            </ul>
            )
        }


    function onMouseMove(event) {
        //Add code here
        var newLine = document.getElementById('path')
        if (measuring) {
          newLine.setAttribute("x2", event.x);
          newLine.setAttribute("y2", event.y);
        }
      }

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

    const useViewport = () => {
        const [width, setWidth] = React.useState(window.innerWidth);
      
        React.useEffect(() => {
          const handleWindowResize = () => setWidth(window.innerWidth);
          window.addEventListener("resize", handleWindowResize);
          return () => window.removeEventListener("resize", handleWindowResize);
        }, []);
      
        return { width };
    };

    const viewPort = useViewport()
    
    
    useEffect(() => { 
        _fitSelection_map();
        getSVG();
        get_search_list();
        get_search_list_districts();
        getProvince_bbox();
        getDistrict_bbox();
        getCommune_bbox();
        // Run! Like go get some data from an API. run only once
    }, []);

    useEffect(() => { 
        show_mode();
        // execute side effect
    })

  return (
    <div>
        <div id="container">
        <div className="container__button-right">
                <ul className="container__button-right-list">
                    <li className="container__button-right-item"><i className="fa-solid fa-backward" id="close" onClick={() => {
                        toogleButton()
                        if(document.getElementsByClassName('container__button-left')[0].style.display == 'none'){
                            console.log('a')
                            document.getElementsByClassName('container__button-right')[0].style.marginLeft = '0%';
                            document.getElementsByClassName('container__map')[0].style.marginLeft = '45px';
                            document.getElementsByClassName('container__map-coordinate')[0].style.marginLeft = '10px';
                            document.getElementsByClassName('container__map-mode')[0].style.marginLeft = '10px';
                        }
                        if(document.getElementsByClassName('container__button-left')[0].style.display == 'block'){
                            document.getElementsByClassName('container__button-right')[0].style.marginLeft = '20.3%';
                            document.getElementsByClassName('container__map')[0].style.marginLeft = '0';
                            document.getElementsByClassName('container__map-coordinate')[0].style.marginLeft = '55px';
                            document.getElementsByClassName('container__map-mode')[0].style.marginLeft = '55px';
                        }
                        
                    }}></i></li>  
                    <li className="container__button-right-item"><i className="fa-solid fa-location-dot" onClick={() =>getLocation()}></i></li>
                    <li className="container__button-right-item"><i className ="fa-solid fa-ruler" onClick={()=> {
                        SetMeasure(!measure);
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
            <div className="container__button-left" style={{width:a}} id='button-left'>
                <ul className="container__button-left-list">
                    <li className="container__button-left-item" onClick={()=>showlist('display-info' )}><i className="fa-solid fa-circle-info"> </i> Thông tin đối tượng</li>
                        <div id='display-info' className='display-info-dropdown' >
                            <p id='province-info' onClick={()=>showlist('province-info-content')}>Nền hành chính Tỉnh <i className="fa-solid fa-caret-down"></i></p>
                            <div id='province-info-content' className='dropdown-info'>
                                </div>
                            <p id='district-info' onClick={()=>showlist('district-info-content')}>Nền Hành chính Huyện <i className="fa-solid fa-caret-down"></i></p>
                            <div id='district-info-content' className='dropdown-info'>
                                </div>
                                <p id='commune-info' onClick={()=>showlist('commune-info-content')}>Nền Hành Chính Xã <i className="fa-solid fa-caret-down"></i>
                            </p>
                                <div id='commune-info-content' className='dropdown-info'>
                                </div>
                            <p id='area-info' onClick={()=>showlist('area-info-content')}>Diện Tích <i className="fa-solid fa-caret-down"></i></p>
                            <div id='area-info-content' className='dropdown-info'>
                                </div>
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
                                <div id='note-province'>
                                    <p className='note-name'>Các đơn vị cấp tỉnh</p>
                                    <p>Thủ Đô <i className="fa-solid fa-square" id='Thủ_đô'></i></p>
                                    <p>Thành Phố Trực Thuộc Tỉnh<i className="fa-solid fa-square" id='Trực_Thuộc'></i></p>
                                    <p>Tỉnh <i className="fa-solid fa-square" id='Tỉnh'></i></p>
                                </div>
                                <div id='note-district'>
                                    <p className='note-name'>Các đơn vị cấp huyện</p>
                                    <p>Thành Phố <i className="fa-solid fa-square" id='Thành_Phố'></i></p>
                                    <p>Quận <i className="fa-solid fa-square" id='Quận'></i></p>
                                    <p>Huyện<i className="fa-solid fa-square" id='Huyện'></i></p>
                                    <p>Thị Xã <i className="fa-solid fa-square" id='Thị_Xã'></i></p>
                                </div>
                                <div id='note-commune'>
                                    <p className='note-name'>Các đơn vị cấp xã</p>
                                    <p>Phường <i className="fa-solid fa-square" id='Phường'></i></p>
                                    <p>Xã<i className="fa-solid fa-square" id='Xã'></i></p>
                                    <p>Thị Trấn <i className="fa-solid fa-square" id='Thị_Trấn'></i></p>
                                </div>
                            </div>
                </ul>
            </div>
  
            <div className="container__map" >
                <UncontrolledReactSVGPanZoom  
                    className='container__map-svg'
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
                            text.innerHTML = Math.round(calcCrow(object.y1.animVal.value/15, object.x1.animVal.value/15, object.y2.animVal.value/15, object.x2.animVal.value/15)*100)/100+'km' ;
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
                        var scale = getBaseLog(1.3,v.a/(2.0714285714285716))
                        let c= applyToPoints(inverse(v), [
                        {x: 0, y: 0},
                        {x: v.viewerWidth, y: v.viewerHeight}
                        ]);
                        takeSVG(c,scale);
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
                            var value = 2/Math.pow(1.3,scale);
                            //document.getElementById('current_position').setAttribute('r', value);
                            document.getElementById('current_position').setAttribute('stroke-width', value);
                            document.getElementById('current_position').setAttribute('r', value);
                            console.log('value:',value);
                            console.log(document.getElementById('current_position').r.animVal.value);
                        }
                    }}     
                    onPan = {event => { 
                        if(event.startX == null && event.startY == null){
                            console.log(event);
                            var scale = getBaseLog(1.3,event.a/(2.0714285714285716))
                            let c= applyToPoints(inverse(event), [
                                {x: 0, y: 0},
                                {x: event.viewerWidth, y: event.viewerHeight}
                                ]);
                            takeSVG(c,scale)
                        }
                            
                    }}
                    onClick={(event) => {
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
                            document.getElementById('point2').setAttribute('r',1/Math.pow(1.3,scale));
                            document.getElementById('path-distance').setAttribute('font-size',10/Math.pow(1.3,scale));
                            console.log(document.getElementById('path'))
                            setMeasuring(!measuring);
                            return;
                        }
                        if(measure){
                            document.getElementById('path').setAttribute('x1',event.x);
                            document.getElementById('path').setAttribute('y1',event.y);
                            document.getElementById('point1').setAttribute('cx',event.x);
                            document.getElementById('point1').setAttribute('cy',event.y);
                            document.getElementById('point1').setAttribute('r',1/Math.pow(1.3,scale));
                            document.getElementById('path-distance').setAttribute('font-size',10/Math.pow(1.3,scale));
                            setMeasuring(true);
                            return;
                        }
                        if(!info){
                            var district_name = '';
                            var province_name = '';
                            var commune_name = '';
                            var area = 0;
                            //console.log('info')
                            if(document.getElementById('svg_provinces').innerHTML != ''){
                                console.log(event.originalEvent.target.id);
                                console.log(document.getElementById('svg_provinces'))
                                for (var a=0;a<province_bbox.length;a++){
                                    var xmin = province_bbox[a].xmin;
                                    var xmax = province_bbox[a].xmax;
                                    var ymin = province_bbox[a].ymin;
                                    var ymax = province_bbox[a].ymax;
                                    if((event.x>xmin)&&(event.x<xmax)&&(event.y>ymax)&&(event.y<ymin)){
                                        district_name = '';
                                        province_name = province_bbox[a].name_1;
                                        commune_name = '';
                                        area = province_bbox[a].area;
                                        break
                                    }
                                }
                            }
                            if(document.getElementById('svg_districts').innerHTML != ''){
                                console.log(event.originalEvent.target.id);
                                console.log(document.getElementById('svg_districts'))
                                for (var a=0;a<district_bbox.length;a++){
                                    var xmin = district_bbox[a].xmin;
                                    var xmax = district_bbox[a].xmax;
                                    var ymin = district_bbox[a].ymin;
                                    var ymax = district_bbox[a].ymax;
                                    if((event.x>xmin)&&(event.x<xmax)&&(event.y>ymax)&&(event.y<ymin)){
                                        district_name = district_bbox[a].name_2;
                                        province_name = district_bbox[a].name_1;
                                        commune_name = '';
                                        area = district_bbox[a].area;
                                        break
                                    }
                                }
                            }
                            if(document.getElementById('svg_communes').innerHTML != ''){
                                console.log(event.originalEvent.target.id);
                                console.log(document.getElementById('svg_communes'))
                                for (var a=0;a<commune_bbox.length;a++){
                                    var xmin = commune_bbox[a].xmin;
                                    var xmax = commune_bbox[a].xmax;
                                    var ymin = commune_bbox[a].ymin;
                                    var ymax = commune_bbox[a].ymax;
                                    if((event.x>xmin)&&(event.x<xmax)&&(event.y>ymax)&&(event.y<ymin)){
                                        district_name = commune_bbox[a].name_2;
                                        province_name = commune_bbox[a].name_1;
                                        commune_name = commune_bbox[a].name_3;
                                        area = commune_bbox[a].area;
                                        break
                                    }
                                }
                            }
                            area = Math.round(area * 100) / 100
                            document.getElementById('province-info-content').innerHTML = province_name;
                            document.getElementById('district-info-content').innerHTML = district_name;
                            document.getElementById('commune-info-content').innerHTML = commune_name;
                            document.getElementById('area-info-content').innerHTML = area+' km²';
                            return;
                        }
                    }}
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="280" width="300" id='svg_map'
                    viewBox="1450 -370 300 280">
                        <g id='label' transform='scale(15,15)' onClick = {(v) => console.log(v)}>
                        </g>
                        <g id='provinces_label' onClick = {(v) => console.log(v)}>
                        </g>
                        <g id='districts_label' onClick = {(v) => console.log(v)}>
                        </g>
                        <g id='communes_label' >
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
                        <g id='svg_districts'>
                        </g>
                        <g id='svg_communes'>
                        </g>
                        <g id='position'></g>
                        <g id='measure' >
                            <line id='path' style={{fill:"green"}} strokeWidth={1.5/Math.pow(1.3,scale)}/>
                            <circle id='point1'></circle>
                            <circle id='point2'></circle>
                            <text id='path-distance' dominantBaseline="auto" textAnchor="middle" fontSize={'10px'} fill={'DarkGray'}></text> 
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

