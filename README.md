# NestJS Webhook to Telegram

This project implements a bridge between TradingView webhooks and Telegram. It receives alerts from TradingView and forwards them to a flexible Telegram bot.

## API Specification

### POST /webhook

Endpoint to receive webhook events from TradingView or other sources.

**URL:** `/webhook`
**Method:** `POST`
**Content-Type:** `application/json`

#### Request Body

The endpoint accepts a JSON object. It looks for a `msg` field to use as the message text. If `msg` is not present, it will stringify the entire body.

**Example 1 (Standard):**
```json
{
  "msg": "BTCUSD Buy Signal @ 45000"
}
```

**Example 2 (Raw Payload):**
```json
{
  "ticker": "BTCUSD",
  "price": 45000,
  "action": "buy"
}
```
*In Example 2, the message sent to Telegram will be the JSON string of the entire object.*

#### Response

- **201 Created**: Message successfully sent to Telegram.
- **500 Internal Server Error**: Failed to send message to Telegram.

## Configuration

The Telegram Bot credentials are currently hardcoded in `src/webhook/webhook.service.ts`:
- **Bot Token**: `7215709589:AAHGn3OItMjWnmPp8JnWxADNeJZl-bHd5C0`
- **Chat ID**: `-1002536103288`

## Running the App

```bash
# Installation
npm install

# Run locally
npm run start
```
