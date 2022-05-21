import React from 'react';
import { useLocation } from 'react-router-dom';
import menuList from '../models/menuList';
import { PageHeader } from 'antd';

function Title() {
  const location = useLocation().pathname;

  let [title, subTitle] = ['', ''];

  menuList.forEach((mainMenu) => {
    if (mainMenu.subMenuList) {
      mainMenu.subMenuList.forEach((subMenu) => {
        if (mainMenu.path + subMenu.path === location) {
          [title, subTitle] = [subMenu.name, mainMenu.name];
        }
      });
    } else {
      if (mainMenu.path === location) {
        title = mainMenu.name;
      }
    }
  });

  return (
    <PageHeader
      title={title}
      subTitle={subTitle}
      style={{ height: '64px', paddingLeft: 0, paddingRight: 0 }}
    />
  );
}

export default Title;
