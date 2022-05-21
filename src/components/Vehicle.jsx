import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Typography,
  Modal,
  Form,
  Button,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
} from 'antd';
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons';

import socket from '../utils/socket';

import './Person.scss';

const { confirm } = Modal;

function MyModal({ myKey, setKey, location }) {
  const [form] = Form.useForm();

  const title = '추가';

  const modalOff = () => {
    setKey(0);
    form.resetFields();
  };

  const onFinish = (values) => {
    // date formatting
    if (values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    } else {
      values.date = null;
    }
    // time formatting
    if (values.time) {
      values.time = values.time.format('HH:mm');
    } else {
      values.time = null;
    }
    // location setting
    values.which = location;
    // enable setting
    values.enabled = true;

    // emit add method
    socket().emit('update', {
      target: 'vehicle',
      detail: {
        ...values,
        key: myKey,
      },
    });

    modalOff();
  };

  return (
    <Modal
      centered
      visible={myKey != 0}
      title={title}
      onOk={modalOff}
      onCancel={modalOff}
      footer={[
        <Button
          form="myForm"
          className="person-modal-button"
          type="primary"
          htmlType="submit"
          key="1"
        >
          확인
        </Button>,
        <Button
          className="person-modal-button"
          htmlType="button"
          danger
          onClick={modalOff}
          key="2"
        >
          취소
        </Button>,
      ]}
    >
      <Form
        form={form}
        id="myForm"
        name="basic"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={onFinish}
      >
        {/* 이름 */}
        <Form.Item label="이름" name="name">
          <Input />
        </Form.Item>
        {/* 부서 */}
        <Form.Item label="부서" name="dept">
          <Input />
        </Form.Item>
        {/* 설명 */}
        <Form.Item label="설명" name="note">
          <Input />
        </Form.Item>
        {/* 날짜 */}
        <Form.Item label="날짜" name="date">
          <DatePicker />
        </Form.Item>
        {/* 시간 */}
        <Form.Item label="시간" name="time">
          <TimePicker format="HH:mm" />
        </Form.Item>
        {/* 거리 */}
        <Form.Item label="거리" name="distance">
          <InputNumber />
        </Form.Item>
        {/* 기름량 */}
        <Form.Item label="기름량" name="oil">
          <InputNumber />
        </Form.Item>
        {/* 하이패스 충전량 */}
        <Form.Item label="하이패스" name="hipass">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function EntryRow({ label, data }) {
  return (
    <Row gutter={20}>
      <Col span={12}>{label}</Col>
      <Col span={12}>{data}</Col>
    </Row>
  );
}

function Entry({ entry, setKey }) {
  const onSave = () => {
    confirm({
      title: '저장 후 삭제',
      content: '해당 항목을 서버에 저장 후 삭제합니다.',
      onOk() {
        socket().emit('update', {
          target: 'vehicle',
          detail: {
            key: entry.key,
            name: '',
            dept: '',
            note: '',
            date: '',
            time: '',
            distance: null,
            oil: null,
            hipass: null,
            enabled: false,
          },
        });

        socket().emit('add', {
          target: 'vehicle-log',
          detail: {
            ...entry,
            key: undefined,
          },
        });
      },
    });
  };

  const onAdd = () => {
    setKey(entry.key);
  };

  const onDelete = () => {
    confirm({
      title: '삭제',
      content: '해당 항목을 삭제합니다.',
      onOk() {
        socket().emit('update', {
          target: 'vehicle',
          detail: {
            key: entry.key,
            name: '',
            dept: '',
            note: '',
            date: '',
            time: '',
            distance: null,
            oil: null,
            hipass: null,
            enabled: false,
          },
        });
      },
    });
  };

  return (
    <Card
      title={
        <Typography.Title level={2} style={{ textAlign: 'center' }}>
          {entry.car_name}
        </Typography.Title>
      }
      extra={
        entry.enabled ? (
          <>
            <SaveOutlined
              onClick={onSave}
              style={{ color: 'blue', marginRight: '8pt' }}
            />
            <DeleteOutlined onClick={onDelete} style={{ color: 'red' }} />
          </>
        ) : (
          <PlusOutlined onClick={onAdd} style={{ color: 'green' }} />
        )
      }
    >
      <EntryRow label="이름" data={entry.name} />
      <EntryRow label="부서" data={entry.dept} />
      <EntryRow label="설명" data={entry.note} />
      <EntryRow label="날짜" data={entry.date} />
      <EntryRow label="시간" data={entry.time} />
      <EntryRow label="거리" data={entry.distance} />
      <EntryRow label="기름량(L)" data={entry.oil} />
      <EntryRow label="하이패스 충전량(원)" data={entry.hipass} />
    </Card>
  );
}

function Vehicle() {
  const location = useLocation().pathname;
  const [render, setRender] = useState([]);
  const [key, setKey] = useState(0);

  // turn on "add"
  const setModalAdd = useCallback(() => {
    setModal(true), setModalMode(null);
  }, []);

  useEffect(() => {
    // emit gets method
    socket().emit('gets', {
      target: 'vehicle',
      detail: {
        which: location,
      },
    });

    // for gets method received
    socket().on('gets', (data) => {
      if (data.status == 'ok') {
        setRender(data.value);
      }
    });

    // for get method received
    // socket().on('get', (data) => {
    //   if (data.status == 'ok') {
    //     setModal(true);
    //     setModalMode(data.value);
    //   }
    // });

    // for update method received
    socket().on('update', (data) => {
      if (data.status == 'ok') {
        setRender((render) =>
          render.map((entry) => {
            if (entry.key == data.value.key) return data.value;
            else return entry;
          }),
        );
      }
    });

    // clean-up
    return () => {
      socket().removeAllListeners();
    };
  }, []);

  return (
    <>
      <Row gutter={[24, 24]}>
        {render.map((entry) => (
          <Col
            span={8}
            key={entry.key}
            style={{ opacity: entry.enabled ? 1.0 : 0.5 }}
          >
            <Entry entry={entry} setKey={setKey} />
          </Col>
        ))}
      </Row>
      <MyModal myKey={key} setKey={setKey} location={location} />
    </>
  );
}

export default Vehicle;
