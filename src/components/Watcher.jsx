import React, { useEffect, useState } from 'react';
import { Descriptions, Button, Input, Select, Modal } from 'antd';

import { socket, check_message } from '../utils/socket';

const { confirm } = Modal;

function Entry({ render, setEdit }) {
  // date
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const onEdit = () => {
    setEdit(true);
  };

  const onDelete = () => {
    confirm({
      title: '삭제',
      content: '내용을 삭제합니다.',
      onOk() {
        socket().emit('update', {
          target: 'watcher',
          detail: {
            name: '',
            dept: '',
            phone: '',
            status: '',
            note: render.note,
            key: render.key,
          },
        });
      },
    });
  };

  return (
    <>
      <Descriptions
        contentStyle={{ background: 'white', fontSize: '16px', width: '35%' }}
        labelStyle={{
          width: '15%',
          textAlign: 'center',
          height: '80px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        column={2}
        title="당직자 정보"
        bordered
      >
        <Descriptions.Item label="당직일자" span={2}>
          {dateString}
        </Descriptions.Item>
        <Descriptions.Item label="이름">{render.name}</Descriptions.Item>
        <Descriptions.Item label="부서">{render.dept}</Descriptions.Item>
        <Descriptions.Item label="연락처">{render.phone}</Descriptions.Item>
        <Descriptions.Item label="근무현황">{render.status}</Descriptions.Item>
        <Descriptions.Item label="당직예정자" span={2}>
          {render.note}
        </Descriptions.Item>
      </Descriptions>
      <Button
        type="primary"
        onClick={onEdit}
        style={{ marginRight: 10, marginTop: 20 }}
      >
        수정
      </Button>
      <Button type="danger" onClick={onDelete} style={{}}>
        삭제
      </Button>
    </>
  );
}

function EntryEdit({ render, setEdit }) {
  const [detail, setDetail] = useState({});

  // date
  const today = new Date();
  const dateString = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  const onEdit = () => {
    setEdit(false);
    socket().emit('update', {
      target: 'watcher',
      detail: {
        ...detail,
        key: render.key,
      },
    });
  };

  const onChange = (key, value) => {
    setDetail((detail) => ({
      ...detail,
      [key]: value,
    }));
  };

  return (
    <>
      <Descriptions
        contentStyle={{ background: 'white', fontSize: '16px', width: '35%' }}
        labelStyle={{
          width: '15%',
          textAlign: 'center',
          height: '80px',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
        column={2}
        title="당직자 정보"
        bordered
      >
        <Descriptions.Item label="당직일자" span={2}>
          {dateString}
        </Descriptions.Item>
        <Descriptions.Item label="이름">
          <Input
            defaultValue={render.name}
            onChange={(e) => onChange('name', e.target.value)}
          />
        </Descriptions.Item>
        <Descriptions.Item label="부서">
          <Input
            defaultValue={render.dept}
            onChange={(e) => onChange('dept', e.target.value)}
          />
        </Descriptions.Item>
        <Descriptions.Item label="연락처">
          <Input
            defaultValue={render.phone}
            onChange={(e) => onChange('phone', e.target.value)}
          />
        </Descriptions.Item>
        <Descriptions.Item label="근무현황">
          <Select
            defaultValue={render.status}
            placeholder="근무현황을 선택하세요"
            onChange={(value) => onChange('status', value)}
          >
            <Select.Option value="1층 사무실">1층 사무실</Select.Option>
            <Select.Option value="2층 연구소">2층 연구소</Select.Option>
            <Select.Option value="순찰 중">순찰 중</Select.Option>
            <Select.Option value="식사 중">식사 중</Select.Option>
          </Select>
        </Descriptions.Item>
        <Descriptions.Item label="당직예정자" span={2}>
          <Input
            defaultValue={render.note}
            onChange={(e) => onChange('note', e.target.value)}
          />
        </Descriptions.Item>
      </Descriptions>
      <Button type="primary" onClick={onEdit} style={{}}>
        확인
      </Button>
    </>
  );
}

function Watcher() {
  const [render, setRender] = useState(null);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    // emit gets method
    socket().emit('gets', {
      target: 'watcher',
      detail: {},
    });

    // for gets method received
    socket().on('gets', (data) => {
      if (check_message(data, location)) {
        setRender(data.value[0]);
      }
    });

    // for update method received
    socket().on('update', (data) => {
      if (check_message(data, location)) {
        setRender(data.value);
      }
    });

    // clean-up
    return () => {
      socket().removeAllListeners();
    };
  }, []);

  if (render == null) {
    return null;
  } else if (!edit) {
    return <Entry render={render} setEdit={setEdit} />;
  } else {
    return <EntryEdit render={render} setEdit={setEdit} />;
  }
}

export default Watcher;
