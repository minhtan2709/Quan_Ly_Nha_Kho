import { pbkdf2Sync } from 'crypto';

/**
 * Hàm mã hóa mật khẩu sử dụng thuật toán PBKDF2 với SHA512
 * @param password - Mật khẩu gốc
 * @param salt - Salt bí mật (nên là chuỗi ngẫu nhiên riêng biệt cho mỗi người dùng)
 * @returns Chuỗi mã hóa dạng hex
 */
export function hashPassword(password: string, salt: string): string {
  const iterations = 100_000;
  const keylen = 64;
  const digest = 'sha512';

  return pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
}
/**
 * So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
 * @param password - Mật khẩu người dùng nhập
 * @param salt - Salt đã lưu trong DB của user
 * @param hashedPassword - Hash password đã lưu trong DB của user
 * @returns true nếu đúng, false nếu sai
 */
export function comparePassword(password: string, salt: string, hashedPassword: string): boolean {
  const hashVerify = hashPassword(password, salt); // Hash lại password nhập vào với salt gốc
  return hashVerify === hashedPassword; // So sánh
}
