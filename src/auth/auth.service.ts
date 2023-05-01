import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { SignInDTO } from './dto/sign-in.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthCredentialsDTO,
  ): Promise<void | ConflictException> {
    return await this.userRepository.signUp(authCredentialsDto);
  }

  async signIn(signInDto: SignInDTO): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validateUserPassword(signInDto);

    if (!username) throw new UnauthorizedException('Invalid credentials');

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);

    return { accessToken };
  }
}
