export interface ClientPostRequestSenderInterface {
  post(url: string, data: any, authToken?: string): Promise<any>;
}
