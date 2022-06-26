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
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';

import { socket, check_message } from '../utils/socket';

import './Person.scss';

const { confirm } = Modal;

function MyModal({ entry, setEntry, location }) {
  const [form] = Form.useForm();

  form.resetFields();
  const modalOff = () => {
    setEntry({
      key: -1,
    });
  };

  const onFinish = (values) => {
    // date formatting
    if (values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    } else {
      values.date = undefined;
    }
    // time formatting
    if (values.time) {
      values.time = values.time.format('HH:mm');
    } else {
      values.time = undefined;
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
        key: entry.key,
      },
    });

    modalOff();
  };

  const defaultDate = entry.date ? moment(entry.date, 'YYYY-MM-DD') : null;
  const defaultTime = entry.time ? moment(entry.time, 'HH:mm') : null

  return (
    <Modal
      centered
      visible={entry.key != -1}
      title={entry.enabled == true ? '수정' : '추가'}
      onOk={modalOff}
      onCancel={modalOff}
      width="60%"
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
        {/* 사용자 */}
        <Form.Item label="사용자" name="name">
          <Input defaultValue={entry.name} />
        </Form.Item>
        {/* 부서 */}
        <Form.Item label="부서" name="dept">
          <Input defaultValue={entry.dept} />
        </Form.Item>
        {/* 설명 */}
        <Form.Item label="행선지/업무내용" name="note">
          <Input defaultValue={entry.note} />
        </Form.Item>
        {/* 날짜 */}
        <Form.Item label="날짜" name="date">
          <DatePicker defaultValue={defaultDate} />
        </Form.Item>
        {/* 시간 */}
        <Form.Item label="시간" name="time">
          <TimePicker format="HH:mm" defaultValue={defaultTime} />
        </Form.Item>
        {/* 거리 */}
        <Form.Item label="거리(km)" name="distance">
          <InputNumber defaultValue={entry.distance} />
        </Form.Item>
        {/* 기름량 */}
        <Form.Item label="주유(L)" name="oil">
          <InputNumber defaultValue={entry.oil} />
        </Form.Item>
        {/* 하이패스 충전량 */}
        <Form.Item label="하이패스 충전(만원)" name="hipass">
          <InputNumber defaultValue={entry.hipass} />
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

function Entry({ entry, setEntry, location }) {
  const [modal, setModal] = useState(false);

  const onSave = () => {
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
        which: location,
      },
    });

    socket().emit('add', {
      target: 'vehicle-log',
      detail: {
        ...entry,
        key: undefined,
      },
    });

    setModal(false);
  };

  const onAdd = () => {
    setEntry(entry);
    console.log(entry);
  };

  const onDelete = () => {
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
        which: location,
      },
    });

    setModal(false);
  };

  const onEdit = () => {
    setEntry(entry);
  };

  return (
    <>
      <Card
        title={
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            {entry.car_name}
          </Typography.Title>
        }
        extra={
          entry.enabled ? (
            <>
              <EditOutlined
                onClick={onEdit}
                style={{ color: 'blue', marginRight: '8pt' }}
              />
              <DeleteOutlined
                onClick={() => setModal(true)}
                style={{ color: 'red' }}
              />
            </>
          ) : (
            <PlusOutlined onClick={onAdd} style={{ color: 'green' }} />
          )
        }
      >
        <EntryRow label="사용자" data={entry.name} />
        <EntryRow label="부서" data={entry.dept} />
        <EntryRow label="행선지/업무내용" data={entry.note} />
        <EntryRow label="날짜" data={entry.date} />
        <EntryRow label="시간" data={entry.time} />
        <EntryRow label="거리(km)" data={entry.distance} />
        <EntryRow label="주유(L)" data={entry.oil} />
        <EntryRow label="하이패스 충전(만원)" data={entry.hipass} />
      </Card>
      <Modal
        visible={modal}
        title="삭제"
        onCancel={() => setModal(false)}
        footer={[
          <Button key="back" onClick={() => setModal(false)}>
            취소
          </Button>,
          <Button key="submit" type="primary" onClick={onDelete}>
            삭제
          </Button>,
          <Button key="link" type="primary" onClick={onSave}>
            저장 후 삭제
          </Button>,
        ]}
      >
        해당 항목을 삭제합니다.
      </Modal>
    </>
  );
}

function Vehicle() {
  const location = useLocation().pathname;
  const [render, setRender] = useState([]);
  const [entry, setEntry] = useState({ key: -1 });

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
      if (check_message(data, location)) {
        setRender(data.value);
      }
    });

    // for update method received
    socket().on('update', (data) => {
      if (check_message(data, location)) {
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
            <Entry entry={entry} setEntry={setEntry} location={location} />
          </Col>
        ))}
      </Row>
      <MyModal entry={entry} setEntry={setEntry} location={location} />
    </>
  );
}

export default Vehicle;
