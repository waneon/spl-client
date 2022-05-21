import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { MemoryRouter, Link, Route, Routes, Navigate } from 'react-router-dom';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';

import menuList from './models/menuList';

import Watcher from './components/Watcher.jsx';
import Title from './components/Title.jsx';
import Person from './components/Person.jsx';
import Home from './components/Home.jsx';
import Vehicle from './components/Vehicle.jsx';
import './App.scss';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

function App() {
  // collapsed state
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((collapsed) => !collapsed);

  // logo
  const logo = collapsed ? 'S' : 'SPL';

  return (
    <MemoryRouter>
      {/* whole layout */}
      <Layout style={{ minHeight: '100%' }}>
        {/* side */}
        <Sider collapsible collapsed={collapsed} trigger={null}>
          <div className="logo">{logo}</div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['/']}>
            {menuList.map((menu) => {
              if (menu.subMenuList) {
                return (
                  <SubMenu
                    key={menu.path}
                    title={menu.name}
                    icon={<menu.icon />}
                  >
                    {menu.subMenuList.map((subMenu) => (
                      <Menu.Item key={menu.path + subMenu.path}>
                        <Link to={menu.path + subMenu.path} />
                        {subMenu.name}
                      </Menu.Item>
                    ))}
                  </SubMenu>
                );
              } else {
                return (
                  <Menu.Item key={menu.path} icon={<menu.icon />}>
                    <Link to={menu.path} />
                    {menu.name}
                  </Menu.Item>
                );
              }
            })}
          </Menu>
        </Sider>
        {/* main */}
        <Layout className="site-layout">
          <Header className="site-layout-background header">
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: 'trigger',
                onClick: toggleCollapsed,
              },
            )}
            <Title />
          </Header>
          <Content
            style={{
              margin: '16px 24px 16px',
              overflow: 'initial',
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="k">
                <Route path="lab" element={<Person key="/k/lab" />} />
                <Route path="qual" element={<Person key="/k/qual" />} />
                <Route path="vehicle" element={<Vehicle key="/k/vehicle" />} />
                <Route path="watcher" element={<Watcher key="/k/watcher" />} />
              </Route>
              <Route path="b">
                <Route path="qual" element={<Person key="/b/qual" />} />
                <Route path="vehicle" element={<Vehicle key="/b/vehicle" />} />
              </Route>
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </MemoryRouter>
  );
}

export default App;
