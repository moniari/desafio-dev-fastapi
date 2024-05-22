import { PrivatePageProxy } from "src/presentation/proxies/private-page-proxy";

export const MakePrivatePageProxyFactory = (
  privatePage: React.FC,
  loginPageRoute: string
): React.FC<any> => {
  const page: React.FC<any> = () => (
    <PrivatePageProxy
      PrivatePage={privatePage}
      loginPageRoute={loginPageRoute}
    />
  );
  return page;
};