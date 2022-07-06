import '../assets/css/base.css'
import '../assets/css/main.css'
import '../assets/font/fontawesome-free-6.1.1-web/css/all.min.css'
import '../assets/css/font.css'
import '../assets/css/map.css'

import React, { useRef , useState, useEffect} from "react";
import { UncontrolledReactSVGPanZoom } from "react-svg-pan-zoom";


  
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

    function coordinate_display(event){
        //setX(convertToDms((event.x/15),false));
        //setY(convertToDms((-event.y/15),true));
        // chỉnh lại để xem rìa của tọa độ chỉnh lai

        document.getElementById('x-coordinate').innerHTML = event.x;
        document.getElementById('y-coordinate').innerHTML = event.y;
        // return console.log('click', event.x, event.y, 
        // //event.originalEvent show duoc click vao object nao (co ich sau nay su dung)
        // )
    }   

    function pan_display(event){
        document.getElementById('startX').innerHTML ="start X: "+ event.startX;
        document.getElementById('startY').innerHTML ="start Y: "+ event.startY;
        document.getElementById('endX').innerHTML = "end X: "+event.endX;
        document.getElementById('endY').innerHTML = "end Y: "+event.endY;
        document.getElementById('current_w').innerHTML = "Current width: "+(432.69/Math.pow(1.3,scale));
        document.getElementById('current_h').innerHTML = "Current height: "+(280/Math.pow(1.3,scale));
        // ban đầu tọa độ của O là (1450,-370)
        document.getElementById('new_x').innerHTML = "New X: "+event.endX;
        document.getElementById('new_y').innerHTML = "New Y: "+event.endY;
        document.getElementById('e').innerHTML = "translationX: "+event.e;
        document.getElementById('f').innerHTML = "translationY: "+event.f;
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
            reduce(svg_vietnam.svg_geo_vn);
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
            reduce(svg_vietnam.svg_geo_vn);
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
                reduce(svg_provinces);
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
            reduce(svg_provinces);
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
                    ,'" id="',svg_districts[i].name_2,' " fill="',type,'"  transform="scale(15,15)"/> ');
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
            reduce(svg_districts);
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

    const [svg_communes,setSvg_communes] = useState([]);

    const getSVG_commune = async () => {
        if(svg_communes.length == 0){
            try{
                const response = await fetch('http://localhost/api/get-geometry-vietnam/commune',{
                    method: 'GET',
                    credentials: 'omit',
                    headers: {"Content-Type":'application/json'},
                    body: JSON.stringify()
                });
                let responseData= await response.json();
                var path ='';
                var commune_svg_path = '';
                //console.log(responseData.svg_geo_communes)
                setSvg_communes(responseData.svg_geo_communes);
                //console.log(svg_communes);
                //var new_svg = reduce_points_districts(svg_districts);
                document.getElementById("layer_1").innerHTML = '';
                for (var b = 0; b <65; b++){
                    var a = 'province';
                    document.getElementById(a.concat(b+1)).innerHTML = "";
                }
                document.getElementById('svg_districts').innerHTML = "";
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
        else{
            var path ='';
            var commune_svg_path = '';
            //console.log(svg_communes);
            //var new_svg = reduce_points_districts(svg_districts);
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
                //new_svg[i]
                ,'" id="',svg_communes[i].name_3,' " fill="',type,'"  transform="scale(15,15)"/> ');
            }
            //reduce(svg_districts);
            document.getElementById("layer_1").innerHTML = '';
            for (var b = 0; b <65; b++){
                var a = 'province';
                document.getElementById(a.concat(b+1)).innerHTML = "";
            }
            document.getElementById('svg_districts').innerHTML = "";
            document.getElementById('svg_communes').innerHTML = commune_svg_path;
            getLabel_communes();
            reduce(svg_communes)
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
    }
    function getLabel_provinces(){
        var provinces_label = ''
        for (var z = 0; z < svg_provinces.length; z++){
            var a='province'
            var object = document.getElementById(a.concat(z+1));
            var x = object.getBBox().x;
            var y = object.getBBox().y;
            var width = object.getBBox().width;
            var height = object.getBBox().height;
            var path='';
            provinces_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="red" dominant-baseline="middle" text-anchor="middle" font-size="0.08px" font-weight="400">',svg_provinces[z].name_1,'</text>')
        }
        document.getElementById("provinces_label").innerHTML = provinces_label;
    }

    function getLabel_districts(){
        var districts_label = ''
        for (var z = 0; z < svg_districts.length; z++){
            var districts = document.getElementById("svg_districts");
            var object = districts.getElementsByTagName("path");
            var x = object[z].getBBox().x;
            var y = object[z].getBBox().y;
            var width = object[z].getBBox().width;
            var height = object[z].getBBox().height;
            var path='';
            var font_size;
            if((svg_districts[z].name_1 === 'Hà Nội' && svg_districts[z].type_2 === 'Quận') || (svg_districts[z].name_1 === 'Hồ Chí Minh city'  && svg_districts[z].type_2 === 'Quận') || (svg_districts[z].name_1 === 'Đà Nẵng' && svg_districts[z].type_2 === 'Quận')){
                font_size = '0.006px';
            }
            else font_size = '0.015 px';
            districts_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="black" dominant-baseline="middle" text-anchor="middle" font-size=',font_size, ' font-weight="400">',svg_districts[z].name_2,'</text>')
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
                font_size = '0.0005px';
            }
            else font_size = '0.001px';
            communes_label += path.concat('<text x=',x+width/2,' y=',y+height/2,' fill="black" dominant-baseline="middle" text-anchor="middle" font-size=',font_size, ' font-weight="300">',svg_communes[z].name_3,'</text>')
        }
        document.getElementById("communes_label").innerHTML = communes_label;
        console.log("a");
        console.log(document.getElementById("communes_label"))
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
        if(scale>11 && scale <=22){
            document.getElementById("provinces_label").innerHTML = "";
            document.getElementById("communes_label").innerHTML = "";
            if(document.getElementById("svg_districts").innerHTML === ""){
                getSVG_district();
            }
        }
        if (scale > 22){
            document.getElementById("districts_label").innerHTML = "";
            if(document.getElementById("svg_communes").innerHTML === ""){
                getSVG_commune();
            }
        }
    }

    // function getLayer_onZoom(){ 
    //     if(scale <5){
    //         // for (var b = 0; b <65; b++){
    //         //     var a = 'province';
    //         //     document.getElementById(a.concat(b+1)).innerHTML = "";
    //         // }
    //         document.getElementById("provinces_label").innerHTML = "";
    //         document.getElementById("districts_label").innerHTML = "";
    //         // if (document.getElementById("layer_1").innerHTML !== ""){
    //         //     return
    //         // }
    //         // if (document.getElementById("layer_1").innerHTML === ""){
    //         //     getSVG();
    //         // }
    //         getSVG();
    //     }
    //     if(scale >=5 && scale <=11){
    //         document.getElementById("districts_label").innerHTML = "";
    //         // if(document.getElementById("province1").innerHTML !==""){
    //         //     return
    //         // }
    //         for (var b = 0; b <65; b++){
    //             var a = 'province';
    //             if(document.getElementById(a.concat(b+1)).innerHTML === ""){
    //                 getSVG_provinces();
    //                 console.log(b)
    //                 break;
    //             }
    //         }
    //         // document.getElementById("layer_1").innerHTML = "";
    //         // document.getElementById("svg_districts").innerHTML = "";
    //     }
    //     if(scale>11){
    //         document.getElementById("provinces_label").innerHTML = "";
    //         // if(document.getElementById("svg_districts").innerHTML === ""){
    //         //     getSVG_district();
    //         // }
    //         getSVG_district();
    //     }
    // }

    function showCoordinate(evt) {
        var svg = document.getElementById("svg_map");
        var pt = svg.createSVGPoint(); 
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        // The cursor point, translated into svg coordinates
        var cursorpt =  pt.matrixTransform(svg.getScreenCTM().inverse());
        console.log("(" + cursorpt.x + ", " + cursorpt.y + ")");
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

    // const [x1, setX1] = useState(false);
    // var prevID = null;


    // function findObject(id){
    //     let a="province"
    //     var object = document.getElementById(a.concat(id)) ;
    //     console.log(object);       
    //     // console.log(object);
    //     if(prevID == id){
    //     // object.style.filter= "brightness(150%)";
    //         if(x1){
    //             object.style.filter= "brightness(200%)";
    //             setX1(x1 => !x1);
    //             // console.log(x1);
    //             // console.log(prevID);
    //         }
    //         else{
    //             object.style.filter = "brightness(100%)";
    //             setX1(x1 => !x1);
    //             // console.log(x1);
    //             // console.log(prevID);
    //         }
    //     }
    //     else{
    //         // if(x1){
    //         //     object.style.filter= "brightness(100%)";
    //         //     setX1(x1 => !x1);
    //         //     console.log(x1);  
    //         // }
    //         // else{
    //             prevID = id;
    //             object.style.filter = "brightness(200%)";
    //             for(var z = 0; z<63; z++){
    //                 if(id == (z+1)){
    //                     continue
    //                 }
    //                 else document.getElementById(a.concat(z+1)).style.filter = "brightness(100%)";
    //             }
    //             // console.log(x1);   
    //             // setX1(x1 => !x1); 
    //             // console.log(prevID)
    //         // }
    //     }
    // }

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
    // function toLongitude(x) {
    //     return x * 180 / 280;
    //     }
        
    //     function toLatitude(y) {
    //     return -y * 300 / width + 90;
    //     }

    // const test_reduce = async () => {
    //     try{
    //         const response = await fetch('http://localhost/api/get-geometry-vietnam/test',{
    //             method: 'GET',
    //             credentials: 'omit',
    //             headers: {"Content-Type":'application/json'},
    //             body: JSON.stringify()
    //         });
    //         let responseData= await response.json();
    //         //console.log(responseData.test[0].st_assvg.length);
    //         reduce(responseData.test[0].st_assvg);
    //     } catch(err) {
    //         console.log(err)
    //     }
    // }
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

    function reduce_points_vietnam(arr){
        var total_point_reduce = 0;
        var total_points = 0;
        var new_arr = [];
        for(var z = 0; z< arr.length; z++){
            a = arr[z].st_assvg.split(" ");
            // console.log(a.length);
            // console.log(a[4]-a[6]);
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
                            avg = Math.sqrt(Math.abs(avg_x+avg_y));
                            if(avg < distance_vietnam/Math.pow(1.1,scale)){
                                cnt_points+=1;
                                a[i+2] = "";
                                a[i+3] = ""
                            }
                        }
                        cnt_x+=1;
                    }
                }
                else if (a[i] <-8){
                    cnt_y+=1;
                }                
            }
            new_arr.push(a.join(" "))
            total_points += (a.length-cnt)/2;
            total_point_reduce += point_reduce;

        }
        // console.log("so luong x: ",cnt_x)
        // console.log("so luong y: ",cnt_y)
        // console.log("so luong diem chữ ",cnt)
        console.log("Tổng điểm ban đầu: ",total_points)
        console.log("So diem loại bỏ: ",total_point_reduce);
        return new_arr;

    }

    function reduce_points_provinces(arr){
        var total_point_reduce = 0;
        var total_points = 0;
        var new_arr = [];
        for(var z = 0; z< arr.length; z++){
            a = arr[z].st_assvg.split(" ");
            // console.log(a.length);
            // console.log(a[4]-a[6]);
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
                            avg = Math.sqrt(Math.abs(avg_x+avg_y));
                            if(avg < distance_province/Math.pow(1.1,(scale-4))){
                                cnt_points+=1;
                                a[i+2] = "";
                                a[i+3] = ""
                            }
                        }
                        cnt_x+=1;
                    }
                }
                else if (a[i] <-8){
                    cnt_y+=1;
                }                
            }
            new_arr.push(a.join(" "))
            total_points += (a.length-cnt)/2;
            total_point_reduce += point_reduce;
        }
        // console.log("so luong x: ",cnt_x)
        // console.log("so luong y: ",cnt_y)
        // console.log("so luong diem chữ ",cnt)
        console.log("Tổng điểm ban đầu: ",total_points)
        console.log("So diem loại bỏ: ",total_point_reduce);
        return new_arr;

    }

    function reduce_points_districts(arr){
        var total_point_reduce = 0;
        var total_points = 0;
        var new_arr = [];
        for(var z = 0; z< arr.length; z++){
            a = arr[z].st_assvg.split(" ");
            // console.log(a.length);
            // console.log(a[4]-a[6]);
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
                            avg = Math.sqrt(Math.abs(avg_x+avg_y));
                            if(avg < distance_district/Math.pow(1.1,(scale-10))){
                                cnt_points+=1;
                                a[i+2] = "";
                                a[i+3] = ""
                            }
                        }
                        cnt_x+=1;
                    }
                }
                else if (a[i] <-8){
                    cnt_y+=1;
                }                
            }
            new_arr.push(a.join(" "))
            total_points += (a.length-cnt)/2;
            total_point_reduce += point_reduce;
        }
        // console.log("so luong x: ",cnt_x)
        // console.log("so luong y: ",cnt_y)
        // console.log("so luong diem chữ ",cnt)
        console.log("Tổng điểm ban đầu: ",total_points)
        console.log("So diem loại bỏ: ",total_point_reduce);
        return new_arr;

    }

    useEffect(() => { 
        _fitSelection_map();
        //getSVG();
        get_search_list();
        get_search_list_districts();
        //getSVG_commune();
        //getSVG_provinces();
        // Run! Like go get some data from an API. run only once
    }, []);

    useEffect(() => { 
        getLayer();
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
                    <li className="container__button-left-item" onClick={()=>showlist('display-info' )}><i className="fa-solid fa-circle-info"> </i> Thông tin</li>
                        <div id='display-info' className='display-info-dropdown' >
                            <p>
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
                            </p>
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
                                <ul id='note_province'>
                                    <li>Thủ Đô</li>
                                    <li>Thành Phố Trực Thuộc Tỉnh</li>
                                    <li>Tỉnh</li>
                                </ul>
                                <ul id='note_district'>
                                    <li>Thành Phố</li>
                                    <li>Quận</li>
                                    <li>Huyện</li>
                                    <li>Thị xã</li>
                                </ul>
                            </div>
                </ul>
            </div>
            <div className="container__button-right">
                <ul className="container__button-right-list">
                    <li className="container__button-right-item"><i className="fa-solid fa-backward" id="close" onClick={() => toogleButton()}></i></li>  
                    <li className="container__button-right-item"><i className="fa-solid fa-magnifying-glass-plus" onClick={() =>getLabel_districts()}></i></li>
                    <li className="container__button-right-item"><i className="fa-solid fa-magnifying-glass-minus" onClick={()=> console.log(Viewer1.current.x,Viewer1.current.y)}></i></li>
                    <li className="container__button-right-item"><i className="fa-solid fa-expand" id="fullscreen"  onClick={()=> {reduce(svg_communes)}}></i></li> 
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
                    onMouseMove={event => {coordinate_display(event)}}
                    // onTouchStart = {v => console.log(v)}
                    // onTouchEnd = {v => console.log(v)}
                    miniatureProps={{position: "right"}} 
                    preventPanOutside = {true}
                    scaleFactor = {1.3}
                    scaleFactorOnWheel = {1.3}
                    onZoom = {(v)=>{
                        setScale(getBaseLog(1.3,v.a/(2.0714285714285716)));  //chỉ số a ban đầu: 2.0714285714285716   scalefactor:1.3
                        console.log(scale);
                        //getLayer_onZoom();
                        // console.log(v) 
                    }}
                    onPan = {event => {
                        // coordinate_display(event);
                        //pan_display(event);
                        //console.log(Viewer1.current.handleViewerEvent("mousemove"));
                        //console.log(Viewer1.current.Viewer.state.pointerX);  
                        //console.log(Viewer1.current.Viewer.state.pointerY);    //có thể là 1 ý  
                        //console.log(Viewer1.current.Viewer.ViewerDOM.addEventListener('click', (e) => {e.x}));  
                        //Viewer1.current.Viewer.ViewerDOM.addEventListener('click', (e) => {console.log(e.x)})           
                    }}
                    onClick = {(v) => console.log(v)}
                    className="map2" >
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" height="280" width="300" id='svg_map'
                    viewBox="1450 -370 300 280" onMouseMove={()=>showCoordinate()} >
                        <g id='label' transform='scale(15,15)'>
                        </g>
                        <g id='provinces_label' transform='scale(15,15)'>
                        </g>
                        <g id='districts_label' transform='scale(15,15)'>
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
                        <g id='svg_districts'>
                        </g>
                        <g id='svg_communes'>
                        </g>
                        
                        <use xlinkHref="#provinces_label" />
                        <use xlinkHref="#districts_label" />
                        <use xlinkHref="#communes_label" />
                    </svg>
                </UncontrolledReactSVGPanZoom>
                <div className='container__map-coordinate'>
                    <div id='coordinate'>
                        Tọa độ:
                        <div id='x-coordinate'></div>
                        <div id='y-coordinate'></div>
                    <div id='pan'>
                        Pan:
                        <div id='startX'></div>
                        <div id='startY'></div>
                        <div id='endX'></div>
                        <div id='endY'></div>
                        <div id='e'></div>
                        <div id='f'></div>
                        <div id='current_h'></div>
                        <div id='current_w'></div>
                        <div id='new_x'></div>
                        <div id='new_y'></div>
                    </div>
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

