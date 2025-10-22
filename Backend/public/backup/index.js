// import { Injectable, NotFoundException } from '@nestjs/common';
// import { AddressProcessorService } from '../../Global/RouteSense/address-processor.service';
// import { PricingService } from '../../Global/Pricing/pricing.service';
// import { PrismaService } from '../../Prisma/prisma.service';
// import { EmailService } from '../../Global/Messages/email/email.service';
// import { PaymentService } from '../../Global/Payment/payment.service';

// @Injectable()
// export class ReservationService {
//     constructor(
//         private addressProcessor: AddressProcessorService,
//         private pricingService: PricingService,
//         private emailService: EmailService,
//         private prisma: PrismaService,
//         private paymentService: PaymentService,
//     ) {}

//     private async handlePaymentMethod(
//         method: string,
//         amount: number,
//         email: string,
//         pickup: string,
//         dropoff: string,
//         reservationId: string
//     ) {
//         const paymentHandlers = {
//             'card': async() => {
//                 const session = await this.paymentService.createStripeSession({
//                     amount,
//                     email,
//                     pickup,
//                     dropoff,
//                     reservationId,
//                 });

//                 const paymentIntentId = typeof session.payment_intent === 'string' ?
//                     session.payment_intent :
//                     session.payment_intent ? .id ? ? null;

//                 return {
//                     url: session.url,
//                     sessionId: session.id,
//                     intentId: paymentIntentId,
//                     status: 'pending',
//                     note: null,
//                 };
//             },

//             'paypal': async() => {
//                 const payment = await this.paymentService.createPayPalPayment({
//                     amount,
//                     email,
//                     pickup,
//                     dropoff,
//                 });

//                 return {
//                     url: payment.url,
//                     sessionId: payment.orderId,
//                     intentId: null,
//                     status: 'pending',
//                     note: null,
//                 };
//             },

//             'cash app': async() => ({
//                 url: null, // Do not send invalid links
//                 sessionId: null,
//                 intentId: null,
//                 status: 'pending',
//                 note: `Please send $${amount.toFixed(2)} to $abyridellc via Cash App and include your email (${email}) in the note.`,
//             }),

//             'cash': async() => ({
//                 url: null,
//                 sessionId: null,
//                 intentId: null,
//                 status: 'not_required',
//                 note: `Please bring $${amount.toFixed(2)} in cash to your scheduled ride. Thank you!`,
//             }),
//         };

//         const normalizedMethod = method.toLowerCase().trim();
//         if (!(normalizedMethod in paymentHandlers)) {
//             throw new NotFoundException(`Unsupported payment method: ${method}`);
//         }

//         return paymentHandlers[normalizedMethod]();
//     }

//     async handleReservation(reservationData: any) {

//         console.log('Received reservation data:', reservationData);

//         const {
//             firstName,
//             lastName,
//             customerEmail,
//             customerPhone,
//             pickupAddress,
//             dropoffAddress,
//             scheduledDateTime,
//             numberOfPassengers,
//             carCategory,
//             paymentMethod,
//             riderType,
//             otherRiderData,
//         } = reservationData;

//         const distanceData = await this.addressProcessor.calculateDistanceAndTraffic(
//             pickupAddress,
//             dropoffAddress,
//         );

//         const { price } = await this.pricingService.getTotalPrice({
//             carCategoryId: Number(carCategory),
//             distanceKm: distanceData.distance,
//             numberOfPassengers: Number(numberOfPassengers),
//         });

//         const reservation = await this.prisma.reservation.create({
//             data: {
//                 firstName,
//                 lastName,
//                 email: customerEmail,
//                 phoneNumber: customerPhone,
//                 pickup: pickupAddress,
//                 dropoff: dropoffAddress,
//                 scheduledDateTime: new Date(scheduledDateTime),
//                 numberOfPassengers,
//                 distance: distanceData.distance,
//                 duration: distanceData.duration,
//                 price,
//                 paymentStatus: 'initiated',
//                 paymentUrl: '',
//                 paymentSessionId: '',
//                 paymentIntentId: '',
//                 carCategoryId: Number(carCategory),
//                 paymentMethod,
//                 riderType,
//                 otherRiderFirstName: riderType === 'someoneElse' ? otherRiderData ? .firstName : null,
//                 otherRiderLastName: riderType === 'someoneElse' ? otherRiderData ? .lastName : null,
//                 otherRiderEmail: riderType === 'someoneElse' ? otherRiderData ? .email : null,
//                 otherRiderPhone: riderType === 'someoneElse' ? otherRiderData ? .phone : null,
//             },
//         });

//         const {
//             url: paymentUrl,
//             sessionId: paymentSessionId,
//             intentId: paymentIntentId,
//             status: paymentStatus,
//             note: paymentNote,
//         } = await this.handlePaymentMethod(
//             paymentMethod,
//             price,
//             customerEmail,
//             pickupAddress,
//             dropoffAddress,
//             reservation.id.toString(), // Convert ID to string for metadata
//         );

//         await this.prisma.reservation.update({
//             where: { id: reservation.id },
//             data: {
//                 paymentUrl: paymentUrl ? ? '',
//                 paymentSessionId: paymentSessionId ? ? '',
//                 paymentIntentId: paymentIntentId ? ? '',
//                 paymentStatus,
//             },
//         });

//         // Email to customer
//         await this.emailService.sendEmail(
//             customerEmail,
//             'Your AbyRide Reservation Confirmation',
//             'client-confirmation-template', {
//                 firstName: reservation.firstName,
//                 lastName: reservation.lastName,
//                 pickup: reservation.pickup,
//                 dropoff: reservation.dropoff,
//                 scheduledDateTime: reservation.scheduledDateTime ? .toLocaleString() ? ? 'Not scheduled',
//                 numberOfPassengers: reservation.numberOfPassengers,
//                 distance: reservation.distance,
//                 duration: reservation.duration,
//                 price: `USD ${reservation.price.toFixed(2)}`,
//                 paymentUrl,
//                 paymentNote, // 👈 add this
//             }
//         );


//         // Email to admin/driver
//         await this.emailService.sendEmail(
//             'abyridellc@gmail.com',
//             'New Reservation Alert - AbyRide',
//             'driver-notification-template', {
//                 firstName: reservation.firstName,
//                 lastName: reservation.lastName,
//                 customerPhone: reservation.phoneNumber,
//                 customerEmail: reservation.email,
//                 pickup: reservation.pickup,
//                 dropoff: reservation.dropoff,
//                 scheduledDateTime: reservation.scheduledDateTime ? .toLocaleString() ? ? 'Not scheduled',
//                 numberOfPassengers: reservation.numberOfPassengers,
//                 distance: reservation.distance,
//                 duration: reservation.duration,
//                 price: `USD ${reservation.price.toFixed(2)}`,
//                 reservationId: reservation.id,
//             }
//         );

//         return {
//             success: true,
//             message: 'Reservation created successfully',
//             data: {
//                 ...distanceData,
//                 price,
//                 reservationId: reservation.id,
//                 paymentUrl,
//             },
//         };
//     }