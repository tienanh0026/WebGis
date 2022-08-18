import React from "react";
import '../assets/css/guide.css'
import pic from '../assets/img/hust.png'

const Guide = () => {
  function display_guide(name,guide_content){
    var object_tools = document.getElementsByClassName('guide-contents-tools');
    var object_search = document.getElementsByClassName('guide-contents-search');
    var object_info = document.getElementsByClassName('guide-contents-info');
    // for (var i =0; i<hide_object.length;i++){
    //   hide_object[i].style.display = "none";
    //   console.log('name: ',hide_object[i].className ,hide_object[i].style.display)
    // }
    //console.log(document.getElementsByClassName(name)[0].style.display);
    object_tools[0].style.display = 'none';
    object_search[0].style.display = 'none';
    object_info[0].style.display = 'none';
    document.getElementsByClassName('guide-nav-tools')[0].style.color = '';
    document.getElementsByClassName('guide-nav-search')[0].style.color = '';
    document.getElementsByClassName('guide-nav-info')[0].style.color = '';
    document.getElementsByClassName(name)[0].style.display = "block";
    document.getElementsByClassName(guide_content)[0].style.color = "red";
  }
  return (
    <div>
      <div className="guide">
      <div className="guide-nav">
        <ul>
          <li className="guide-nav-tools" onClick={()=>display_guide('guide-contents-tools','guide-nav-tools')}>  <i className="fa-solid fa-angle-right"></i>Giới thiệu thanh công cụ</li> 
          <li className="guide-nav-info" onClick={()=>display_guide('guide-contents-info','guide-nav-info')}>  <i className="fa-solid fa-angle-right"></i>Xem thông tin đối tượng</li>
          <li className="guide-nav-search" onClick={()=>display_guide('guide-contents-search','guide-nav-search')}>  <i className="fa-solid fa-angle-right"></i>Tìm kiếm</li>
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
                <th><img src={require('../assets/img/fullscreen.png')} alt="hình ảnh"/></th>
                <th>Xem toàn cảnh</th>
              </tr>
              <tr className="table-content">
                <th  id="header-content"><img src={require('../assets/img/hide.png')} alt="hình ảnh"/></th>
                <th>Ẩn/Hiện Thanh thông tin</th>
              </tr>
              <tr className="table-content">
                <th><img src={require('../assets/img/location.png')} alt="chưa có"/></th>
                <th>Xác định vị trí</th>
              </tr>
              <tr className="table-content"> 
                <th><img src={require('../assets/img/measure.png')} alt="chưa có"/></th>
                <th> Đo khoảng cách</th>
              </tr>
              <tr className="table-content">
                <th><img src={require('../assets/img/info.png')} alt="hình ảnh"/></th>
                <th>Xem thông tin</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="guide-contents-info"> <p>Từ thanh công cụ, chọn chức năng “Xem thông tin”,khi di chuột đến bản đồ mà chuột thêm biểu tượng "?" thì chế độ xem thông tin đang được bật. Thao tác trên bản đồ theo hướng dẫn bên dưới, thông tin về khu vực sẽ được hiển thị trên bản đồ.
      - Sau khi kích hoạt chức năng “Xem thông tin”, di con trỏ chuột vào bản đồ, tới khu vực muốn xem thông tin và nhấn chọn. Các thông tin thuộc khu vực sẽ hiển thị ở mục 3.</p>
      <div className="image-holder">
        <img src={require('../assets/img/info-guide.png')} alt="hình ảnh"/>
      </div>
      </div>
        <div className="guide-contents-search">
          <p>Người dùng có thể chọn chức năng tìm kiếm chi tiết theo các lớp dữ liệu tại thanh công cụ</p>
          <div className="guide-pic">
          <img  src={require('../assets/img/search-guide.png')} alt="hình ảnh"></img>
          </div>
          <p>Nhập từ khóa cần tìm, khi đó danh sách sẽ lọc ra các kết quả phù hợp. Ở đây, người dùng có thể tìm ở 2 danh sách khác nhau là danh sách các tỉnh và danh sách các quận/huyện. Hình dưới là danh sách kết quả tìm kiếm phù hợp với tiêu chí đã chọn:</p>
          <div className="guide-pic">
          <img  src={require('../assets/img/search-result.png')} alt="hình ảnh"></img>
          </div>
          <p>Để xem được bản đồ tỉnh/thành phố, nhấp chọn vào tên đối tượng trên danh sách, bản đồ sẽ hiển thị vị trí của điểm hoặc vùng như sau: </p>
          <div className="guide-pic">
          <img id="search-selected" src={require('../assets/img/search-select.png')} alt="hình ảnh"></img>
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
  
export default Guide;