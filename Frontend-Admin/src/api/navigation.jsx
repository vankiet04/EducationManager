import React from "react";
import * as Icons from "react-icons/tb";
import { ReadOutlined, BookOutlined, ClusterOutlined, NodeIndexOutlined, FileTextOutlined, PercentageOutlined, InfoCircleOutlined, DatabaseOutlined } from "@ant-design/icons";

// Navigation Items
const navigation = [
  // Quản lý người dùng - User Management
  {
    name: "Quản lý người dùng",
    url: "/customers/manage",
    icon: <Icons.TbUsers className="menu_icon" />,
  },
  // Quản lý giảng viên - Lecturer Management
  {
    name: "Quản lý giảng viên",
    url: "/lecturers/manage",
    icon: <Icons.TbUserEdit className="menu_icon" />,
  },
  // Quản lý giảng dạy - Teaching Management
  {
    name: "Quản lý giảng dạy",
    url: "",
    icon: <Icons.TbChalkboard className="menu_icon" />,
    subMenu: [
      // Phân công giảng dạy - Teaching Assignment
      {
        name: "Phân công giảng dạy",
        url: "/teaching-assignments/manage",
        icon: <Icons.TbClipboardText className="menu_icon" />,
      },
      // Kế hoạch mở nhóm - Course Group
      {
        name: "Kế hoạch mở nhóm",
        url: "/course-groups/manage",
        icon: <Icons.TbUsersGroup className="menu_icon" />,
      },
      // Kế hoạch dạy học - Teaching Plan
      {
        name: "Kế hoạch dạy học",
        url: "/teaching-plan/manage",
        icon: <Icons.TbCalendarEvent className="menu_icon" />,
      },
    ]
  },
  // Quản lý đào tạo - Education Management
  {
    name: "Quản lý đào tạo",
    url: "",
    icon: <Icons.TbSchool className="menu_icon" />,
    subMenu: [
      // Chương trình đào tạo (renamed from Thông tin chung)
      {
        name: "Chương trình đào tạo",
        url: "/general-info/manage",
        icon: <Icons.TbCertificate className="menu_icon" />,
      },
      // Khung chương trình - Curriculum Framework
      {
        name: "Khung chương trình",
        url: "/curriculum/manage",
        icon: <BookOutlined className="menu_icon" />,
      },
      // Nhóm kiến thức - Knowledge Group
      {
        name: "Nhóm kiến thức",
        url: "/knowledge-groups/manage",
        icon: <ClusterOutlined className="menu_icon" />,
      },
      // Khung CT - Nhóm kiến thức - Curriculum-Knowledge Relation
      {
        name: "KCT - Nhóm kiến thức",
        url: "/curriculum-knowledge/manage", 
        icon: <NodeIndexOutlined className="menu_icon" />,
      },
      // Quản lý học phần - Course Management
      {
        name: "Quản lý học phần",
        url: "/courses/manage",
        icon: <Icons.TbBooks className="menu_icon" />,
      },
      // Quản lý đề cương chi tiết - Syllabus Management
      {
        name: "Đề cương chi tiết",
        url: "/syllabuses/manage",
        icon: <FileTextOutlined className="menu_icon" />,
      },
      // Cột điểm - Grade Column
      {
        name: "Cột điểm",
        url: "/grade-columns/manage",
        icon: <PercentageOutlined className="menu_icon" />,
      },
    ]
  },
];

export default navigation;