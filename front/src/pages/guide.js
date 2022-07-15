import React from "react";
import '../assets/css/guide.css'
import pic from '../assets/img/hust.png'

const Guide = () => {
  function display_guide(name){
    var object_tools = document.getElementsByClassName('guide-contents-tools');
    var object_maps = document.getElementsByClassName('guide-contents-maps');
    var object_search = document.getElementsByClassName('guide-contents-search');
    // for (var i =0; i<hide_object.length;i++){
    //   hide_object[i].style.display = "none";
    //   console.log('name: ',hide_object[i].className ,hide_object[i].style.display)
    // }
    //console.log(document.getElementsByClassName(name)[0].style.display);
    object_tools[0].style.display = 'none';
    object_maps[0].style.display = 'none';
    object_search[0].style.display = 'none';
    document.getElementsByClassName(name)[0].style.display = "block";
    
  }
  return (
    <div>
      <h1 
      >Hướng dẫn</h1>
      <div className="guide">
      <div className="guide-nav">
        <ul>
          <li className="guide-nav-tools" onClick={()=>display_guide('guide-contents-tools')}>Giới thiệu thanh công cụ</li> 
          <li className="guide-nav-maps" onClick={()=>display_guide('guide-contents-maps')}>Xem bản đồ Tỉnh/Thành Phố</li>
          <li className="guide-nav-search" onClick={()=>display_guide('guide-contents-search')}>Tìm kiếm</li>
        </ul>
      </div>
      <div className="guide-content">
        <div className="guide-contents-tools">
          <table>
            <tbody>
              <tr>
                <th className="table-header" id="header-tools">Công Cụ</th>
                <th className="table-header">Tác Dụng</th>
              </tr>
              <tr className="table-content">
                <th  id="header-content"><img src={require('../assets/img/hide.png')} alt="hình ảnh"/></th>
                <th>Ẩn/Hiện Thanh công cụ</th>
              </tr>
              <tr className="table-content">
              <th><img src={require('../assets/img/zoomin.png')} alt="hình ảnh"/></th>
                <th>Phóng to theo vùng</th>
              </tr>
              <tr className="table-content">
              <th ><img src={require('../assets/img/zoomout.png')} alt="hình ảnh"/></th>
                <th>Thu nhỏ theo vùng</th>
              </tr>
              <tr className="table-content">
                <th ><img src={require('../assets/img/mousemode.png')} alt="hình ảnh"/></th>
                <th>Chế độ chuột</th>
              </tr>
              <tr className="table-content">
                <th><img src={require('../assets/img/panmode.png')} alt="hình ảnh"/></th>
                <th>Chế độ di chuyển bản đồ</th>
              </tr>
              <tr className="table-content">
                <th><img alt="chưa có"/></th>
                <th>Xác định vị trí</th>
              </tr>
              <tr className="table-content">
                <th><img src={require('../assets/img/fullscreen.png')} alt="hình ảnh"/></th>
                <th>Xem toàn cảnh</th>
              </tr>
              <tr className="table-content"> 
                <th><img alt="chưa có"/></th>
                <th>Đo khoảng cách</th>
              </tr>
              <tr className="table-content">
                <th><img src={require('../assets/img/hide.png')} alt="hình ảnh"/></th>
                <th>Xác định vị trí</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="guide-contents-maps">Bản đồ</div>
        <div className="guide-contents-search">Tìm kiếm</div>
      </div>
      </div>
    </div>
  );
};
  
export default Guide;