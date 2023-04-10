import { UserDto } from 'src/authentication/dto/registerUser.dto';

export function getUsername(input: string | UserDto, key: string): string {
  return typeof input === 'string' ? input : input[key];
}
