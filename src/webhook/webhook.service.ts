import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { WebhookPayload, ActionType } from './webhook.controller';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly telegramApiUrl = 'https://api.telegram.org/bot7215709589:AAHGn3OItMjWnmPp8JnWxADNeJZl-bHd5C0/sendMessage';
  private readonly chatId = '-1002536103288';

  constructor(private readonly httpService: HttpService) { }

  async sendToTelegram(payload: WebhookPayload): Promise<any> {
    try {
      const message = this.formatMessage(payload);
      const telegramPayload = {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      };

      this.logger.log(`Sending message to Telegram: ${message}`);
      const response = await firstValueFrom(this.httpService.post(this.telegramApiUrl, telegramPayload));
      return response.data;
    } catch (error) {
      this.logger.error('Error sending message to Telegram', error.stack);
      throw error;
    }
  }

  private formatMessage(payload: WebhookPayload): string {
    const { action, symbol, price } = payload;
    const isBuy = action === ActionType.BUY;

    const emoji = isBuy ? '🟢' : '🔴';
    const title = isBuy ? '<b>BUY SIGNAL</b>' : '<b>SELL SIGNAL</b>';
    const symbolText = symbol ? `\n<b>Symbol:</b> ${symbol}` : '';
    const priceText = price ? `\n<b>Price:</b> ${price}` : '';

    return `${emoji} ${title} ${emoji}${symbolText}${priceText}`;
  }
}
