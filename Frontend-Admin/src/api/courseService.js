import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hocphan';

const courseService = {
  // Lấy tất cả học phần
  getAllCourses: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi lấy danh sách học phần:', error);
      throw error;
    }
  },

  // Lấy học phần theo ID
  getCourseById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy học phần ID ${id}:`, error);
      throw error;
    }
  },

  // Lấy danh sách học phần phân trang
  getCoursesWithPagination: async (page, size) => {
    try {
      const response = await axios.get(`${API_URL}/paging?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách học phần phân trang:`, error);
      throw error;
    }
  },

  // Tạo học phần mới
  createCourse: async (course) => {
    try {
      const response = await axios.post(API_URL, course);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo học phần:', error);
      throw error;
    }
  },

  // Cập nhật học phần
  updateCourse: async (id, course) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, course);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật học phần ID ${id}:`, error);
      throw error;
    }
  },

  // Xóa học phần
  deleteCourse: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi xóa học phần ID ${id}:`, error);
      throw error;
    }
  }
};

export default courseService; 