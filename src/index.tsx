import React, { useState, useEffect } from 'react';
import { Key, render, Box, Transform } from 'ink';
import { Text } from 'ink';
import clipboardy from 'clipboardy';
import fs from 'fs';
import os from 'os';
import path from 'path';
import SelectInput from 'ink-select-input';
import { useInput } from 'ink';
import type { SSHItem, inputMap } from './types';
import formatSSHItem from './utils/formatSSHItem.ts';
import CreateConfig from './components/CreateConfig';
const CONFIG_FILE = path.join(os.homedir(), '.ssh-connect');

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
  upArrow: () => {
    console.log('upArrow');
  },
  '+': () => {
    console.log('+');
  },
};
//   upArrow: '↑',
//   downArrow: '↓',
//   backspace: '⌫',

// List 组件，显示配置列表
const List = () => {
  const [sshConfigs, setSshConfigs] = useState<SSHItem[]>(readConfig());
  const [selectedIndex, setSelectedIndex] = useState(0);

  // 监听输入
  useInput((input, key: Key) => {
    const inputInfo = Object.entries(key).find((item) => item[1]) as
      | [keyof typeof key, boolean]
      | undefined;

    const keyName = inputInfo?.[0] ?? input;
    const action = keyConfig[keyName];
    if (typeof action === 'function') {
      action();
    }
  });

  // 将数据映射成 SelectInput 需要的格式
  const items = sshConfigs.map(formatSSHItem);

  return (
    <>
      <Text>
        💻 以下是你的 SSH 配置（使用上下键选择，'a' 添加配置，'e'
        编辑配置，'退格' 删除配置，'c' 复制命令）：
      </Text>
      <SelectInput
        items={items}
        onHighlight={(item) => {
          console.log(item);
        }}
      />
    </>
  );
};

// 启动应用
const App = () => {
  const [mode, setMode] = useState('normal');
  useInput((input, key) => {
    if (key.escape) {
      setMode('normal');
    }
    if (input === '+') {
      setMode('input');
    }
  });
  if (mode === 'normal') return <List />;
  if (mode === 'input')
    return (
      <CreateConfig
        onCreate={(item) => {
          addConfig(item);
        }}
      />
    );
  return null;
};

render(<App />);
