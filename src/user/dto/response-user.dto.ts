import { Exclude } from "class-transformer";

export class ResponseUserDto {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
  phone_number: string;
  password: string;
  @Exclude()
  salt: string; // Mã muối để băm mật khẩu
   

//   // Nếu muốn trả về thời gian tạo/cập nhật, hãy thêm vào entity và DTO
//    createdAt?: Date;
//    updatedAt?: Date;
}