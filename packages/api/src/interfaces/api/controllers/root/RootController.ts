import { Get, Controller } from 'routing-controllers'

@Controller('/')
export class RootController {
  @Get('/')
  public async root() {
    return 'API is running'
  }
}
