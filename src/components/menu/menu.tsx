import {
  BusinessCenter,
  BusinessCenterOutlined,
  Checklist,
  ChecklistOutlined,
  Dashboard,
  DashboardOutlined,
  PeopleAlt,
  PeopleAltOutlined,
} from '@mui/icons-material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import './menu.css';
import { Tooltip } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth';

const Menu: React.FC = () => {
  // const isMobile = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const pathname = location.pathname;

  async function handleSignOut(): Promise<void> {
    await signOut();
  }

  const menuItems = [
    {
      name: 'Home',
      title: 'Home',
      path: '/',
      icon: (
        <Tooltip title="Home" placement="right">
          <DashboardOutlined className="icon-menu" />
        </Tooltip>
      ),
      activeIcon: (
        <Tooltip title="Home" placement="right">
          <Dashboard className="icon-menu" />
        </Tooltip>
      ),
      isActive: pathname === '/',
    },
    {
      name: 'Deals',
      title: 'Deals',
      path: '/deal',
      icon: (
        <Tooltip title="Deals" placement="right">
          <BusinessCenterOutlined className="icon-menu" />
        </Tooltip>
      ),
      activeIcon: (
        <Tooltip title="Deals" placement="right">
          <BusinessCenter className="icon-menu" />
        </Tooltip>
      ),
      isActive: pathname.startsWith('/deal'),
    },
    {
      name: 'Customers',
      title: 'Customers',
      path: '/customer',
      icon: (
        <Tooltip title="Customers" placement="right">
          <PeopleAltOutlined className="icon-menu" />
        </Tooltip>
      ),
      activeIcon: (
        <Tooltip title="Customers" placement="right">
          <PeopleAlt className="icon-menu" />
        </Tooltip>
      ),
      isActive: pathname.startsWith('/customer'),
    },
    {
      name: 'Tasks',
      title: 'Tasks',
      path: '/task',
      icon: (
        <Tooltip title="Tasks" placement="right">
          <ChecklistOutlined className="icon-menu" />
        </Tooltip>
      ),
      activeIcon: (
        <Tooltip title="Tasks" placement="right">
          <Checklist className="icon-menu" />
        </Tooltip>
      ),
      isActive: pathname.startsWith('/task'),
    },
    {
      name: 'Users',
      title: 'Users',
      path: '/user',
      icon: (
        <Tooltip title="Users" placement="right">
          <AssignmentIndOutlinedIcon className="icon-menu" />
        </Tooltip>
      ),
      activeIcon: (
        <Tooltip title="Users" placement="right">
          <AssignmentIndIcon className="icon-menu" />
        </Tooltip>
      ),
      isActive: pathname.startsWith('/user'),
    },
  ];

  return (
    <Drawer variant="permanent">
      <List className="list-menu">
        {menuItems.map(({ name, path, icon, activeIcon, isActive }) => (
          <ListItem key={name} className="list-item-menu">
            <ListItemButton
              onClick={() => navigate(path)}
              className={`list-button-menu ${isActive ? 'active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              <ListItemIcon className="icon-menu">{isActive ? activeIcon : icon}</ListItemIcon>
            </ListItemButton>
          </ListItem>
        ))}

        {/* {isMobile && ( */}
        <ListItem className="list-item-menu">
          <ListItemButton onClick={handleSignOut} className="list-button-menu">
            <ListItemIcon className="icon-menu">
              <LogoutOutlinedIcon className="icon-menu" />
            </ListItemIcon>
          </ListItemButton>
        </ListItem>
        {/* )} */}
      </List>
    </Drawer>
  );
};

export default Menu;
