import axios from 'axios';

const API_URL = 'http://localhost:8080/api/kehoachmonhom';

const courseGroupService = {
  // Lấy tất cả kế hoạch mở nhóm
  getAllCourseGroups: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách kế hoạch mở nhóm:', error);
      throw error;
    }
  },

  // Lấy kế hoạch mở nhóm theo ID
  getCourseGroupById: async (id) => {
    try {
      console.log(`Đang lấy dữ liệu kế hoạch mở nhóm ID: ${id}`);
      const response = await axios.get(`${API_URL}/${id}`);
      console.log('Dữ liệu nhận được:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy kế hoạch mở nhóm ID ${id}:`, error);
      
      if (error.response) {
        // Lỗi từ máy chủ với mã trạng thái
        console.error('Mã lỗi:', error.response.status);
        console.error('Dữ liệu lỗi:', error.response.data);
      } else if (error.request) {
        // Không nhận được phản hồi từ máy chủ
        console.error('Không nhận được phản hồi từ máy chủ');
      } else {
        // Lỗi khi thiết lập request
        console.error('Lỗi:', error.message);
      }
      
      throw error;
    }
  },

  // Lấy kế hoạch mở nhóm theo học phần ID
  getCourseGroupsByHocPhanId: async (hocPhanId) => {
    try {
      const response = await axios.get(`${API_URL}/hocphan/${hocPhanId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy kế hoạch mở nhóm theo học phần ID ${hocPhanId}:`, error);
      throw error;
    }
  },

  // Lấy kế hoạch mở nhóm theo năm học và học kỳ
  getCourseGroupsByNamHocAndHocKy: async (namHoc, hocKy) => {
    try {
      const response = await axios.get(`${API_URL}/search?namHoc=${namHoc}&hocKy=${hocKy}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy kế hoạch mở nhóm theo năm học ${namHoc} và học kỳ ${hocKy}:`, error);
      throw error;
    }
  },

  // Tạo kế hoạch mở nhóm mới
  createCourseGroup: async (courseGroup) => {
    try {
      // Log dữ liệu đang gửi đi để debug
      console.log('Dữ liệu gửi lên server khi tạo kế hoạch mở nhóm:', JSON.stringify(courseGroup));
      
      // Gọi API
      const response = await axios.post(API_URL, courseGroup);
      
      // Log kết quả
      console.log('Kết quả tạo kế hoạch mở nhóm:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo kế hoạch mở nhóm:', error);
      
      if (error.response) {
        // Chi tiết lỗi từ server nếu có
        console.error('Chi tiết lỗi từ server:', error.response.data);
        console.error('Mã lỗi:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // Lỗi không nhận được phản hồi
        console.error('Không nhận được phản hồi từ server:', error.request);
      } else {
        // Lỗi khác
        console.error('Lỗi:', error.message);
      }
      
      throw error;
    }
  },

  // Cập nhật kế hoạch mở nhóm
  updateCourseGroup: async (id, courseGroup) => {
    try {
      // In dữ liệu gửi lên để debug
      console.log('Dữ liệu cập nhật:', { id, data: courseGroup });
      
      // Gọi API cập nhật
      const response = await axios.put(`${API_URL}/${id}`, courseGroup);
      
      // In thông tin response để debug
      console.log('Response từ API:', response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật kế hoạch mở nhóm ID ${id}:`, error);
      console.error('Chi tiết lỗi:', error.response?.data || error.message);
      throw error;
    }
  },

  // Xóa kế hoạch mở nhóm
  deleteCourseGroup: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa kế hoạch mở nhóm ID ${id}:`, error);
      throw error;
    }
  }
};

export default courseGroupService; 