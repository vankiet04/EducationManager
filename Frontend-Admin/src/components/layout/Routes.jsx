// General
import NotFound from "../../pages/error/NotFound";
import ManageCustomer from "../../pages/customers/ManageCustomer";

// Lecturers (Giảng viên)
import ManageLecturer from "../../pages/lecturers/ManageLecturer";

// Courses (Học phần)
import ManageCourses from "../../pages/courses/ManageCourses";

// Curriculum (Khung chương trình)
import ManageCurriculum from "../../pages/curriculum/ManageCurriculum";

// Knowledge Groups (Nhóm kiến thức)
import ManageKnowledgeGroups from "../../pages/knowledge-groups/ManageKnowledgeGroups";

// Curriculum Knowledge (Khung chương trình - Nhóm kiến thức)
import ManageCurriculumKnowledge from "../../pages/curriculum-knowledge/ManageCurriculumKnowledge";

// Syllabuses (Đề cương chi tiết)
import ManageSyllabuses from "../../pages/syllabuses/ManageSyllabuses";

// Grade Columns (Cột điểm)
import ManageGradeColumns from "../../pages/grade-columns/ManageGradeColumns";

// General Information (Thông tin chung)
import ManageGeneralInfo from "../../pages/general-info/ManageGeneralInfo";

// Course Groups (Nhóm học phần)
import ManageCourseGroups from "../../pages/course-groups/ManageCourseGroups";

// Teaching Assignments (Phân công giảng dạy)
import ManageTeachingAssignments from "../../pages/teaching-assignments/ManageTeachingAssignments";

// Teaching Plan (Kế hoạch dạy học)
import ManageTeachingPlan from "../../pages/teaching-plan/ManageTeachingPlan";

const routes = [
  {
    path: "/",
    element: <ManageCustomer />,
  },
  // User Management (Quản lý người dùng)
  {
    path: "/customers/manage",
    element: <ManageCustomer />,
  },
  // Lecturer Management (Quản lý giảng viên)
  {
    path: "/lecturers/manage",
    element: <ManageLecturer />,
  },
  // Course Management (Quản lý học phần)
  {
    path: "/courses/manage",
    element: <ManageCourses />,
  },
  // Curriculum Management (Quản lý khung chương trình)
  {
    path: "/curriculum/manage",
    element: <ManageCurriculum />,
  },
  // Knowledge Group Management (Quản lý nhóm kiến thức)
  {
    path: "/knowledge-groups/manage",
    element: <ManageKnowledgeGroups />,
  },
  // Curriculum Knowledge Management (Quản lý khung chương trình - nhóm kiến thức)
  {
    path: "/curriculum-knowledge/manage",
    element: <ManageCurriculumKnowledge />,
  },
  // Syllabus Management (Quản lý đề cương chi tiết)
  {
    path: "/syllabuses/manage",
    element: <ManageSyllabuses />,
  },
  // Grade Column Management (Quản lý cột điểm)
  {
    path: "/grade-columns/manage",
    element: <ManageGradeColumns />,
  },
  // General Information (Thông tin chung)
  {
    path: "/general-info/manage",
    element: <ManageGeneralInfo />,
  },
  // Course Group Management (Quản lý nhóm học phần)
  {
    path: "/course-groups/manage",
    element: <ManageCourseGroups />,
  },
  // Teaching Assignment Management (Phân công giảng dạy)
  {
    path: "/teaching-assignments/manage",
    element: <ManageTeachingAssignments />,
  },
  // Teaching Plan Management (Kế hoạch dạy học)
  {
    path: "/teaching-plan/manage",
    element: <ManageTeachingPlan />,
  },
  // Error pages
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;