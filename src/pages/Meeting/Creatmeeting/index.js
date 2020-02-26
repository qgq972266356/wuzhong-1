import React, { useState } from 'react';
import CreateMeeting from '../Mutations/CreateMeeting'
import Calendar from '../../../components/Calendar/index'
import { useHistory } from "react-router-dom";
import { fetchQuery, QueryRenderer, graphql } from 'react-relay';
import './index.css';
import {
  Breadcrumb,
  Form,
  Input,
  Card,
  Col,
  PageHeader,
  Table,
  Button,
  Divider,
  Modal
} from 'antd';

import ModalAddAttendees from '@/components/ModalAddAttendees';


const { TextArea } = Input;
const columns = [
  {
    title: '参会人姓名',
    dataIndex: 'name',
    key: 'name',
    className: 'tabcolums'
  },
  {
    title: '工号',
    dataIndex: 'age',
    key: 'age',
    className: 'tabcolums'
  },
  {
    title: '所属部门',
    dataIndex: 'address',
    key: 'address',
    className: 'tabcolums'
  },
  {
    title: '操作',
    className: 'tabcolums',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>删除</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    name: '张三',
    age: "0001",
    address: '治安大队',
  },
  {
    key: '2',
    name: '李四',
    age: "0002",
    address: '交警大队',
  },
  {
    key: '3',
    name: '王五',
    age: "0003",
    address: '刑侦大队',
  },
];

const query = graphql`
    query Creatmeeting_MeetingRoomListQuery{
        meetingRoomList{
        edges{
            id,
            name
        }
        }
    }`

var childrenMsg = {}
function AddMeeting(props) {
  let history = useHistory();
  //添加与会负责人
  const [modalAddAttendeesVisible, setModalAddAttendeesVisible] = useState(false);

  const environment = props.environment
  const resourceMap = props.meetingRoomList.edges.map(function (edge, index) {
    return { 'resourceId': edge.id, 'resourceTitle': edge.name }
  })
  const loading = false

  //添加负责人返回
  let modalAddAttendeesCallback = (a, d) => {
    setModalAddAttendeesVisible(false);
    console.log(a,d)
  }
  
  function getChildrenMsg(result, msg) {
    console.log(msg)
    // 很奇怪这里的result就是子组件那bind的第一个参数this，msg是第二个参数

    childrenMsg = msg
    console.log(childrenMsg)
  }

  function handleSubmit(e) {
    let obj = childrenMsg
    console.log(obj)
    // return false
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        CreateMeeting.commit(
          props.environment,
          new Date(obj.start).toISOString(),
          obj.resourceId,
          values.number,
          new Date(obj.end).toISOString(),
          obj.title,
          values.organizer,
          'configuration',
          values.intro,
          [],
          (response, errors) => {
            if (errors) {
              console.log(errors)
              Modal.error({
                title: errors[0].message,
              });
            } else {
              console.log(response);
              Modal.success({
                content: '提交成功',
                onOk() {
                  history.goBack()
                },
              });
              
            }
          },
          (response, errors) => {
            if (errors) {
              console.log(errors)
            } else {
              console.log(response);
            }
          }
        );
      }
    });
  };

  function goBack(){
    history.goBack()
  }

  const { getFieldDecorator } = props.form;
  return (
    <>
      <Card title="会议室和会议时间" bordered={false} >
        <div style={{ height: 500 }}>
          <Calendar resourceMap={resourceMap} parent={getChildrenMsg} />
        </div>

      </Card>
      <Divider />

      <Form layout="inline" onSubmit={handleSubmit} style={{ margin: '0px' }}>
        <Card title="基本信息" >
          <Col span={8}>
            <Form.Item label="主办单位" >
              {getFieldDecorator('organizer', {
                rules: [{ required: true, message: '请输入呈报单位!' }],
              })(
                <Input
                  placeholder="请输入呈报单位"
                />,
              )}

            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="会议名称" >
              {getFieldDecorator('meetingName', {
                rules: [{ required: true, message: '请输入会议名称!' }],
              })(
                <Input
                  placeholder="请输入会议名称"
                />,
              )}

            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="参会人数" >
              {getFieldDecorator('number', {
                rules: [{ required: true, message: '请输入参会人数!' }],
              })(
                <Input
                  placeholder="请输入参会人数"
                />,
              )}

            </Form.Item>
          </Col>
          <Col span={12} className="meeting_requirements">
            <Form.Item label="会议要求" >
              {getFieldDecorator('intro', {
                rules: [{ required: true, message: '请输入会议要求!' }],
              })(
                <TextArea
                  placeholder="请输入会议要求"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
              )}

            </Form.Item>
          </Col></Card>
        <div style={{ clear: "both" }}></div>
        <Divider />
        <Card title="参会人员" style={{ margin: '0px 0 20px 0' }}>
          <Table columns={columns} dataSource={data} pagination={false} />
          <Button icon="plus" onClick={()=>{ setModalAddAttendeesVisible(true) }}  style={{ margin: '5px 0 20px 0', width: '100%' }}>
            添加负责人
          </Button>
        </Card>
        <Col span={24}>
          <Form.Item style={{ marginLeft: '41%' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '50px' }}>
              确认
              </Button>
            {/* <Button type="primary" htmlType="submit" style={{ marginRight: '50px' }}>
              暂存
              </Button> */}
            <Button onClick={goBack}>
              取消
              </Button>
          </Form.Item>
        </Col>
      </Form>

      <ModalAddAttendees environment={environment} Visible={modalAddAttendeesVisible}  callback={modalAddAttendeesCallback.bind(this)} />
    </>

  )

}

const AddMeeting2 = Form.create({ name: 'horizontal_login' })(AddMeeting)

function Home(props) {

  console.log(props)
  const environment = props.environment;



  return (
    <div style={{ backgroundColor: '#f0f2f5' }}>
      <Card title="" bordered={false} >
        <Breadcrumb style={{ margin: '0px 0px 15px 0px' }}>
          <Breadcrumb.Item>会议室管理</Breadcrumb.Item>
          <Breadcrumb.Item>会议室预定表</Breadcrumb.Item>
        </Breadcrumb>
        <PageHeader
          title="会议室预定表"
          subTitle="用于内部各个会议室的预定功能"
        />
      </Card>
      <Divider />

      <QueryRenderer
        environment={environment}
        query={query}
        render={({ error, props, retry }) => {
          if (error) {
            return (
              <div>
                <h1>Error!</h1><br />{error.message}
              </div>)
          } else if (props) {
            if (props.meetingRoomList) {

              return (
                <>
                  <AddMeeting2 environment={environment} meetingRoomList={props.meetingRoomList} ref="children" />
                </>
              )
            }
          }
          return <div>Loading</div>;
        }}
      />

    </div>
  );
}

export default Home;