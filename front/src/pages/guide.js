import React, { useRef , useState, useEffect} from "react";
import { UncontrolledReactSVGPanZoom, zoomOnViewerCenter, INITIAL_VALUE } from "react-svg-pan-zoom";
import map_component from '../components/provinces.js'
const Guide = () => {
  var list = [
    { id_1: 7, name_1: 'An Giang' },
    { id_1: 8, name_1: 'Bà Rịa - Vũng Tàu' },
    { id_1: 14, name_1: 'Bắc Giang' },
    { id_1: 15, name_1: 'Bắc Kạn' },
    { id_1: 13, name_1: 'Bạc Liêu' },
    { id_1: 16, name_1: 'Bắc Ninh' },
    { id_1: 17, name_1: 'Bến Tre' },
    { id_1: 9, name_1: 'Bình Định' },
    { id_1: 10, name_1: 'Bình Dương' },
    { id_1: 11, name_1: 'Bình Phước' },
    { id_1: 12, name_1: 'Bình Thuận' },
    { id_1: 18, name_1: 'Cà Mau' },
    { id_1: 20, name_1: 'Cần Thơ' },
    { id_1: 19, name_1: 'Cao Bằng' },
    { id_1: 1, name_1: 'Đà Nẵng' },
    { id_1: 5, name_1: 'Đắk Lắk' },
    { id_1: 4, name_1: 'Đăk Nông' },
    { id_1: 6, name_1: 'Điện Biên' },
    { id_1: 2, name_1: 'Đồng Nai' },
    { id_1: 3, name_1: 'Đồng Tháp' },
    { id_1: 21, name_1: 'Gia Lai' },
    { id_1: 22, name_1: 'Hà Giang' },
    { id_1: 24, name_1: 'Hà Nam' },
    { id_1: 23, name_1: 'Hà Nội' },
    { id_1: 25, name_1: 'Hà Tĩnh' },
    { id_1: 29, name_1: 'Hải Dương' },
    { id_1: 30, name_1: 'Hải Phòng' },
    { id_1: 31, name_1: 'Hậu Giang' },
    { id_1: 26, name_1: 'Hồ Chí Minh city' },
    { id_1: 27, name_1: 'Hòa Bình' },
    { id_1: 28, name_1: 'Hưng Yên' },
    { id_1: 32, name_1: 'Khánh Hòa' },
    { id_1: 33, name_1: 'Kiên Giang' },
    { id_1: 34, name_1: 'Kon Tum' },
    { id_1: 37, name_1: 'Lai Châu' },
    { id_1: 36, name_1: 'Lâm Đồng' },
    { id_1: 38, name_1: 'Lạng Sơn' },
    { id_1: 35, name_1: 'Lào Cai' },
    { id_1: 39, name_1: 'Long An' },
    { id_1: 40, name_1: 'Nam Định' },
    { id_1: 41, name_1: 'Nghệ An' },
    { id_1: 42, name_1: 'Ninh Bình' },
    { id_1: 43, name_1: 'Ninh Thuận' },
    { id_1: 44, name_1: 'Phú Thọ' },
    { id_1: 45, name_1: 'Phú Yên' },
    { id_1: 46, name_1: 'Quảng Bình' },
    { id_1: 47, name_1: 'Quảng Nam' },
    { id_1: 48, name_1: 'Quảng Ngãi' },
    { id_1: 49, name_1: 'Quảng Ninh' },
    { id_1: 50, name_1: 'Quảng Trị' },
    { id_1: 51, name_1: 'Sóc Trăng' },
    { id_1: 52, name_1: 'Sơn La' },
    { id_1: 53, name_1: 'Tây Ninh' },
    { id_1: 54, name_1: 'Thái Bình' },
    { id_1: 55, name_1: 'Thái Nguyên' },
    { id_1: 57, name_1: 'Thanh Hóa' },
    { id_1: 56, name_1: 'Thừa Thiên - Huế' },
    { id_1: 58, name_1: 'Tiền Giang' },
    { id_1: 59, name_1: 'Trà Vinh' },
    { id_1: 60, name_1: 'Tuyên Quang' },
    { id_1: 61, name_1: 'Vĩnh Long' },
    { id_1: 62, name_1: 'Vĩnh Phúc' },
    { id_1: 63, name_1: 'Yên Bái' }
  ]

  var search_data = [];
  const get_search_list = async () => {
    // var input, filter, ul, li, a, i, txtValue;
    // input = document.getElementById("search-text");
    // filter = input.value.toUpperCase();
    // ul = document.getElementById("search-list");
    // li = ul.getElementsByTagName("li");
    try{
        const response = await fetch('http://localhost/api/search-provinces',{
            method: 'GET',
            credentials: 'omit',
            headers: {"Content-Type":'application/json'},
            body: JSON.stringify()
        });
        let responseData = await response.json();
        search_data = responseData.province;
        console.log(search_data);
    } catch(err) {
        console.log(err)
    }
}
useEffect(() => { 
  get_search_list();
  List()
  // getSVG_provinces();
  // Run! Like go get some data from an API.
}, []);
  function List() {
    return (
        <ul>
            {list.map((item) => (
                <li key={item.id_1}>{item.name_1}</li>
            ))}
        </ul>
    )
}
  return (
    <div>
      <h1 
      onClick={()=>document.getElementById('1').innerHTML={List}}
      >Hướng dẫn</h1>
      <div className="main">
        <h1>React Search</h1>
        <div className="search1">
        </div>
        <div id='search-container'>
                        <List/>
                    </div>
      </div>
    </div>
  );
};
  
export default Guide;