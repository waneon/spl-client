import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

import columns from '../models/person';
import { socket, check_message } from '../utils/socket';

import './Person.scss';

function MyModal({ visible, mode, setVisible, location }) {
  const [form] = Form.useForm();

  const title = mode == null ? '추가' : '수정';

  // when update mode change form
  useEffect(() => {
    // date un-formatting
    if (mode?.date) {
      mode.date = moment(mode.date, 'YYYY-MM-DD');
    }

    if (mode) {
      form.setFieldsValue(mode);
    }
  }, [mode]);

  const modalOff = () => {
    setVisible(false);
    form.resetFields();
  };

  const onAdd = (values) => {
    // date formatting
    if (values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    } else {
      values.date = null;
    }
    // location setting
    values.which = location;

    // emit add method
    socket().emit('add', {
      target: 'person',
      detail: values,
    });

    modalOff();
  };

  const onUpdate = (values) => {
    // date formatting
    if (values.date) {
      values.date = values.date.format('YYYY-MM-DD');
    } else {
      values.date = null;
    }
    // location setting
    values.which = location;

    // emit add method
    socket().emit('update', {
      target: 'person',
      detail: {
        ...values,
        key: mode.key,
      },
    });

    modalOff();
  };

  const onFinish = mode == null ? onAdd : onUpdate;

  return (
    <Modal
      centered
      visible={visible}
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
        <Form.Item
          label="이름"
          name="name"
          rules={[{ required: true, message: '이름을 입력하세요' }]}
        >
          <Input />
        </Form.Item>
        {/* 부서 */}
        <Form.Item label="부서" name="dept">
          <Input />
        </Form.Item>
        {/* 업무내용 */}
        <Form.Item label="업무내용" name="note">
          <Input />
        </Form.Item>
        {/* 행선지 */}
        <Form.Item label="행선지" name="goto">
          <Input />
        </Form.Item>
        {/* 날짜 */}
        <Form.Item label="날짜" name="date">
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  );
}

function Person() {
  const location = useLocation().pathname;
  const [render, setRender] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState(null);

  // turn on "add"
  const setModalAdd = useCallback(() => {
    setModal(true), setModalMode(null);
  }, []);

  useEffect(() => {
    // emit gets method
    socket().emit('gets', {
      target: 'person',
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

    // for get method received
    socket().on('get', (data) => {
      if (check_message(data, location)) {
        setModal(true);
        setModalMode(data.value);
      }
    });

    // for add method received
    socket().on('add', (data) => {
      if (check_message(data, location)) {
        setRender((render) => [...render, data.value]);
      }
    });

    // for delete method received
    socket().on('delete', (data) => {
      if (check_message(data, location)) {
        setRender((render) =>
          render.filter((entry) => entry.key != data.value.key),
        );
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
      <div className="person-content">
        <Table
          columns={columns}
          dataSource={render}
          className="person-content-table"
        />
        <Button
          type="primary"
          shape="round"
          icon={<PlusOutlined />}
          size={'large'}
          className="person-content-button"
          danger
          style={{
            width: 130,
            height: 50,
            fontSize: '24px',
            fontWeight: 'bold',
          }}
          onClick={setModalAdd}
        >
          Add
        </Button>
        <MyModal
          visible={modal}
          mode={modalMode}
          setVisible={setModal}
          location={location}
        />
      </div>
    </>
  );
}

export default Person;
