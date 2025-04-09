import { useState } from 'react';
import TextInput from 'ink-text-input';
import { Box, Text, useInput } from 'ink';
import type { SSHItem, SSHItemPickKey } from '../../types';
type label = keyof SSHItemPickKey;
const stepLabels: (keyof SSHItemPickKey)[] = [
  'host',
  'user',
  'port',
  'password',
  'tag',
  'remark',
];
type props = {
  onCreate: (item: SSHItem) => void;
};
function CreateConfig({ onCreate }: props) {
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<(keyof SSHItemPickKey)[]>([]);

  const label = stepLabels[step];
  const value = config[step] || '';

  const onChange = (value: label) => {
    const newConfig = [...config];
    newConfig[step] = value;
    setConfig(newConfig);
  };
  useInput((_, key) => {
    if (key.upArrow) {
      setStep((prevStep) => {
        if (prevStep > 0) {
          return prevStep - 1;
        }
        return prevStep;
      });
    }
    if (key.downArrow) {
      setStep((prevStep) => {
        if (prevStep < stepLabels.length - 1) {
          return prevStep + 1;
        }
        return prevStep;
      });
    }
  });
  return (
    <Box flexDirection='column'>
      <Box borderStyle='round' flexDirection='column'>
        {stepLabels.map((label, index) => {
          const styles =
            index === step
              ? { color: 'red', bold: true, backgroundColor: 'black' }
              : { color: 'white' };
          return (
            <Box key={label} borderBottom={true} borderColor='green'>
              <Text {...styles}>
                * {label}: {config[index]}
              </Text>
            </Box>
          );
        })}
      </Box>
      <Box>
        <Box>
          <Text>{label}:</Text>
        </Box>
        <TextInput
          value={value}
          onChange={onChange}
          onSubmit={() => {
            const key = new Date().getTime();
            const value = stepLabels.reduce((acc, label, index) => {
              acc[label] = config[index] || '';
              return acc;
            }, {} as SSHItemPickKey);
            onCreate({ ...value, key });
          }}
        />
      </Box>
    </Box>
  );
}
export default CreateConfig;
