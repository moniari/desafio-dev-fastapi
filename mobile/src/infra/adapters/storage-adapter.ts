import AsyncStorage from "@react-native-async-storage/async-storage";
import { TokenStorageInterface } from "src/domain/abstract/adapters/token-storage-interface";

export class StorageAdapter implements TokenStorageInterface {
  public async store(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error storing data in AsyncStorage:", error);
    }
  }

  public async get(key: string): Promise<any> {
    try {
      let value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null;
    }
  }
}
