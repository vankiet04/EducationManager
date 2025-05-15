import React, { useState, useEffect } from 'react';
import * as Icons from 'react-icons/tb';
import { useDispatch } from 'react-redux';
import Logo from '../../images/common/logo.svg';
import { Link, NavLink, useLocation } from 'react-router-dom';
import navigation from '../../api/navigation.jsx';
import {logout} from '../../store/slices/authenticationSlice.jsx';

const Sidebar = () => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(null);
  const [sidebar, setSidebar] = useState(false);
  const location = useLocation();
  const [activeSubmenu, setActiveSubmenu] = useState(false);

  // Auto-expand menu based on current path
  useEffect(() => {
    const currentPath = location.pathname;
    let foundActive = false;
    
    navigation.forEach((item, index) => {
      if (item.subMenu) {
        const matchingSubItem = item.subMenu.find(
          (subItem) => currentPath === subItem.url || currentPath.startsWith(subItem.url)
        );
        if (matchingSubItem) {
          setToggle(index);
          setActiveSubmenu(true);
          foundActive = true;
        }
      }
    });
    
    if (!foundActive) {
      setActiveSubmenu(false);
    }
  }, [location]);

  const handleManu = (key) => {
    setToggle((prevToggle) => (prevToggle === key ? null : key));
  };

  const handleSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleIsLogout = () => {
    dispatch(logout())
  };

  return (
    <div className={`sidemenu ${sidebar ? 'active' : ''}`}>
      {/* Admin User */}
      <div className="sidebar_profile">
        {/*<Link to="/" className="logo">
          <img src={Logo} alt="logo" />
        </Link>*/}

        <h2 className="logo_text">Your Logo</h2>
        <Link className="navbar_icon menu_sidebar" onClick={handleSidebar}>
          <Icons.TbChevronsLeft className={`${sidebar ? 'active' : ''}`} />
        </Link>
      </div>
      {/* menu links */}
      <ul className="menu_main">
        {navigation.map(function (navigationItem, key) {
          // Check if current menu item is active
          const isActive = !activeSubmenu && location.pathname === navigationItem.url;
          
          return (
            <li key={key}>
              {!navigationItem.subMenu ? (
                <NavLink
                  to={`${navigationItem.url}`}
                  className={({ isActive }) => `menu_link ${isActive ? 'active' : ''}`}
                >
                  {navigationItem.icon}
                  <span>{navigationItem.name}</span>
                </NavLink>
              ) : (
                <div 
                  className={`menu_link ${toggle === key ? 'expanded' : ''}`}
                  onClick={() => handleManu(key)}
                >
                  {navigationItem.icon}
                  <span>{navigationItem.name}</span>
                  <Icons.TbChevronDown 
                    className={`dropdown_icon ${toggle === key ? 'rotate' : ''}`}
                  />
                </div>
              )}
              {navigationItem.subMenu ? (
                <ul className={`sub_menu ${toggle === key ? 'active' : ''}`}>
                  {navigationItem.subMenu &&
                    navigationItem.subMenu.map(function (subNavigationItem, subKey) {
                      return (
                        <li key={subKey}>
                          <NavLink
                            to={subNavigationItem.url}
                            className={({ isActive }) => `menu_link ${isActive ? 'active' : ''}`}
                          >
                            {subNavigationItem.icon}
                            <span>{subNavigationItem.name}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                </ul>
              ) : null}
            </li>
          );
        })}
        <li>
          <div
            className="menu_link"
            onClick={handleIsLogout}
          >
            <Icons.TbLogout className="menu_icon" />
            <span>Logout</span>
          </div>
        </li>
      </ul>
      <style jsx global>{`
        .dropdown_icon {
          transition: transform 0.3s ease;
          margin-left: auto;
        }
        .dropdown_icon.rotate {
          transform: rotate(180deg);
        }
        .menu_link.expanded {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .menu_link.active {
          background-color: #1163d7 !important;
          color: white !important;
        }
        .menu_link.active span {
          color: white !important;
        }
        .menu_link.active svg {
          stroke: white !important;
          color: white !important;
        }
        .menu_link.active .menu_icon {
          color: white !important;
          stroke: white !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;