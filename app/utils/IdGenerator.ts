export class IdGenerator {
  static generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
}
