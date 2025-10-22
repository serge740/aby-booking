import { Controller, Get, Param, Post, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('callback')
  async flutterwaveCallback(
    @Query('tx_ref') txRef: string,
    @Query('transaction_id') transactionId: string,
    @Query('status') status: string,
    @Res() res: Response,
  ) {
    const redirectUrl = await this.paymentService.verifyPaymentAndGetRedirect(txRef, transactionId,status);
    return res.redirect(redirectUrl); // redirects the browser
  }
@Post('retry/:orderId')
async retryPayment(@Param('orderId') orderId: string) {
  return this.paymentService.retryPayment(orderId);
}
  
}
