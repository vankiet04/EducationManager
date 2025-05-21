const axios = require('axios');

const API_URL = 'http://localhost:8080';

async function checkApi() {
  try {
    const [plans, courses, curriculums] = await Promise.all([
      axios.get(`${API_URL}/api/KeHoachDayHoc`),
      axios.get(`${API_URL}/api/hocphan`),
      axios.get(`${API_URL}/api/thongTinChung`)
    ]);
    
    console.log('API DEBUG RESULTS:');
    console.log('-----------------');
    
    if (plans.data.length) {
      console.log('First teaching plan:', JSON.stringify(plans.data[0], null, 2));
      console.log('Plan fields:', Object.keys(plans.data[0]));
    }
    
    if (courses.data.length) {
      console.log('First course:', JSON.stringify(courses.data[0], null, 2));
      console.log('Course fields:', Object.keys(courses.data[0]));
    }
    
    if (curriculums.data.length) {
      console.log('First curriculum:', JSON.stringify(curriculums.data[0], null, 2));
      console.log('Curriculum fields:', Object.keys(curriculums.data[0]));
    }
    
    // Test relationship mapping
    if (plans.data.length && courses.data.length && curriculums.data.length) {
      const plan = plans.data[0];
      const course = courses.data.find(c => c.id === (plan.hoc_phan_id || plan.hocPhanId));
      const curriculum = curriculums.data.find(c => c.id === (plan.ctdt_id || plan.ctdtId));
      
      console.log('Relationship test:');
      console.log('Plan ID:', plan.id);
      console.log('Referenced course ID:', plan.hoc_phan_id || plan.hocPhanId);
      console.log('Referenced curriculum ID:', plan.ctdt_id || plan.ctdtId);
      console.log('Found course:', course ? 'YES' : 'NO');
      console.log('Found curriculum:', curriculum ? 'YES' : 'NO');
    }
  } catch (error) {
    console.error('Error fetching API data:', error.message);
  }
}

checkApi(); 