import { JsonController, Delete, CurrentUser, Param, Get, Post, Body } from 'routing-controllers'

import { UserHelpCenterApplicationService } from 'application/oky/UserHelpCenterApplicationService'

@JsonController('/user-help-center')
export class UserHelpCenterController {
  public constructor(private userHelpCenterApplicationService: UserHelpCenterApplicationService) {}

  @Delete('/:id') // help center id
  public async unsaveHelpCenter(
    @Param('id') id: string | number,
    @CurrentUser({ required: true }) userId: string | null | number,
  ) {
    await this.userHelpCenterApplicationService.unsaveHelpCenter({
      userId,
      id,
    })
    return { userId }
  }

  @Get('/')
  public async findAll(@CurrentUser({ required: true }) userId: string | null | number) {
    return await this.userHelpCenterApplicationService.find({ userId })
  }

  @Post('/')
  public async save(
    @CurrentUser({ required: true }) userId: string | null | number,
    @Body()
    { helpCenterId }: any,
  ) {
    await this.userHelpCenterApplicationService.save({ userId, helpCenterId })
    return this.userHelpCenterApplicationService.find({ userId })
  }

  @Post('/bulkSave')
  public async bulkSave(
    @CurrentUser({ required: true }) userId: string | null | number,
    @Body()
    { helpCenterIds }: any,
  ) {
    return await this.userHelpCenterApplicationService.bulkSave({ helpCenterIds, userId })
  }
}
