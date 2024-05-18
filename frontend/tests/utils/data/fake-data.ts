import { faker } from "@faker-js/faker";

export const FakeData = {
  email: (): string => faker.internet.email(),
  password: (): string => faker.internet.password(),
  word: (length = 10): string => faker.string.alphanumeric({ length }),
  id: (): string => faker.string.uuid(),
  numberInteger: (): number => faker.number.int(),
  phrase: (): string => faker.lorem.words(),
  url: (): string => faker.internet.url(),
  bool: (): boolean => faker.datatype.boolean(),
  date: (): string => faker.date.anytime().toISOString().split("T")[0],
  object: () => ({
    email: FakeData.email(),
    password: FakeData.password(),
    phrase: FakeData.phrase(),
    numberInteger: FakeData.numberInteger(),
    url: FakeData.url(),
    bool: FakeData.bool(),
    date: FakeData.date(),
  }),
};
