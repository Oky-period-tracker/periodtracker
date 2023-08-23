import { JsonController, Post, Body, CurrentUser } from 'routing-controllers'

import { AnalyticsApplicationService } from 'application/oky/AnalyticsApplicationService'
import { AppendEventsRequest } from './requests/AppendEventsRequest'

@JsonController('/analytics')
export class AnalyticsController {
  public constructor(private analyticsApplicationService: AnalyticsApplicationService) {}

  @Post('/append-events')
  public async signup(
    @CurrentUser({ required: false }) userId: string | null,
    @Body()
    request: AppendEventsRequest,
  ) {
    const events = request.getEvents()

    await this.analyticsApplicationService.appendEvents({
      userId,
      events,
    })

    return { userId, events }
  }
}
