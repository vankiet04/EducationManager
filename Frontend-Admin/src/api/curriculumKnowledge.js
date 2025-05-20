import axios from 'axios';

const API_URL = 'http://localhost:8080/api/chitietkhungchuongtrinh';

export const curriculumKnowledgeService = {
    getAll: () => {
        return axios.get(API_URL);
    },

    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    getByCurriculumId: (curriculumId) => {
        return axios.get(`${API_URL}/curriculum/${curriculumId}`);
    },

    getByStatus: (status) => {
        return axios.get(`${API_URL}/status/${status}`);
    },

    create: (data) => {
        return axios.post(API_URL, data);
    },

    update: (id, data) => {
        return axios.put(`${API_URL}/${id}`, data);
    },

    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    getByKhungChuongTrinhId: (id) => {
        return axios.get(`${API_URL}/${id}`);
    }
}; 