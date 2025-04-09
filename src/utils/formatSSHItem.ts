import type { SSHItem } from '../types';

// 格式化 SSH 命令
function formatSSHValue(item: SSHItem): string {
  return `ssh ${item.user}@${item.host} -p ${item.port}`;
}
function formatSSHItemKey(item: SSHItem): string {
  return `${item.user}@${item.host}:${item.port}`;
}
function formatSSHItemLabel(item: SSHItem): string {
  return `${item.remark || item.name} (${item.host}:${item.port})`;
}

function formatSSHItem(item: SSHItem) {
  return {
    label: formatSSHItemLabel(item),
    value: item,
    key: formatSSHItemKey(item),
  };
}

export default formatSSHItem;
