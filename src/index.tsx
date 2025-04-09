import React, { useState, useEffect } from 'react';
import { Key, render, Box, Transform } from 'ink';
import { Text } from 'ink';
import fs from 'fs';
import os from 'os';
import path from 'path';
import SelectInput from 'ink-select-input';
import { useInput } from 'ink';
import type { SSHItem, inputMap } from './types';
import { modeType } from './types';
import formatSSHItem from './utils/formatSSHItem.ts';
import CreateConfig from './components/CreateConfig';
import { useMode, ModeProvider } from './store/mode';
import { spawn, execSync } from 'node:child_process';
import clipboard from 'clipboardy';
const CONFIG_FILE = path.join(os.homedir(), '.ssh-connect');

function executeSSH(item: SSHItem) {
  const { host, user, port } = item;
  const sshCommand = `ssh ${user}@${host} -p ${port || 22}`;

  console.log(`Executing: ${sshCommand}`);

  // Copy password to clipboard if available
  if (item.password) {
    clipboard.writeSync(item.password);
    console.log('Password copied to clipboard!');
  }

  try {
    // Unmount render if needed
    if (typeof render.unmount === 'function') {
      render.unmount();
    }

    // Execute SSH and replace the current process
    execSync(sshCommand, { stdio: 'inherit' });
  } catch (error) {
    // SSH process has ended
    console.log('SSH session ended');
  } finally {
    process.exit(0);
  }
}

// 读取配置文件
function readConfig(): SSHItem[] {
  if (!fs.existsSync(CONFIG_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

// 写入配置文件
function writeConfig(config: SSHItem[]) {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// 增加 SSH 配置
function addConfig(config: SSHItem) {
  const currentConfigs = readConfig();
  currentConfigs.push(config);
  writeConfig(currentConfigs);
}

// 删除 SSH 配置
function deleteConfig(name: string) {
  const currentConfigs = readConfig();
  const updatedConfigs = currentConfigs.filter(
    (config) => config.name !== name,
  );
  writeConfig(updatedConfigs);
}

// 编辑 SSH 配置
function editConfig(oldName: string, updatedConfig: SSHItem) {
  const currentConfigs = readConfig();
  const updatedConfigs = currentConfigs.map((config) =>
    config.name === oldName ? updatedConfig : config,
  );
  writeConfig(updatedConfigs);
}

const keyConfig: inputMap = {
  i: ({ setMode }) => {
    setMode(modeType.create);
  },
  return: ({ sshConfigItem }) => {
    console.log('return', sshConfigItem);
  },
  z: ({ sshConfigItem }) => {
    executeSSH(sshConfigItem);
  },
};

// List 组件，显示配置列表
const List = () => {
  const [sshList] = useState<SSHItem[]>(readConfig());
  // 将数据映射成 SelectInput 需要的格式
  const items = sshList.map(formatSSHItem);

  /**
   * 默认选中第一个
   */
  const defaultSshStringify = items?.[0].value || {};
  const [sshConfigItem, setSshConfigItem] =
    useState<SSHItem>(defaultSshStringify);

  const { setMode } = useMode();

  // 监听输入
  useInput((input, key: Key) => {
    const inputInfo = Object.entries(key).find((item) => item[1]) as
      | [keyof typeof key, boolean]
      | undefined;

    const keyName = inputInfo?.[0] ?? input;
    const action = keyConfig[keyName];
    if (typeof action === 'function') {
      action({ sshConfigItem, setMode });
    }
  });

  return (
    <>
      <Text>
        💻 以下是你的 SSH 配置（使用上下键选择，'a' 添加配置，'e' 编辑配置，'退格' 删除配置，'c' 复制命令）：
      </Text>
      <SelectInput<SSHItem>
        items={items}
        onHighlight={(item) => {
          setSshConfigItem(item.value);
        }}
      />
    </>
  );
};

// 启动应用
const App = () => {
  const { mode, setMode } = useMode();
  useInput((_, key) => {
    if (key.escape) {
      setMode(modeType.normal);
    }
  });
  if (mode === modeType.normal) return <List />;
  if (mode === modeType.create) {
    return (
      <CreateConfig
        onCreate={(item) => {
          addConfig(item);
        }}
      />
    );
  }
  return null;
};

render(
  <ModeProvider>
    <App />
  </ModeProvider>,
);
