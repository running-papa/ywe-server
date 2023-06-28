import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ScreensService } from './screens.service';
import { UsersService } from 'src/users/v1/users.service';
import { OptionalAuthGuard } from 'src/auth/guards/nullable.guard';


@Controller('v1/screens')
@ApiTags('스크린 API')
export class ScreensController {
  constructor(
    private readonly ScreensService: ScreensService,
    private readonly UserServecie: UsersService) {}


    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('/home')
    @ApiOperation({
      summary: 'Home 스크린 표시 로그인 한 사람 ',
      description: 'Home 스크린 표시 API',
    })
    async getAuthHome(@Request() req) {
  
      return await this.ScreensService.getHome(req.user);
      
    }


  @Get('/home_local')
  @ApiOperation({
    summary: 'Home 스크린 표시 로그인 안한 사람 ',
    description: 'Home 스크린 표시 API',
  })
  async getlocalHome() {

    let user = {
      uuid : null,
      email : null,
      provider : null,
      nickName : '여우님',
      phone : null,
      fox : 0,
    }
    

    return await this.ScreensService.getHome(user);;
  }
 
  
}
