import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { WebhookPayload, ActionType } from './webhook.controller';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);
  private readonly telegramApiUrl: string;
  private readonly chatId: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.telegramApiUrl = this.configService.get<string>('TELEGRAM_API_URL') || '';
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID') || '';

    if (!this.telegramApiUrl || !this.chatId) {
      this.logger.warn('Telegram configuration is missing');
    }
  }

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
    const { action, symbol, price, time } = payload;
    const isBuy = action === ActionType.BUY;

    const header = isBuy ? '<b>BUY SIGNAL ALERT</b> 🟢' : '🔻 <b>SELL SIGNAL ALERT</b> 🔴';
    const strategies = isBuy ? 'Long' : 'Short';

    return `
${header}

<b>💎 Symbol:</b> #${symbol || 'UNKNOWN'}
<b>⚡ Side:</b> ${strategies} (${action})
<b>💰 Price:</b> ${price ? price : 'Market'}
<b>⏰ Time:</b> ${time || new Date().toISOString()}

<i>— 🤖 TradingView Webhook —</i>
    `.trim();
  }
}
