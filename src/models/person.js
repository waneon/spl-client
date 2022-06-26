import React from 'react';
import { Space, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { socket } from '../utils/socket';

const columns = [
  {
    title: '이름',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '부서',
    dataIndex: 'dept',
    key: 'dept',
  },
  {
    title: '업무내용',
    dataIndex: 'note',
    key: 'note',
  },
  {
    title: '행선지',
    dataIndex: 'goto',
    key: 'goto',
  },
  {
    title: '날짜',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '수정/삭제',
    key: 'action',
    render: (_, record) => {
      // on-update callback
      const onUpdate = () => {
        socket().emit('get', {
          target: 'person',
          detail: {
            key: record.key,
            which: record.which,
          },
        });
      };

      // on-delete callback
      const onDelete = () => {
        Modal.confirm({
          title: '정말로 삭제하시겠습니까?',
          icon: <ExclamationCircleOutlined />,
          content: '확인을 누르시면 해당 정보가 사라집니다.',
          centered: true,
          onOk() {
            socket().emit('delete', {
              target: 'person',
              detail: {
                key: record.key,
                which: record.which,
              },
            });
          },
        });
      };

      return (
        <Space size="middle">
          <a onClick={onUpdate}>수정</a>
          <a onClick={onDelete} style={{ color: 'red' }}>
            삭제
          </a>
        </Space>
      );
    },
    width: '15%',
    align: 'center',
  },
];

export default columns;
