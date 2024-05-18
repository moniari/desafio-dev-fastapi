import { LoginDto } from "../dtos/login/login-dto";

export interface LoginApiInterface {
  execute(loginData: LoginDto): Promise<string | null>;
}
