// 配置类型定义
import type { Key } from 'ink';

type SSHItem =  {
  key: number;
  host: string;
  user: string;
  port: number;
  password: string;
  tag?: string;
  remark?: string;
}

type SSHItemPickKey = Omit<SSHItem, 'key'>;

type inputMap = {
  [K in keyof Key | string]: () => void;
};
export type { SSHItem, SSHItemPickKey ,inputMap };
