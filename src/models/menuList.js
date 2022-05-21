import {
  HomeOutlined,
  PictureOutlined,
  BarChartOutlined,
} from '@ant-design/icons';

const menuList = [
  {
    name: '홈 화면',
    path: '/',
    icon: HomeOutlined,
  },
  {
    name: '경산 공장',
    path: '/k',
    icon: BarChartOutlined,
    subMenuList: [
      {
        name: '연구소 근무현황',
        path: '/lab',
      },
      {
        name: '1층 사무실 근무현황',
        path: '/qual',
      },
      {
        name: '차량 운행정보',
        path: '/vehicle',
      },
      {
        name: '당직자 정보',
        path: '/watcher',
      },
    ],
  },
  {
    name: '부산 공장',
    path: '/b',
    icon: BarChartOutlined,
    subMenuList: [
      {
        name: '사무실 근무현황',
        path: '/qual',
      },
      {
        name: '차량 운행정보',
        path: '/vehicle',
      },
    ],
  },
  {
    name: '게시판',
    path: '/notice',
    icon: PictureOutlined,
  },
];

export default menuList;
