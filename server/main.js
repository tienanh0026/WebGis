
const express = require('express')
const bodyParser = require('body-parser')
// const methodOverride = require('method-override')
const { Pool, Client } = require('pg');
const { text } = require('body-parser');

//khoi dong
const app = express();
app.listen(80, () => {
    console.log('server has started')
})

// Khoi dong bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Khoi dong methodOverride middleware
// app.use(methodOverride('_method'))

// Khoi dong express middleware
app.use(express.json())

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'new',
    password: '260200',
    port: 5432,
})


client.connect(err => {
    if (err) {
        console.error('connection error', err.stack)
    } else {
        console.log('connected')
    }
})

app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'DELETE,GET,PATCH,POST,PUT');
    res.append('Access-Control-Allow-Headers', 'Content-Type,Authorization');

	if (res.method == 'OPTIONS')
		res.send(200);
	else next();
})

    const distance_vietnam = 0.0006333506258222088;
    const distance_province = 0.0009331911029070842;
    const distance_district = 0.0010366561142713135; 
    const distance_commune = 0.0008716231255018777;


app.post('/api/getCoordinate', (req,res) =>{
    console.log(req.body);
    const {x ,y} = req.body;
    if(x<500 && y<240 && x>400 && y>40){
        res.json({
            result: 'Inside Box',
        })}
    else{
    res.json({
        result: 'Outside Box',
    })}
})


app.get('/api/search-provinces', (req, res) => {

    client.query(`select id_1, name_1 from vnm_adm1 order by name_1 ;`, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        // console.log(result.rows)
        res.json({province: result.rows })

    })
});

app.get('/api/search-districts', (req, res) => {

    client.query(`select name_1,id_1, id_2, name_2 from vnm_adm2 order by id_2 ;`, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        //console.log(result.rows)
        res.json({districts: result.rows })
    })
});

// var vietnam_distance = 0;
// var province_distance = 0;
// var district_distance = 0;

app.get('/api/get-geometry-vietnam/vietnam', (req, res) => {
	//const {scale} = req.body;
    //console.log(scale);

    client.query(`SELECT st_assvg(geom) from vnm_adm0;`, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        console.log("layer Tỉnh: ban đầu: ",result.rows[0].st_assvg.length)
        var new_svg1 = reduce_points(result.rows,distance_vietnam);
        for(var a=0; a<result.rows.length;a++){
            result.rows[a].st_assvg = new_svg1[a];
        }
        console.log("layer Tỉnh: sau khi loại: ",result.rows[0].st_assvg.length)
        res.json({svg_geo_vn: result.rows })
        //vietnam_distance = avg_distance(result.rows)
        })
    });

app.get('/api/get-geometry-vietnam/provinces', (req, res) => {

    client.query(`SELECT name_1,st_assvg(geom),type_1 from vnm_adm1 order by id_1;`, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        var total = 0;
        for(var a = 0; a< result.rows.length;a++){
            total+= result.rows[a].st_assvg.length;    
        }
        console.log("layer Quận: ban đầu: ",total)
        var new_svg1 = reduce_points(result.rows,distance_province);
        for(var a=0; a<result.rows.length;a++){
            result.rows[a].st_assvg = new_svg1[a];
        }
        var total_filter =0;
        for(var a = 0; a< result.rows.length;a++){
            total_filter+= result.rows[a].st_assvg.length;         
        }
        console.log("layer Quận: sau khi loại: ",total_filter)
        res.json({svg_geo_provinces: result.rows })
        //province_distance = avg_distance(result.rows)
        })
    });

app.get('/api/get-geometry-vietnam/district', (req, res) => {

    client.query(`select id_1, name_1, id_2, name_2,type_2,st_assvg(geom) from vnm_adm2 order by id_2`, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        var total = 0;
        for(var a = 0; a< result.rows.length;a++){
            total+= result.rows[a].st_assvg.length;    
        }
        console.log("ban đầu: ",total)
        var new_svg1 = reduce_points(result.rows,distance_district);
        for(var a=0; a<result.rows.length;a++){
            result.rows[a].st_assvg = new_svg1[a];
        }
        var total_filter =0;
        for(var a = 0; a< result.rows.length;a++){
            total_filter+= result.rows[a].st_assvg.length;         
        }
        console.log("sau khi loại: ",total_filter)
        res.json({svg_geo_districts: result.rows })
        //district_distance = avg_distance(result.rows)
        })
    });

app.post('/api/get-geometry-vietnam/district-new', (req,res) =>{
    const {screen} = req.body;
    console.log(screen)
    var xmin = screen[0].x;
    var xmax = screen[1].x;
    var ymin = screen[0].y;
    var ymax = screen[1].y;
    var width = xmax - xmin;
    var height = ymax - ymin;
    var screen_extend = 1.5;
    // var center_x = xmin + (xmax-xmin)/2;
    // var center_y = ymax + (Math.abs(ymin-ymax)/2);
    // if(scale > 5 && scale < 8){
    //     screen_extend = 1.3;
    // }
    // else if (scale > 8 && scale < 11){
    //     screen_extend = 1.4;
    // }
    // else if(scale > 11 && scale < 14){
    //     screen_extend = 1.5;
    // }
    // else if(scale > 14 && scale < 16){
    //     screen_extend = 1.6;
    // }
    // else if(scale > 16 && scale < 19){
    //     screen_extend = 1.85;
    // }
    // else if(scale > 19){
    //     screen_extend = 2.05;
    // }
    xmin = xmin - (screen_extend-1)*width;
    xmax = xmax + (screen_extend-1)*width;
    ymin = ymin - (screen_extend-1)*height;
    ymax = ymax + (screen_extend-1)*height;
    console.log('xmin:',xmin,' xmax: ',xmax,' screen_ex: ', screen_extend)
    var text = '';
    var a = text.concat('(ST_XMin(ST_Collect(geom))*15+(ST_XMax(ST_Collect(geom))-ST_XMin(ST_Collect(geom)))*15/2) >',xmin,
    ' and (ST_XMin(ST_Collect(geom))*15+(ST_XMax(ST_Collect(geom))-ST_XMin(ST_Collect(geom)))*15/2) <',xmax,
    ' and (ST_YMax(ST_Collect(geom))*-15-abs((ST_YMax(ST_Collect(geom))-ST_YMin(ST_Collect(geom))))*-15/2) >',ymin,
    ' and (ST_YMax(ST_Collect(geom))*-15-abs((ST_YMax(ST_Collect(geom))-ST_YMin(ST_Collect(geom))))*-15/2) <',ymax)
    var b= "select id_1,name_1,id_2, name_2,type_2,st_assvg(geom) from vnm_adm2 group by id_1,name_1,id_2,name_2,type_2,geom having ";
    var c = b.concat(a)
    console.log(c);
    //console.log(c);
    client.query(c, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        res.json({screen_reduce: result.rows })
        //console.log(result.rows.length)
        //console.log(a)
        //district_distance = avg_distance(result.rows)
        })
    });

app.post('/api/get-geometry-vietnam/province-new', (req,res) =>{
    const {screen} = req.body;
    console.log(screen)
    var xmin = screen[0].x;
    var xmax = screen[1].x;
    var ymin = screen[0].y;
    var ymax = screen[1].y;
    var width = xmax - xmin;
    var height = ymax - ymin;
    var screen_extend = 1.5;
    // if(scale > 5 && scale < 8){
    //     screen_extend = 1.3;
    // }
    // else if (scale > 8 && scale < 11){
    //     screen_extend = 1.4;
    // }
    // else if(scale > 11 && scale < 14){
    //     screen_extend = 1.5;
    // }
    // else if(scale > 14 && scale < 16){
    //     screen_extend = 1.6;
    // }
    // else if(scale > 16 && scale < 19){
    //     screen_extend = 1.7;
    // }
    // else if(scale > 19){
    //     screen_extend = 1.9;
    // }
    xmin = xmin - (screen_extend-1)*width;
    xmax = xmax + (screen_extend-1)*width;
    ymin = ymin - (screen_extend-1)*height;
    ymax = ymax + (screen_extend-1)*height;
    console.log('xmin:',xmin,' xmax: ',xmax,' screen_ex: ', screen_extend)
    // var center_x = xmin + (xmax-xmin)/2;
    // var center_y = ymax + (Math.abs(ymin-ymax)/2);
    var text = '';
    var a = text.concat('(ST_XMin(ST_Collect(geom))*15+(ST_XMax(ST_Collect(geom))-ST_XMin(ST_Collect(geom)))*15/2) >',xmin,
    ' and (ST_XMin(ST_Collect(geom))*15+(ST_XMax(ST_Collect(geom))-ST_XMin(ST_Collect(geom)))*15/2) <',xmax,
    ' and (ST_YMax(ST_Collect(geom))*-15-abs((ST_YMax(ST_Collect(geom))-ST_YMin(ST_Collect(geom))))*-15/2) >',ymin,
    ' and (ST_YMax(ST_Collect(geom))*-15-abs((ST_YMax(ST_Collect(geom))-ST_YMin(ST_Collect(geom))))*-15/2) <',ymax)
    var b= "select id_1,name_1,type_1,st_assvg(geom) from vnm_adm1 group by id_1,name_1,type_1,geom having ";
    var c = b.concat(a);
    console.log(c);
    //console.log(c);
    
    client.query(c, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        res.json({province_screen_reduce: result.rows })
        //console.log(result.rows)
        //console.log(a)
        //district_distance = avg_distance(result.rows)
        })
    });

app.post('/api/get-geometry-vietnam/commune', (req, res) => {
    const {district_name} = req.body;
    var a = '';
    var district = district_name.replace(/^\s+|\s+$/gm,'');
    district = "'"+district+"'";
    var b= "select id_1 , name_1, id_2, name_2, id_3, name_3,type_3, st_assvg(geom) from vnm_adm3 where name_2=";
    var c = a.concat(b,district)
    //console.log(c)
    client.query(c, (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        res.json({svg_geo_communes: result.rows })
        console.log(result.rows.length)
        console.log(a)
        //district_distance = avg_distance(result.rows)
        })
    });

app.post('/api/get-geometry-info/provinces', (req,res) =>{
    console.log(req.body);
    const {sql_select_province} = req.body;
      console.log(a);
    // b= 'SELECT name_1,ST_XMin(ST_Collect(geom)),ST_XMax(ST_Collect(geom)),ST_YMin(ST_Collect(geom)),ST_YMax(ST_Collect(geom)) FROM vnm_adm1 where id_1=7 group by name_1'
    // a.concat(province_id, ' group by name_1')
    client.query(sql_select_province, (err, result) => {
        if (err) {
            return console.error('Error running query', err)
        }
        res.json({svg_geo_province_info: result.rows })
        })
})


app.get('/api/get-geometry-vietnam/province_bbox', (req, res) => {
	//const {scale} = req.body;
    //console.log(scale);

    client.query(`select id_1,name_1,ST_XMin(ST_Collect(geom))*15 as xmin,ST_XMax(ST_Collect(geom))*15 as xmax,
    ST_YMin(ST_Collect(geom))*-15 as ymin,ST_YMax(ST_Collect(geom))*-15 as ymax from vnm_adm1 group by id_1,name_1 order by id_1 `, 
    (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        res.json({svg_province_bbox: result.rows })
        //vietnam_distance = avg_distance(result.rows)
        })
    });

app.get('/api/get-geometry-vietnam/district_bbox', (req, res) => {
    //const {scale} = req.body;
    //console.log(scale);

    client.query(`select id_1,name_1,id_2, name_2,type_2,ST_XMin(ST_Collect(geom))*15 as xmin,ST_XMax(ST_Collect(geom))*15 as xmax,
    ST_YMin(ST_Collect(geom))*-15 as ymin,ST_YMax(ST_Collect(geom))*-15 as ymax from vnm_adm2 group by id_1,name_1,id_2,name_2,type_2 order by id_2 `, 
    (err, result) => {
        if (err) {

            return console.error('Error running query', err)
        }
        res.json({svg_district_bbox: result.rows })
        //vietnam_distance = avg_distance(result.rows)
        })
    });

function avg_distance(arr){
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
    var avg_total = 0;
    for (var x = 0; x<distance.length;x++){
        avg_total += distance[x];
    }
    avg_total = avg_total/distance.length;
    return avg_total;
}

function reduce_points(arr,distance){
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
                        if(avg < distance){
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
    //console.log("Tổng điểm ban đầu: ",total_points)
    //console.log("So diem loại bỏ: ",total_point_reduce);
    return new_arr;

}

// function reduce_points_vietnam(arr){
//     var total_point_reduce = 0;
//     var total_points = 0;
//     var new_arr = [];
//     for(var z = 0; z< arr.length; z++){
//         a = arr[z].st_assvg.split(" ");
//         // console.log(a.length);
//         // console.log(a[4]-a[6]);
//         var cnt_x =0;
//         var cnt_y =0;
//         var cnt = 0;
//         var cnt_test = 0;
//         var cnt_points = 0;
//         var point_reduce = 0;
//         var avg_x = 0;
//         var avg_y = 0;
//         var avg= 0;

//         for (var i = 0; i < a.length;i++){
//             if (a[i] == "M" || a[i]=="L"|| a[i]=="Z" ){
//                 cnt+=1;
//                 continue
//             }
//             if (a[i] == ""){
//                 point_reduce+=1;
//                 continue
//             }
//             if (102 < a[i] ){
//                 if(i < a.length-2){
//                     if(a[i+2] == "M" || a[i+2] =="L"|| a[i+2]=="Z"){
//                         cnt_test+=1;
//                     }
//                     else{
//                         avg_x= Math.pow((a[i]-a[i+2]),2);
//                         avg_y= Math.pow((a[i+1]-a[i+3]),2);
//                         avg = Math.sqrt(Math.abs(avg_x+avg_y));
//                         if(avg < distance_vietnam){
//                             cnt_points+=1;
//                             a[i+2] = "";
//                             a[i+3] = ""
//                         }
//                     }
//                     cnt_x+=1;
//                 }
//             }
//             else if (a[i] <-8){
//                 cnt_y+=1;
//             }                
//         }
//         new_arr.push(a.join(" "))
//         total_points += (a.length-cnt)/2;
//         total_point_reduce += point_reduce;
//     }
//     // console.log("so luong x: ",cnt_x)
//     // console.log("so luong y: ",cnt_y)
//     // console.log("so luong diem chữ ",cnt)
//     //console.log("Tổng điểm ban đầu: ",total_points)
//     //console.log("So diem loại bỏ: ",total_point_reduce);
//     return new_arr;

// }

// function reduce_points_provinces(arr){
//     var total_point_reduce = 0;
//     var total_points = 0;
//     var new_arr = [];
//     for(var z = 0; z< arr.length; z++){
//         a = arr[z].st_assvg.split(" ");
//         // console.log(a.length);
//         // console.log(a[4]-a[6]);
//         var cnt_x =0;
//         var cnt_y =0;
//         var cnt = 0;
//         var cnt_test = 0;
//         var cnt_points = 0;
//         var point_reduce = 0;
//         var avg_x = 0;
//         var avg_y = 0;
//         var avg= 0;

//         for (var i = 0; i < a.length;i++){
//             if (a[i] == "M" || a[i]=="L"|| a[i]=="Z" ){
//                 cnt+=1;
//                 continue
//             }
//             if (a[i] == ""){
//                 point_reduce+=1;
//                 continue
//             }
//             if (102 < a[i] ){
//                 if(i < a.length-2){
//                     if(a[i+2] == "M" || a[i+2] =="L"|| a[i+2]=="Z"){
//                         cnt_test+=1;
//                     }
//                     else{
//                         avg_x= Math.pow((a[i]-a[i+2]),2);
//                         avg_y= Math.pow((a[i+1]-a[i+3]),2);
//                         avg = Math.sqrt(Math.abs(avg_x+avg_y));
//                         if(avg < distance_province){
//                             cnt_points+=1;
//                             a[i+2] = "";
//                             a[i+3] = ""
//                         }
//                     }
//                     cnt_x+=1;
//                 }
//             }
//             else if (a[i] <-8){
//                 cnt_y+=1;
//             }                
//         }
//         new_arr.push(a.join(" "))
//         total_points += (a.length-cnt)/2;
//         total_point_reduce += point_reduce;
//     }
//     return new_arr;

// }

// function reduce_points_districts(arr){
//     var total_point_reduce = 0;
//     var total_points = 0;
//     var new_arr = [];
//     for(var z = 0; z< arr.length; z++){
//         a = arr[z].st_assvg.split(" ");
//         var cnt_x =0;
//         var cnt_y =0;
//         var cnt = 0;
//         var cnt_test = 0;
//         var cnt_points = 0;
//         var point_reduce = 0;
//         var avg_x = 0;
//         var avg_y = 0;
//         var avg= 0;
//         for (var i = 0; i < a.length;i++){
//             if (a[i] == "M" || a[i]=="L"|| a[i]=="Z" ){
//                 cnt+=1;
//                 continue
//             }
//             if (a[i] == ""){
//                 point_reduce+=1;
//                 continue
//             }
//             if (102 < a[i] ){
//                 if(i < a.length-2){
//                     if(a[i+2] == "M" || a[i+2] =="L"|| a[i+2]=="Z"){
//                         cnt_test+=1;
//                     }
//                     else{
//                         avg_x= Math.pow((a[i]-a[i+2]),2);
//                         avg_y= Math.pow((a[i+1]-a[i+3]),2);
//                         avg = Math.sqrt(Math.abs(avg_x+avg_y));
//                         if(avg < distance_district){
//                             cnt_points+=1;
//                             a[i+2] = "";
//                             a[i+3] = ""
//                         }
//                     }
//                     cnt_x+=1;
//                 }
//             }
//             else if (a[i] <-8){
//                 cnt_y+=1;
//             }                
//         }
//         new_arr.push(a.join(" "))
//         total_points += (a.length-cnt)/2;
//         total_point_reduce += point_reduce;
//     }
//     return new_arr;
// }