import { ConfigProvider } from 'antd';

function AntDProvider({ children }: any) {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: '#0F5EFE' } }}>
      {children}
    </ConfigProvider>
  );
}

export default AntDProvider;
