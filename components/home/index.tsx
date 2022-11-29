import styles from '../../styles/Home.module.css'
import { Button, Card, Checkbox, Form, Input, Layout } from 'antd';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useLens } from '../context/lens';
import { useAccount, useSigner } from 'wagmi';

const { Header, Footer, Sider, Content } = Layout;

const HomePage = () => {

  const { client, login, accessToken, getProfile, createPod } = useLens()
  const { data } = useSigner()
  const { address } = useAccount()

  const onFinish = async (values: any) => {
    console.log(values)
    if ((client && address) && !accessToken) {
      await login(address!, data)
    }
    if (address) {
      if (accessToken) {
        await getProfile(address!)
        await createPod(values)
      }
    }
  }

  return <Layout>
    <Header className={styles.header}>
      <div className={styles.logo}>Frens Pod</div>
      <ConnectButton showBalance={false} />
    </Header>
    <Content className={styles.body}>
      <Card title="Create Pod" bordered={false} style={{ width: 350 }}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please choose a title of your pod!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: false, message: 'Please put a short description!' }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
            <Checkbox>Record Session</Checkbox>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Create & Join
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Content>
  </Layout>
}

export default HomePage;