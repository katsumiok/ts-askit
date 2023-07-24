export interface Config {
  openai_model: 'gpt-3.5-turbo' | 'gpt-3.5-turbo-16k' | 'gpt-4' | string;
  openai_apiKey: string;
}

let config: Config = {
  openai_model: 'gpt-3.5-turbo',
  openai_apiKey: process.env.OPENAI_API_KEY || '',
};

const observers: Array<(config: Config) => void> = [];

export function configure(newConfig: Partial<Config>) {
  config = { ...config, ...newConfig };

  // Notify all observers about the change.
  observers.forEach((observer) => observer(config as Config));
}

export function subscribe(observer: (config: Config) => void) {
  observers.push(observer);
}

export function getConfig(): Readonly<Config> {
  return config;
}
