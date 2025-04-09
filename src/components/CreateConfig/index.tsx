import { useState } from 'react';
import TextInput from 'ink-text-input';
import { Box, Text, useInput } from 'ink';
import type { SSHItem, SSHItemOmitKey } from '../../types';

const stepLabels: (keyof SSHItemOmitKey)[] = [
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
  const [config, setConfig] = useState<string[]>([]);

  const label = stepLabels[step];
  const value = config[step] || '';

  const onChange = (value: string) => {
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
            const value = Object.fromEntries(
              stepLabels.map((label, index) => [label, config[index] || '']),
            ) as SSHItemOmitKey;
            onCreate({
              ...value,
              key
            });
          }}
        />
      </Box>
    </Box>
  );
}
export default CreateConfig;
