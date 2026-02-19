import { Controller, Post, Body, Logger, BadRequestException } from '@nestjs/common';
import { WebhookService } from './webhook.service';

export enum ActionType {
    BUY = 'BUY',
    SELL = 'SELL',
}

export interface WebhookPayload {
    action: ActionType;
    symbol?: string;
    price?: number;
    time?: string;
}

@Controller('webhook')
export class WebhookController {
    private readonly logger = new Logger(WebhookController.name);

    constructor(private readonly webhookService: WebhookService) { }

    @Post()
    async handleWebhook(@Body() body: WebhookPayload) {
        this.logger.log(`Received webhook: ${JSON.stringify(body)}`);

        // Validate Action
        if (!body.action || !Object.values(ActionType).includes(body.action as ActionType)) {
            throw new BadRequestException('Invalid action. Must be BUY or SELL.');
        }

        return this.webhookService.sendToTelegram(body);
    }
}
