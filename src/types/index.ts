// 配置类型定义
import type { Key } from 'ink';

type SSHItem = {
  key: number;
  host: string;
  user: string;
  port: number;
  password: string;
  tag?: string;
  remark?: string;
};

enum modeType {
  normal = 'normal',
  create = 'create',
}
type ModeStore = {
  mode: string;
  setMode: (mode: modeType) => void;
};

type SSHItemOmitKey = Omit<SSHItem, 'key'>;

type inputMap = {
  [K in keyof Key | string]: ({
    setMode,
    sshConfigItem,
  }: { setMode: ModeStore['setMode']; sshConfigItem: SSHItem }) => void;
};
export type { SSHItem, SSHItemOmitKey, inputMap };
export { modeType };
