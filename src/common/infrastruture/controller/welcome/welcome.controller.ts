import { Controller, Get } from '@nestjs/common';

@Controller()
export class WelcomeController {
  @Get()
  welcome() {
    const baseUrl = process.env.APP_HOST + ':' + process.env.APP_PORT + '/api/';

    return {
      characters: baseUrl + 'character',
      episodes: baseUrl + 'episode',
      appearances: baseUrl + 'appearance',
    };
  }
}
