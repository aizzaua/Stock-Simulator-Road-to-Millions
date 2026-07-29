/**
 * 生成正态分布随机数（Box-Muller算法）
 */
export function normalRandom(mean: number = 0, stdDev: number = 1): number {
  let u1, u2;
  do {
    u1 = Math.random();
    u2 = Math.random();
  } while (u1 <= Number.EPSILON);

  const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  return z0 * stdDev + mean;
}

/**
 * 生成指定范围内的随机整数
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 从数组中随机选择一个元素
 */
export function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 生成随机ID
 */
export function randomId(): string {
  return Math.random().toString(36).substring(2, 15);
}
