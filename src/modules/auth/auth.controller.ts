import { SignInBody, SignUpBody } from '@modules/auth/auth.dto';
import { AuthService } from '@modules/auth/auth.service';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  signIn(@Body() body: SignInBody, @Req() req: Request, @Res() res: Response) {
    return this.authService.signIn(req, res, body.rememberMe);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(
    @Body() body: SignUpBody,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.authService.signUp(body, req, res);
  }

  @Delete('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@Req() req: Request, @Res() res: Response) {
    return this.authService.signOut(req, res);
  }
}
